export interface BusinessLookupIF {
  identifier: string
  name: string
  bn?: string
}

export const EmptyBusinessLookup: BusinessLookupIF = {
  identifier: null,
  name: null,
  bn: null
}

export interface BusinessLookupResultIF {
  identifier: string
  legalType: string
  bn: string
  status: string
  name: string
}
