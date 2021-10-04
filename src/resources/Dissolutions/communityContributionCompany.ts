import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { BaseDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const CommunityContributionCompanyDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.BC_CCC,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_CCC),
  steps: BaseDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.BC_CCC,
    filingTypeCode: null // TBD
  }
}
