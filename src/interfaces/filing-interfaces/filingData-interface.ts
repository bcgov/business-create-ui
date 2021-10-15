import { CorpTypeCd, FilingCodes } from '@/enums'

export interface FilingDataIF {
  entityType: CorpTypeCd
  filingTypeCode: FilingCodes
  filingDescription?: string
  waiveFees?: boolean
  futureEffective?: boolean
}
