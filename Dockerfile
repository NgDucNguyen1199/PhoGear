# GIAI ĐOẠN 1: Cài đặt base image
FROM node:20-alpine AS base

# GIAI ĐOẠN 2: Cài đặt dependencies
# Chỉ cài đặt khi package.json thay đổi để tận dụng Docker cache
FROM base AS deps
# Cần libc6-compat cho một số thư viện native
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# GIAI ĐOẠN 3: Xây dựng ứng dụng (Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Các biến môi trường cần thiết tại thời điểm build (nếu có)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Next.js thu thập dữ liệu ẩn danh, chúng ta có thể tắt nó đi
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# GIAI ĐOẠN 4: Chạy ứng dụng (Runner)
# Sử dụng image tối giản nhất để chạy trong môi trường production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tạo user để không chạy container với quyền root (bảo mật)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy các file cần thiết từ builder
COPY --from=builder /app/public ./public

# Tối ưu hóa: Sử dụng output standalone của Next.js giúp giảm size image cực mạnh
# Cần cấu hình output: 'standalone' trong next.config.ts
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Lệnh để khởi chạy ứng dụng sử dụng server.js (của standalone mode)
CMD ["node", "server.js"]
