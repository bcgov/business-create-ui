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
        header: 'What is the sample Incorporation Agreement and BC Community Contribution Company Articles?',
        helpText: [
          `The sample Incorporation Agreement and Company Articles is a template that you can use to create an 
            incorporation agreement and articles for your company. It uses all the standard provisions by legislation. 
            There are three types of samples depending on if you’re incorporating a Limited Company, a Benefit Company, 
            or a Community Contribution Company. There is currently no Incorporation Sample for Unlimited 
            Liability Companies.`,
          `If you would like to customize any other provisions in the Articles, you cannot use these samples. 
            We recommend seeking professional assistance from a lawyer or accountant to help you prepare your articles.`
        ]
      },
      {
        header: 'What is a Community Provision?',
        helpText: [
          `A Community Provision is a statement by the company of its benefits to society and its restrictions in its 
            ability to pay dividends and distribute assets.`,
          `A Community Contribution Company must include a community provision in its Articles.`
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
