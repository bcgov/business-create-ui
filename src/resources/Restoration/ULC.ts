import { RestorationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { RestorationSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { ResourcePhrases } from '../ResourcePhrases'

export const RestorationResourceUlc: RestorationResourceIF = {
  entityType: CorpTypeCd.BC_ULC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY),
  steps: RestorationSteps,
  filingData: [
    // order matters - see getFilingData()
    {
      entityType: CorpTypeCd.BC_ULC_COMPANY,
      filingTypeCode: FilingCodes.RESTORATION_FULL
    },
    {
      entityType: CorpTypeCd.BC_ULC_COMPANY,
      filingTypeCode: FilingCodes.RESTORATION_LIMITED
    }
  ],
  peopleAndRoles: {
    header: 'Add Applicant Information',
    subheader: 'Your application must include one of the following:',
    blurb: null,
    helpSection: null,
    rules: [
      {
        id: RuleIds.NUM_APPLICANT_PERSON,
        text: 'An individual',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_APPLICANT_ORG,
        text: 'A business or corporation',
        test: (num) => { return (num === 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY)
    }
  }
}
