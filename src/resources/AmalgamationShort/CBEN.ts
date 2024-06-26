import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationShortSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const AmalgamationShortResourceCben: AmalgamationResourceIF = {
  entityType: CorpTypeCd.BEN_CONTINUE_IN,
  displayName: GetCorpFullDescription(CorpTypeCd.BEN_CONTINUE_IN),
  steps: AmalgamationShortSteps,
  filingData: [
    // order matters - see getFilingData()
    {
      entityType: CorpTypeCd.BEN_CONTINUE_IN,
      filingTypeCode: FilingCodes.AMALGAMATION_HORIZONTAL
    },
    {
      entityType: CorpTypeCd.BEN_CONTINUE_IN,
      filingTypeCode: FilingCodes.AMALGAMATION_VERTICAL
    }
  ],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: 'Add the Completing Party to this application',
    helpSection: null,
    addPerson: false,
    showDirectors: false,
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
      certifyStatements: [
        ResourcePhrases.AMALGAMATION_CANNOT_BE_REVERSED
      ],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427,
      entityDisplay: 'business'
    }
  }
}
