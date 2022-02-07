import { RegistrationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from '@/resources/Registrations/stepTemplates'

export const SoleProprietorshipResource: RegistrationResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  nameRequestType: NameRequestTypes.FR,
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.REGISTRATION_SP
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
