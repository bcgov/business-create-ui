import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationRegularSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const AmalgamationRegResourceC: AmalgamationResourceIF = {
  entityType: CorpTypeCd.CONTINUE_IN,
  displayName: GetCorpFullDescription(CorpTypeCd.CONTINUE_IN),
  steps: AmalgamationRegularSteps,
  filingData: [{
    entityType: CorpTypeCd.CONTINUE_IN,
    filingTypeCode: FilingCodes.AMALGAMATION_REGULAR
  }],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: `Add the people who will have a role in the amalgamated business. A person can be
      both the Completing Party and a Director.`,
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
      certifyStatements: [
        ResourcePhrases.AMALGAMATION_CANNOT_BE_REVERSED
      ],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427
    }
  }
}
