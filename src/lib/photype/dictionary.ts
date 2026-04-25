export const VI_WORDS = [
  "bàn phím", "phím cơ", "switch", "keycap", "gõ phím", "tốc độ", "chính xác", "máy tính",
  "lập trình", "thiết kế", "không gian", "làm việc", "đam mê", "công nghệ", "trải nghiệm",
  "âm thanh", "mượt mà", "chiến thắng", "thử thách", "thần sấm", "rùa con", "tay đua",
  "hạnh phúc", "thành công", "sáng tạo", "tương lai", "phát triển", "kỹ năng", "thói quen",
  "tập trung", "kiên trì", "nỗ lực", "ước mơ", "khám phá", "học hỏi", "chia sẻ", "kết nối",
  "cộng đồng", "người chơi", "game thủ", "văn phòng", "hiệu suất", "tối ưu", "phong cách",
  "cá nhân", "tùy chỉnh", "độc đáo", "chất lượng", "uy tín", "tin cậy", "an toàn", "bảo mật",
  "màn hình", "chuột", "tai nghe", "lót chuột", "dây cáp", "nguồn", "vỏ case", "tản nhiệt",
  "ánh sáng", "hiệu ứng", "màu sắc", "rực rỡ", "tinh tế", "hiện đại", "cổ điển", "sang trọng",
  "bền bỉ", "êm ái", "nhạy bén", "linh hoạt", "thông minh", "nhanh nhẹn", "mạnh mẽ", "vượt trội",
  // ... thêm các từ thông dụng khác
  "gia đình", "bạn bè", "cuộc sống", "thời gian", "kỷ niệm", "yêu thương", "trân trọng",
  "học tập", "nghiên cứu", "kiến thức", "trí tuệ", "tâm hồn", "sức khỏe", "năng lượng",
  "vận động", "thể thao", "âm nhạc", "nghệ thuật", "du lịch", "ẩm thực", "văn hóa", "lịch sử",
  "thiên nhiên", "môi trường", "trái đất", "vũ trụ", "ngôi sao", "mặt trời", "mặt trăng"
];

export function generateText(length: number = 50): string {
  const words = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * VI_WORDS.length);
    words.push(VI_WORDS[randomIndex]);
  }
  return words.join(" ");
}

export function getRank(wpm: number) {
  if (wpm < 30) return { name: "Rùa Con", color: "text-gray-500", icon: "🐢" };
  if (wpm < 60) return { name: "Tay Đua", color: "text-blue-500", icon: "🏎️" };
  if (wpm < 90) return { name: "Thần Sấm", color: "text-purple-500", icon: "⚡" };
  return { name: "Pho Master", color: "text-yellow-500", icon: "👑" };
}
