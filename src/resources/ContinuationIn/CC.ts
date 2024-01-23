import { ContinuationInResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { ContinuationInSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const ContinuationInResourceCc: ContinuationInResourceIF = {
  entityType: CorpTypeCd.BC_CCC,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_CCC),
  steps: ContinuationInSteps,
  filingData: [{
    entityType: CorpTypeCd.BC_CCC,
    filingTypeCode: FilingCodes.CONTINUATION_IN
  }],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: `Add the people who will have a role in your company. People can
      have multiple roles.`,
    helpSection: null,
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_DIRECTORS,
        text: 'At least three Directors',
        test: (num) => { return (num >= 3) }
      }
    ]
  },
  shareClasses: {
    countMinimum: 1
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
