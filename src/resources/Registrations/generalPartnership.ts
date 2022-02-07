import { RegistrationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from '@/resources/Registrations/stepTemplates'

export const GeneralPartnershipResource: RegistrationResourceIF = {
  entityType: CorpTypeCd.PARTNERSHIP,
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  nameRequestType: NameRequestTypes.GP,
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.PARTNERSHIP,
    filingTypeCode: FilingCodes.REGISTRATION_GP
  }],
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: 'Note: It is an offence to make or assist in making a false or misleading statement in a record' +
        'filed under the Partnership Act. A person who commits this offence is subject to a maximum fine of $5,000.',
      entityDisplay: null
    }
  }
}
