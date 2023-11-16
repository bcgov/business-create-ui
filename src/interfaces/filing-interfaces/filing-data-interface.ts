import { FilingCodes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'

/** Filing data for SBC Fee Summary component. */
export interface FilingDataIF {
  entityType: CorpTypeCd
  filingTypeCode: FilingCodes
  filingDescription?: string
  waiveFees?: boolean
  priority?: boolean
  futureEffective?: boolean
}
