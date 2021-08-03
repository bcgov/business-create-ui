import { RouteNames, ViewComponentNames } from '@/enums'

/** The base step template.
 * Currently used for BEN, BC, ULC and CCC.
 */
export const BaseStepsTemplate = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your\nCompany',
    to: RouteNames.DEFINE_COMPANY,
    component: ViewComponentNames.DEFINE_COMPANY
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: RouteNames.ADD_PEOPLE_AND_ROLES,
    component: ViewComponentNames.ADD_PEOPLE_AND_ROLES

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-sitemap',
    text: 'Create Share\nStructure',
    to: RouteNames.CREATE_SHARE_STRUCTURE,
    component: ViewComponentNames.CREATE_SHARE_STRUCTURE
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-handshake',
    text: 'Incorporation\nAgreement',
    to: RouteNames.INCORPORATION_AGREEMENT,
    component: ViewComponentNames.INCORPORATION_AGREEMENT
  },
  {
    id: 'step-5-btn',
    step: 5,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.REVIEW_CONFIRM,
    component: ViewComponentNames.REVIEW_CONFIRM
  }
]

/** The step templates for COOPs. */
export const CoopStepsTemplate = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your\nCooperative',
    to: RouteNames.DEFINE_COMPANY,
    component: ViewComponentNames.DEFINE_COMPANY
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add First\nDirectors',
    to: RouteNames.ADD_PEOPLE_AND_ROLES,
    component: ViewComponentNames.ADD_PEOPLE_AND_ROLES

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-format-list-text',
    text: 'Upload Rules',
    to: RouteNames.CREATE_RULES,
    component: ViewComponentNames.CREATE_RULES
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-multiple',
    text: 'Upload\nMemorandum',
    to: RouteNames.CREATE_MEMORANDUM,
    component: ViewComponentNames.CREATE_MEMORANDUM
  },
  {
    id: 'step-5-btn',
    step: 5,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.REVIEW_CONFIRM,
    component: ViewComponentNames.REVIEW_CONFIRM
  }
]
