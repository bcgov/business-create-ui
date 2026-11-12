import { RegistrationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from './steps'

export const RegistrationResourceSp: RegistrationResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.REGISTRATION_SP
  }],
  peopleAndRoles: {
    header: 'Add People to your Registration',
    blurb: [
      'Add the people and/or the business who will have a role in your proprietorship.',

      'The Completing Party must be a person, but the proprietor can be a person or a business.'
    ],
    helpSection: null,
    blurb2: [
      '<b>Add a person as the proprietor</b> if your business is owned and operated by one person.<br><br>' +
      '<b>Add a business as the proprietor</b> if an existing B.C. business would like to be known by another name. ' +
       'This is often referred to as <i>Doing Business As, DBA, Operating As</i> or <i>Trade Name.</i>'
    ],
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_PROPRIETORS,
        text: 'The Proprietor (a person or a business)',
        test: (num) => { return (num === 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: 'Note: It is an offence to make or assist in making a false or misleading ' +
        'statement in a record filed under the Partnership Act. A person who commits this ' +
        'offence is subject to a maximum fine of $5,000.',
      entityDisplay: GetCorpFullDescription(CorpTypeCd.SOLE_PROP)
    }
  }
}
