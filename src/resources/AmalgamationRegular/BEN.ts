import { AmalgamationRegResourceIF } from '@/interfaces'
import { FilingCodes, RuleIds } from '@/enums'
import { AmalgamationRegularSteps } from './steps'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const AmalgamationRegResourceBen: AmalgamationRegResourceIF = {
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
    addIncorporator: true,
    addOrganization: true,
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
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: null
    }
  }
}
