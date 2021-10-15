import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd, DissolutionStatementTypes, FilingCodes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { BaseDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const CooperativeDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  steps: BaseDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.COOP,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  },
  dissolutionStatements: [
    {
      code: DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197,
      description: 'The Cooperative Association has, by special resolution, voluntarily resolved to dissolve ' +
        'the Cooperative Association under section 197 of the Cooperative Association Act. ' +
        '<b>The Cooperative Association has no assets and has no liabilities.</b>'
    },
    {
      code: DissolutionStatementTypes.NO_ASSETS_PROVISIONS_LIABILITIES_197,
      description: 'The Cooperative Association has, by special resolution, voluntarily resolved to dissolve the ' +
        'Cooperative Association under section 197 of the Cooperative Association Act. <b>The Cooperative ' +
        'Association has no assets and has made provision for the payment of each of the Cooperative Association\'s ' +
        'unpaid liabilities</b> and has obtained the written consent to that provision for payment from each ' +
        'creditor whose identity is known to the Cooperative Association and who has an unpaid claim against the ' +
        'Cooperative Association that exceeds $200.00.'
    }
  ]
}
