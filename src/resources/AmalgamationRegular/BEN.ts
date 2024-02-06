import { AmalgamationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationRegularSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const AmalgamationRegResourceBen: AmalgamationResourceIF = {
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  steps: AmalgamationRegularSteps,
  filingData: [{
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    filingTypeCode: FilingCodes.AMALGAMATION_REGULAR
  }],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: `Add the people who will have a role in the amalgamated business. A person can be
      both the Completing Party and a Director.`,
    helpSection: null,
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_DIRECTORS,
        text: 'At least one Director',
        test: (num) => { return (num >= 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [
        'I have relevant knowledge of the business and that I am authorized to make this filing.',
        'I understand that this amalgamation cannot be reversed without a court order.'
      ],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: null
    }
  }
}
