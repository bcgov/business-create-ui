import { CorpTypeCd, FilingCodes } from '@/enums'

/** Filing data for SBC Fee Summary component. */
export interface FilingDataIF {
  entityType: CorpTypeCd
  filingTypeCode: FilingCodes
  filingDescription?: string
  waiveFees?: boolean
  priority?: boolean
  futureEffective?: boolean
}
