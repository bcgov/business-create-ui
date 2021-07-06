import { ResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const CooperativeResource: ResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  title: 'title placeholder',
  description: 'descriptor placeholder',
  statement: null,
  nameRequestType: null, // TBD
  steps: [],
  filingData: {
    filingTypeCode: FilingCodes.INCORPORATION_CP,
    entityType: CorpTypeCd.COOP
  },
  directors: {
    countMinimum: 3
  },
  shareClasses: {
    countMinimum: null // TBD
  },
  incorporationAgreement: {
    helpSection: [],
    article: `Sample_articles.pdf`,
    documents: [
      {
        code: 'sample',
        description: ''
      },
      {
        code: 'custom',
        description: ''
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: 'the Completing Party, have examined the Company Articles and ' +
        'Incorporation Agreement applicable to the company that is to be incorporated ' +
        'by the filing of this Incorporation Application and confirm that:',
      certifyStatements: [
        'The Articles and the Incorporation Agreement both contain a signature line for ' +
        'each person identified as an incorporator in the Incorporation Application with ' +
        'the name of that person set out legibly under the signature line,',

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
