import { RegistrationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, RuleIds } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from '@/resources/Registrations/stepTemplates'

export const SoleProprietorshipResource: RegistrationResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.REGISTRATION_SP
  }],
  peopleAndRoles: {
    header: '1. Add People to your Registration',
    blurb: [
      'Add the people or entity who will have a role in your business registration. A person ' +
        'can be both the Completing Party and the Proprietor.',

      'A Sole Proprietorship can have an individual as the proprietor or a business or a ' +
        'corporation as the proprietor. When a business or a corporation is the proprietor, ' +
        'it is commonly known as <b>Doing Business As</b> since an existing businss is being ' +
        'registered under another name and it is still a Sole Proprietorship registration.'
    ],
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
      certifyClause: 'Note: It is an offence to make or assist in making a false or misleading ' +
        'statement in a record filed under the Partnership Act. A person who commits this ' +
        'offence is subject to a maximum fine of $5,000.',
      entityDisplay: GetCorpFullDescription(CorpTypeCd.SOLE_PROP)
    }
  }
}
