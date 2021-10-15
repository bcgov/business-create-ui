import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { BaseDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const LimitedCompanyDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.BC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_COMPANY),
  steps: BaseDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.BC_COMPANY,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  }
}
