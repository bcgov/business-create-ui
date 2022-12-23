import { RouteNames, Views } from '@/enums'

/**
 * The base step template.
 * Currently used for BEN, BC, ULC and CCC.
 */
export const BaseStepsTemplate = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your\nCompany',
    to: RouteNames.INCORPORATION_DEFINE_COMPANY,
    component: Views.INCORPORATION_DEFINE_COMPANY
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: RouteNames.INCORPORATION_PEOPLE_ROLES,
    component: Views.INCORPORATION_PEOPLE_ROLES

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-sitemap',
    text: 'Create Share\nStructure',
    to: RouteNames.INCORPORATION_SHARE_STRUCTURE,
    component: Views.INCORPORATION_SHARE_STRUCTURE
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-handshake',
    text: 'Incorporation\nAgreement',
    to: RouteNames.INCORPORATION_AGREEMENT,
    component: Views.INCORPORATION_AGREEMENT
  },
  {
    id: 'step-5-btn',
    step: 5,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.INCORPORATION_REVIEW_CONFIRM,
    component: Views.INCORPORATION_REVIEW_CONFIRM
  }
]

/**
 * The step template for COOPs.
 */
export const CoopStepsTemplate = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your\nCooperative',
    to: RouteNames.INCORPORATION_DEFINE_COMPANY,
    component: Views.INCORPORATION_DEFINE_COMPANY
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: RouteNames.INCORPORATION_PEOPLE_ROLES,
    component: Views.INCORPORATION_PEOPLE_ROLES
  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-format-list-text',
    text: 'Upload Rules',
    to: RouteNames.INCORPORATION_RULES,
    component: Views.INCORPORATION_RULES
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-multiple',
    text: 'Upload\nMemorandum',
    to: RouteNames.INCORPORATION_MEMORANDUM,
    component: Views.INCORPORATION_MEMORANDUM
  },
  {
    id: 'step-5-btn',
    step: 5,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.INCORPORATION_REVIEW_CONFIRM,
    component: Views.INCORPORATION_REVIEW_CONFIRM
  }
]
