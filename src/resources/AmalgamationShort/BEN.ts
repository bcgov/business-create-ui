import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationShortSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const AmalgamationShortResourceBen: AmalgamationResourceIF = {
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  steps: AmalgamationShortSteps,
  filingData: [
    // order matters - see getFilingData()
    {
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      filingTypeCode: FilingCodes.AMALGAMATION_HORIZONTAL
    },
    {
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      filingTypeCode: FilingCodes.AMALGAMATION_VERTICAL
    }
  ],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: 'Add the Completing Party to this application',
    helpSection: null,
    addPerson: false,
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: null
    }
  }
}
