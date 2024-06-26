export function generateRandomCode(): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  return code;
}
