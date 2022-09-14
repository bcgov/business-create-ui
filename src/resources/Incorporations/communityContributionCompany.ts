import { IncorporationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, RuleIds } from '@/enums'
import { BaseStepsTemplate } from './stepTemplates'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const CommunityContributionCompanyResource: IncorporationResourceIF = {
  entityType: CorpTypeCd.BC_CCC,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_CCC),
  title: 'Community Contribution Company Statement',
  description: 'This company is a community contribution company, and, as such, has purposes beneficial to ' +
    'society. This company is restricted, in accordance with Part 2.2 of the BCA, in its ability to pay ' +
    'dividends and to distribute its assets on dissolution or otherwise.',
  statement: null,
  steps: BaseStepsTemplate,
  filingData: [{
    entityType: CorpTypeCd.BC_CCC,
    filingTypeCode: FilingCodes.INCORPORATION_CC
  }],
  peopleAndRoles: {
    header: '1. Add People or Corporations/Firms to your Application',
    blurb: `Add the people and Corporations/firms who will have a role in your company. People
      can have multiple roles; Corporations/firms can only be Incorporators.`,
    helpSection: null,
    addIncorporator: true,
    addOrganization: 'Add a Corporation or Firm',
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_INCORPORATORS,
        text: 'At least one Incorporator',
        test: (num) => { return (num >= 1) }
      },
      {
        id: RuleIds.NUM_DIRECTORS,
        text: 'At least three Directors',
        test: (num) => { return (num >= 3) }
      }
    ]
  },
  shareClasses: {
    countMinimum: 1
  },
  incorporationAgreement: {
    helpSection: [
      {
        header: 'How do I create an Incorporation Agreement and Articles?',
        helpText: [
          'We recommend seeking legal assistance in creating your Incorporation Agreement and Articles.'
        ]
      },
      {
        header: 'What are the community purposes?',
        helpText: [
          `One or more of the primary purposes of a community contribution company must be community purposes. These
            purposes must be set out in the company's articles.`
        ]
      },
      {
        header: 'Retain the signed Incorporation Agreement and Articles',
        helpText: [
          `The company is required to keep signed copies of the Incorporation Agreement and Articles in the company's
            record book. For a complete list of records a company is required to keep please see section 42 of the
            Business Corporations Act.`
        ]
      }
    ],
    article: 'Sample_articles.pdf',
    documents: [
      {
        code: 'sample',
        description: 'The <b>Incorporation Agreement and Articles</b> containing the community purposes has been ' +
          'completed and a copy has been added to the company\'s record book.'
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: `the Completing Party, have examined the Company
        Articles and the Incorporation Agreement applicable to the company that is to be
        incorporated by the filing of this Incorporation Application and confirm that:`,
      certifyStatements: [
        'An original signature has been placed on each of those signature lines,',

        `I have no reason to believe that the signature placed on a signature line is not the
          signature of the person whose name is set out under that signature line, and`,

        'I have relevant knowledge of the company and that I am authorized to make this filing.'
      ],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: null
    }
  }
}
