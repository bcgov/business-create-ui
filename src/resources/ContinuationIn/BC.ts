import { ContinuationInResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { ContinuationInSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const ContinuationInResourceBc: ContinuationInResourceIF = {
  entityType: CorpTypeCd.BC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_COMPANY),
  steps: ContinuationInSteps,
  filingData: [{
    entityType: CorpTypeCd.BC_COMPANY,
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
        text: 'At least one Director',
        test: (num) => { return (num >= 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: ResourcePhrases.OFFENSE_SECTION_427,
      entityDisplay: null
    }
  }
}
