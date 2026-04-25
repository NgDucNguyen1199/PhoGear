/**
 * Hàm tự động tạo SKU từ tên sản phẩm và tên biến thể
 * Ví dụ: generateSKU("Yunzii B75 Pro", "White Heart") -> "YZB75P-WH"
 */
export function generateSKU(productName: string, variantName: string): string {
  const getAbbreviation = (str: string) => {
    return str
      .split(' ')
      .map(word => {
        // Lấy chữ cái đầu và các chữ số nếu có
        const matches = word.match(/[A-Z0-9]/g);
        if (matches) return matches.join('');
        return word[0]?.toUpperCase() || '';
      })
      .join('')
      .replace(/[^A-Z0-9]/g, ''); // Loại bỏ ký tự đặc biệt
  };

  const productCode = getAbbreviation(productName);
  const variantCode = getAbbreviation(variantName);

  return `${productCode}-${variantCode}`;
}
