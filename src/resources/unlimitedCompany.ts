import { ResourceIF } from '@/interfaces'
import { NameRequestTypes, RouteNames } from '@/enums'
import { BaseStepsTemplate } from './stepTemplates'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const UnlimitedCompanyResource: ResourceIF = {
  entityType: CorpTypeCd.BC_ULC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY),
  title: 'Unlimited Company Statement',
  description: null,
  statement: null,
  nameRequestType: NameRequestTypes.UL,
  steps: BaseStepsTemplate,
  directors: {
    countMinimum: 1
  },
  shareClasses: {
    countMinimum: 1
  },
  incorporationAgreement: [
    {
      code: 'Table-1',
      description: 'BC ULC description placeholder', // TBD
      summaryDescription: 'BC ULC description placeholder' // TBD
    },
    {
      code: 'custom',
      description: 'BC ULC description placeholder', // TBD
      summaryDescription: 'BC ULC description placeholder' // TBD
    }
  ],
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: 'the Completing Party, have examined the Unlimited Company ' +
        'Articles and the Incorporation Agreement applicable to the company that is to be ' +
        'incorporated by the filing of this Incorporation Application and confirm that:',
      certifyStatements: [
        'An original signature has been placed on each of those signature lines,',

        'I have no reason to believe that the signature placed on a signature line is not the ' +
        'signature of the person whose name is set out under that signature line, and',

        'I have relevant knowledge of the company and that I am authorized to make this filing.'
      ],
      certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
        'of a material fact in a record submitted to the Corporate Registry for filing. ' +
        'See section 427 of the Business Corporations Act.'
    }
  }
}
