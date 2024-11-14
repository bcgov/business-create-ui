import { RestorationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { RestorationSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const RestorationResourceC: RestorationResourceIF = {
  entityType: CorpTypeCd.CONTINUE_IN,
  displayName: GetCorpFullDescription(CorpTypeCd.CONTINUE_IN),
  steps: RestorationSteps,
  filingData: [
    // order matters - see getFilingData()
    {
      entityType: CorpTypeCd.CONTINUE_IN,
      filingTypeCode: FilingCodes.RESTORATION_FULL
    },
    {
      entityType: CorpTypeCd.CONTINUE_IN,
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
      certifyClause: `Note: It is an offence to make or assist in making a false or misleading
        statement in a record filed under the BC Corporations Act. A person who commits this
        offence is subject to a maximum fine of $5,000.`
    }
  }
}
