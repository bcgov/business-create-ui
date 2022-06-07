import { CorpTypeCd, EntityState } from '@/enums'

export interface BusinessLookupIF {
  identifier: string
  name: string
  bn?: string
}

export const EmptyBusinessLookup: BusinessLookupIF = {
  identifier: null,
  name: null
}

export interface BusinessLookupResultIF {
  identifier: string
  legalType: CorpTypeCd
  bn: string
  status: EntityState
  name: string
}
