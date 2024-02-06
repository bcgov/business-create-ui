import { IncorporationResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { IncorporationStepsCorp } from './steps'
import { ResourcePhrases } from '../ResourcePhrases'

export const IncorporationResourceBc: IncorporationResourceIF = {
  entityType: CorpTypeCd.BC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_COMPANY),
  steps: IncorporationStepsCorp,
  filingData: [{
    entityType: CorpTypeCd.BC_COMPANY,
    filingTypeCode: FilingCodes.INCORPORATION_BC
  }],
  peopleAndRoles: {
    header: '1. Add People or Corporations/Firms to your Application',
    blurb: `Add the people and Corporations/firms who will have a role in your company. People
      can have multiple roles; Corporations/firms can only be Incorporators.`,
    helpSection: null,
    addIncorporator: true,
    addOrganization: true,
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
        text: 'At least one Director',
        test: (num) => { return (num >= 1) }
      }
    ]
  },
  shareClasses: {
    countMinimum: 1
  },
  incorporationArticles: {
    articles: '<br>BC LTD Articles.', // Line break is required to prevent tooltip from splitting the screen.
    articlesTooltip: 'Articles should outline the rules and procedures for corporate matters such as holding ' +
    'meetings, issuing and transferring shares, and duties of directors and officers.'
  },
  incorporationAgreement: {
    helpSection: [
      {
        header: 'What is the sample Incorporation Agreement and Company Articles?',
        helpText: [
          `The sample Incorporation Agreement and Company Articles is a template that you can use to create an 
            incorporation agreement and articles for your company. It uses all the standard provisions by legislation. 
            There are three types of samples depending on if you're incorporating a Limited Company, a Benefit Company, 
            or a Community Contribution Company.`,
          `If you would like to customize any other provisions in the Articles, you cannot use these samples. 
            We recommend seeking professional assistance from a lawyer or accountant to help you prepare your articles.`
        ]
      }
    ],
    article: 'bc_limited_company_incorporation_agreement.pdf',
    documents: [
      {
        code: 'sample',
        description: 'The <b>sample Incorporation Agreement and Articles</b> ' +
          'has been completed and a copy has been added to the company\'s record book.'
      },
      {
        code: 'custom',
        description: 'The <b>custom Incorporation Agreement and custom Articles</b> ' +
          'has been completed and a copy has been added to the company\'s record book.'
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [
        ResourcePhrases.ORIGINAL_SIGNATURE,
        ResourcePhrases.BELIEVE_SIGNATURE,
        ResourcePhrases.RELEVANT_KNOWLEDGE_OF_COMPANY
      ],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427,
      entityDisplay: null
    }
  }
}
