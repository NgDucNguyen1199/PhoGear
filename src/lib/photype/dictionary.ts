export const VIETNAMESE_WORDS = [
  "là", "của", "và", "có", "trong", "một", "cho", "được", "với", "không", "những", "nhiều", "đã", "về", "như", "các", "người", "đến", "khi", "cũng",
  "đang", "đó", "tại", "này", "ra", "vào", "mới", "hơn", "sau", "rất", "thể", "phải", "lại", "thành", "từ", "con", "nói", "làm", "đi", "biết",
  "xem", "nào", "mình", "cách", "vì", "nên", "thời", "gian", "nơi", "việc", "sự", "ngày", "năm", "trước", "nhưng", "tôi", "anh", "chị", "em", "bạn",
  "cùng", "qua", "theo", "đây", "để", "muốn", "thấy", "lên", "vẫn", "đều", "nếu", "hay", "cần", "cứ", "chỉ", "đúng", "tốt", "đẹp", "cao", "lớn",
  "nhỏ", "ít", "xa", "gần", "trên", "dưới", "trong", "ngoài", "giữa", "bên", "chung", "riêng", "mỗi", "tất", "cả", "hết", "còn", "mất", "đã", "vừa",
  "mới", "sẽ", "được", "bị", "phải", "nên", "có", "không", "chưa", "đừng", "hãy", "thôi", "luôn", "thường", "ít", "đôi", "mọi", "từng", "vài", "nhau",
  "thế", "vậy", "rồi", "đâu", "kia", "nào", "ai", "gì", "sao", "bao", "giờ", "lúc", "khi", "nào", "đôi", "khi", "tại", "sao", "như", "thế", "nào",
  "vừa", "qua", "xong", "hết", "cả", "một", "cái", "chiếc", "bộ", "đám", "nhóm", "loại", "hàng", "số", "lượng", "mức", "phần", "điểm", "vấn", "đề",
  "chuyện", "việc", "làm", "hành", "động", "ý", "nghĩ", "tâm", "trạng", "tình", "cảm", "sức", "khỏe", "gia", "đình", "bạn", "bè", "xã", "hội", "nhà",
  "trường", "công", "ty", "văn", "phòng", "đất", "nước", "thế", "giới", "con", "người", "cuộc", "sống", "tương", "lai", "quá", "khứ", "hiện", "tại",
  "bàn phím", "phím cơ", "switch", "keycap", "lube", "stabilizer", "linear", "tactile", "clicky",
  "thocky", "clacky", "nhôm", "nhựa", "kết nối", "không dây", "bluetooth", "độ trễ", "phản hồi",
  "trải nghiệm", "gõ phím", "tốc độ", "chính xác", "đam mê", "góc làm việc", "setup", "ánh sáng",
  "rgb", "led", "cảm giác", "mượt mà", "âm thanh", "yên tĩnh", "văn phòng", "game thủ", "thiết kế",
  "công việc", "lập trình", "sáng tạo", "tập trung", "thành công", "tình yêu", "hạnh phúc", "cười",
  "công nghệ", "phần cứng", "phần mềm", "tối ưu", "hiệu suất", "tinh tế", "đẳng cấp", "phong cách"
];

export const ENGLISH_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "keyboard", "mechanical", "switch", "keycap", "stabilizer", "linear", "tactile", "clicky",
  "thocky", "clacky", "aluminum", "plastic", "connection", "wireless", "bluetooth", "latency",
  "feedback", "experience", "typing", "speed", "accuracy", "passion", "workspace", "setup",
  "lighting", "rgb", "led", "feeling", "smooth", "sound", "quiet", "office", "gamer", "design",
  "work", "programming", "creative", "focus", "success", "love", "happiness", "smile",
  "technology", "hardware", "software", "optimize", "performance", "elegant", "premium", "style"
];


export const QUOTES = {
  vi: [
    "Hành trình vạn dặm bắt đầu từ một bước chân đầu tiên.",
    "Bàn phím cơ không chỉ là công cụ, nó là người bạn đồng hành trong sự nghiệp.",
    "Tiếng thocky của switch linear giống như giai điệu của sự tập trung.",
    "Đam mê phím cơ là nghệ thuật của sự kiên nhẫn và tỉ mỉ."
  ],
  en: [
    "The only way to do great work is to love what you do.",
    "Mechanical keyboards are the ultimate interface between humans and machines.",
    "Precision is not just about speed, it is about every single keypress being intentional.",
    "In the world of custom keyboards, there are no limits to creativity."
  ]
};

const PUNCTUATIONS = [".", ",", "!", "?", ";", ":", "-", "(", ")", "\""];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const generateText = (
  count: number = 40, 
  lang: 'vi' | 'en' = 'vi',
  options?: { punctuation?: boolean, numbers?: boolean }
): string => {
  const dictionary = lang === 'vi' ? VIETNAMESE_WORDS : ENGLISH_WORDS;
  let words = [...dictionary].sort(() => 0.5 - Math.random()).slice(0, count);

  if (options?.punctuation) {
    words = words.map(word => {
      if (Math.random() > 0.8) {
        const p = PUNCTUATIONS[Math.floor(Math.random() * PUNCTUATIONS.length)];
        return word + p;
      }
      return word;
    });
  }

  if (options?.numbers) {
    words = words.map(word => {
      if (Math.random() > 0.85) {
        const n = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        return word + n;
      }
      return word;
    });
  }

  return words.join(" ");
};

export const generateQuote = (lang: 'vi' | 'en' = 'vi'): string => {
  const quotes = QUOTES[lang];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
