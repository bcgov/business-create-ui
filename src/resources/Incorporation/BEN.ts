import { IncorporationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, RuleIds } from '@/enums'
import { IncorporationStepsCorp } from './steps'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const IncorporationResourceBen: IncorporationResourceIF = {
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  steps: IncorporationStepsCorp,
  filingData: [{
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    filingTypeCode: FilingCodes.INCORPORATION_BEN
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
    articles: 'Benefit Company Articles',
    articlesTooltip: 'The Articles for a Benefit Company must state the benefits the company intends to provide to ' +
     'society, as well as outlining the rules and procedures for corporate matters such as holding meetings, ' +
     'issuing and transferring shares, and duties of directors and officers.',
    provisions: ' benefit provision',
    provisionTooltip: 'Clauses in the Articles which specify the public benefits to be promoted by the Benefit ' +
    'Company and the company\'s commitment to promote those benefits and to conduct business in a responsible and ' +
    'sustainable manner.'
  },
  incorporationAgreement: {
    helpSection: [
      {
        header: 'What is the sample Incorporation Agreement and Benefit Company Articles?',
        helpText: [
          `The sample Incorporation Agreement and Benefit Company Articles is a template that you can use
            to create an incorporation agreement and articles for your company. It uses all the standard
            provisions suggested by legislation and also includes a place to specify the company's benefit
            provision.`,
          `If you would like to customize any other provisions in the Articles, you cannot use this sample. We
            recommend seeking professional assistance from a lawyer or accountant to help you prepare your Articles.`
        ]
      },
      {
        header: 'What is a Benefit Provision?',
        helpText: [
          `A Benefit Provision is a statement by the company of its public benefits and its commitments to promote
            those public benefits and to conduct business in a responsible and sustainable manner.`,
          'A Benefit Company must include a benefit provision in its Articles.'
        ]
      },
      {
        header: 'Can I use the sample Incorporation Agreement and Benefit Company Articles?'
      },
      {
        header: 'You can use the sample Articles if:',
        icon: 'mdi-check',
        iconColor: 'green darken-2',
        statements: [
          `There are no special rights or restrictions attached to any class or series of shares in
            the corporation’s authorized share structure.`,
          'You do not wish to change any of the standard provisions in the sample Articles.'
        ]
      },
      {
        header: 'You cannot use the sample Articles if:',
        icon: 'mdi-close',
        iconColor: 'red',
        statements: [
          `There are special rights or restrictions attached to any class or series of shares in the corporation's
            authorized share structure.`,
          'You wish to change any of the standard provisions in the sample Articles.'
        ]
      }
    ],
    article: 'benefit_company_incorporation_agreement.pdf',
    documents: [
      {
        code: 'sample',
        description: 'The <b>sample Incorporation Agreement and Articles</b> containing a benefit provision ' +
          'has been completed and a copy has been added to the company\'s record book.'
      },
      {
        code: 'custom',
        description: 'The <b>custom Incorporation Agreement and custom Articles</b> containing a benefit provision ' +
          'has been completed and a copy has been added to the company\'s record book.'
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: `the Completing Party, have examined the Company
        Articles and the Incorporation Agreement applicable to the company that is to be
        incorporated by the filing of this Incorporation Application and confirm that:`,
      certifyStatements: [
        `The Company Articles and the Incorporation Agreement both contain a signature
          line for each person identified as an incorporator in the Incorporation Application
          with the name of that person set out legibly under the signature line,`,

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
