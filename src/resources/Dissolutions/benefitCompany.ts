import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { BaseDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const BenefitCompanyDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  steps: BaseDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    filingTypeCode: null // TBD
  }
}
