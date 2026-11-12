import { RegistrationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from './steps'

export const RegistrationResourceGp: RegistrationResourceIF = {
  entityType: CorpTypeCd.PARTNERSHIP,
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.PARTNERSHIP,
    filingTypeCode: FilingCodes.REGISTRATION_GP
  }],
  peopleAndRoles: {
    header: 'Add People to your Registration',
    blurb: [
      'Add the people and/or the businesses who will have a role in your partnership.',

      'The Completing Party must be a person, but the partners can be people or businesses.'
    ],
    helpSection: null,
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_PARTNERS,
        text: 'At least two Partners',
        test: (num) => { return (num >= 2) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: 'Note: It is an offence to make or assist in making a false or misleading ' +
        'statement in a record filed under the Partnership Act. A person who commits this ' +
        'offence is subject to a maximum fine of $5,000.',
      entityDisplay: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP)
    }
  }
}
