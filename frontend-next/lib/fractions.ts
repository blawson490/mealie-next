export function decimalToFraction(amount: number): string {
  if (amount === 0) return "0";

  const tolerance = 0.01;
  const whole = Math.floor(amount);
  const decimal = amount - whole;

  if (decimal < tolerance) return whole.toString();
  if (1 - decimal < tolerance) return (whole + 1).toString();

  const commonFractions = [
    { val: 1 / 2, text: "½" },
    { val: 1 / 3, text: "⅓" },
    { val: 2 / 3, text: "⅔" },
    { val: 1 / 4, text: "¼" },
    { val: 3 / 4, text: "¾" },
    { val: 1 / 5, text: "⅕" },
    { val: 2 / 5, text: "⅖" },
    { val: 3 / 5, text: "⅗" },
    { val: 4 / 5, text: "⅘" },
    { val: 1 / 6, text: "⅙" },
    { val: 5 / 6, text: "⅚" },
    { val: 1 / 8, text: "⅛" },
    { val: 3 / 8, text: "⅜" },
    { val: 5 / 8, text: "⅝" },
    { val: 7 / 8, text: "⅞" },
    { val: 1 / 10, text: "⅒" },
  ];

  for (const { val, text } of commonFractions) {
    if (Math.abs(decimal - val) < tolerance) {
      return whole > 0 ? `${whole} ${text}` : text;
    }
  }

  // Fallback to /10
  const tenth = Math.round(decimal * 10);

  // Handle edge cases from rounding
  if (tenth === 0) return whole.toString();
  if (tenth === 10) return (whole + 1).toString();

  // Check if the rounded tenth matches a common fraction we already have unicode for
  // This handles cases like 0.4 -> 4/10 -> 2/5 -> ⅖
  const tenthVal = tenth / 10;
  for (const { val, text } of commonFractions) {
    if (Math.abs(tenthVal - val) < 0.001) {
      return whole > 0 ? `${whole} ${text}` : text;
    }
  }

  // If no unicode match (e.g. 3/10, 7/10, 9/10), return as x/10
  return whole > 0 ? `${whole} ${tenth}/10` : `${tenth}/10`;
}
