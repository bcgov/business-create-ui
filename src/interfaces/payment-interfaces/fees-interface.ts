/** Interfaces for Fees from Payment API. */
export interface FeesIF {
  filingFees: number
  filingType: string
  filingTypeCode: string
  futureEffectiveFees?: number
  priorityFees?: number
  processingFees?: number
  serviceFees?: number
  tax?: TaxesIF
  total?: number
}

export interface TaxesIF {
  pst: number
  gst: number
}

// NB: use cloneDeep when assigning EmptyOrgPerson
export const EmptyFees: FeesIF = {
  filingFees: null,
  filingType: null,
  filingTypeCode: null,
  futureEffectiveFees: null,
  priorityFees: null,
  processingFees: null,
  serviceFees: null,
  tax: {
    pst: null,
    gst: null
  },
  total: null
}
