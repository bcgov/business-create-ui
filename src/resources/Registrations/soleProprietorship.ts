import { RegistrationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes, RuleIds } from '@/enums'
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
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: 'Add the people or entity who will have a role in your business registration. ' +
      'A person can be both the Completing Party and the Proprietor.',
    helpSection: null,
    addIncorporator: false,
    addOrganization: true,
    addProprietor: true,
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_PROPRIETOR,
        text: 'The Proprietor (an individual or a business)',
        test: (num) => { return (num === 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: 'Note: It is an offence to make or assist in making a false or ' +
        'misleading statement in a record filed under the Partnership Act. A person who ' +
        'commits this offence is subject to a maximum fine of $5,000.',
      entityDisplay: GetCorpFullDescription(CorpTypeCd.SOLE_PROP)
    }
  }
}
