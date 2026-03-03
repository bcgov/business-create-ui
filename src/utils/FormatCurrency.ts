/** Returns an appropriately-formatted number, depending on its magnitude. */
export function FormatCurrency (value: number): string {
  // show very small numbers in scientific notation
  if (value < 1e-12) {
    // eg, 0.0000000000001 => "1.0E-13"
    // eg, 0.000000000000123 => "1.23E-13"
    return value.toLocaleString('en-US',
      { notation: 'scientific', minimumFractionDigits: 1, maximumFractionDigits: 20 }
    )
  }

  // numbers with at least 2 decimal places
  if (value < 1e7) {
    // eg, 0.00000000000292397
    // eg, 1.2345
    // eg, 100.00
    // eg, 9,999,999.99
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 20 })
  }

  // numbers with no decimal places
  if (value < 1e10) {
    // eg, 10,000,000
    // eg, 10,000,000.01
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 20 })
  }

  // show very large numbers in scientific notation
  // eg, 50,000,000,000 => "5.0E10"
  // eg, 1,234,000,000,000 => "1.234E12"
  return value.toLocaleString('en-US', { notation: 'scientific', minimumFractionDigits: 1, maximumFractionDigits: 20 })
}
