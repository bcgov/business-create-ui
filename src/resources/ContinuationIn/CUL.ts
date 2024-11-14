import { ContinuationInResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { ContinuationInSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const ContinuationInResourceCul: ContinuationInResourceIF = {
  entityType: CorpTypeCd.ULC_CONTINUE_IN,
  displayName: GetCorpFullDescription(CorpTypeCd.ULC_CONTINUE_IN),
  steps: ContinuationInSteps,
  filingData: [{
    entityType: CorpTypeCd.ULC_CONTINUE_IN,
    filingTypeCode: FilingCodes.CONTINUATION_IN
  }],
  pageBlurbDraft: `To continue in to B.C., you must first submit a Continuation Authorization and
    have it approved BC Registries before filing a Continuation Application.`,
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
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427
    }
  }
}
