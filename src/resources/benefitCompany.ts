import { ResourceIF } from '@/interfaces'
import { NameRequestTypes, RouteNames } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const BenefitCompanyResource: ResourceIF = {
  entityType: CorpTypeCd.BENEFIT_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  title: 'Benefit Company Statement',
  description: `This company is a benefit company and, as such, has purposes that include conducting its business
        in a responsible and sustainable manner and promoting one or more public benefits.`,
  statement: null,
  nameRequestType: NameRequestTypes.BC,
  steps: [
    {
      id: 'step-1-btn',
      step: 1,
      icon: 'mdi-domain',
      text: 'Define Your\nCompany',
      to: RouteNames.DEFINE_COMPANY,
      component: 'define-company'
    },
    {
      id: 'step-2-btn',
      step: 2,
      icon: 'mdi-account-multiple-plus',
      text: 'Add People\nand Roles',
      to: RouteNames.ADD_PEOPLE_AND_ROLES,
      component: 'add-people-and-roles'

    },
    {
      id: 'step-3-btn',
      step: 3,
      icon: 'mdi-sitemap',
      text: 'Create Share\nStructure',
      to: RouteNames.CREATE_SHARE_STRUCTURE,
      component: 'create-share-structure'
    },
    {
      id: 'step-4-btn',
      step: 4,
      icon: 'mdi-handshake',
      text: 'Incorporation\nAgreement',
      to: RouteNames.INCORPORATION_AGREEMENT,
      component: 'incorporation-agreement'
    },
    {
      id: 'step-5-btn',
      step: 5,
      icon: 'mdi-text-box-check-outline',
      text: 'Review\nand Confirm',
      to: RouteNames.REVIEW_CONFIRM,
      component: 'review-confirm'
    }
  ],
  directors: {
    countMinimum: 1
  },
  shareClasses: {
    countMinimum: 1
  },
  incorporationAgreement: [
    {
      code: 'sample',
      description: 'The <b>sample Incorporation Agreement and Benefit Company Articles</b> containing a benefit ' +
        'provision have been completed and a copy added to the company\'s record book.',
      summaryDescription: 'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
        'provision have been completed and a copy added to the company\'s record book.'
    },
    {
      code: 'custom',
      description: 'A <b>custom Incorporation Agreement and custom Benefit Company Articles</b> containing ' +
        'a benefit provision have been completed and a copy added to the company\'s record book.',
      summaryDescription: 'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
        'a benefit provision have been completed and a copy added to the company\'s record book.'
    }
  ],
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: 'the Completing Party, have examined the Benefit Company ' +
        'Articles and the Incorporation Agreement applicable to the company that is to be ' +
        'incorporated by the filing of this Incorporation Application and confirm that:',
      certifyStatements: [
        'The Benefit Company Articles and the Incorporation Agreement both contain a signature ' +
        'line for each person identified as an incorporator in the Incorporation Application ' +
        'with the name of that person set out legibly under the signature line,',

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
