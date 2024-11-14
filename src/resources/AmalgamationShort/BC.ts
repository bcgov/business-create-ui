import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationShortSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const AmalgamationShortResourceBc: AmalgamationResourceIF = {
  entityType: CorpTypeCd.BC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_COMPANY),
  steps: AmalgamationShortSteps,
  filingData: [
    // order matters - see getFilingData()
    {
      entityType: CorpTypeCd.BC_COMPANY,
      filingTypeCode: FilingCodes.AMALGAMATION_HORIZONTAL
    },
    {
      entityType: CorpTypeCd.BC_COMPANY,
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
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427
    }
  }
}
