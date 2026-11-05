import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AreOrgPersonsComplete } from '@/utils'
import { AmalgamationShortSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

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
    header: '1. Confirm Directors',
    blurb: null,
    helpSection: null,
    addPerson: false,
    showDirectors: true,
    readonlyDirectors: true,
    rules: [
      {
        id: RuleIds.COMPLETE_DIRECTOR_INFO,
        text: 'Complete Director information',
        test: (directors) => AreOrgPersonsComplete(directors)
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY)
    }
  }
}
