/**
 * Returns the number of significant digits in a number.
 * A Javascript number is a double-precision floating-point format (IEEE 754),
 * which has a precision of about 15-17 significant digits.
 */
export function SignificantDigits (val: any): number {
  // convert to string (may already be string)
  // remove leading/trailing spaces
  // remove commas
  let str = String(val).trim().replace(/,/g, '')

  // safety check
  if (!str) return 0

  // remove sign
  str = str.replace(/^[+-]/, '')

  // look at the mantissa
  // works for both regular numbers (eg, 1.23) and scientific notation (e.g. 1.23e+45)
  const [mantissa] = str.toLowerCase().split('e')

  // safety check
  if (!/^\d*\.?\d*$/.test(mantissa)) return 0

  // remove decimal point
  // remove leading and trailing zeros
  const digits = mantissa.replace('.', '').replace(/^0+/, '').replace(/0+$/, '')

  return digits.length || 1 // "0" or "0000" -> 1
}
