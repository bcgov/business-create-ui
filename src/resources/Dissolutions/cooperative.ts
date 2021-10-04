import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { BaseDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const CooperativeDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  steps: BaseDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.COOP,
    filingTypeCode: null // TBD
  }
}
