import { RouteNames, Views } from '@/enums'

/** The continuation in steps object when the filing is in "authorization mode". */
export const ContinuationInStepsAuthorization = [
  {
    id: 'step-0-btn',
    step: 0,
    icon: 'mdi-file-document-multiple-outline',
    text: 'Continuation\nAuthorization',
    to: RouteNames.CONTINUATION_IN_AUTHORIZATION,
    component: Views.CONTINUATION_IN_AUTHORIZATION
  }
]

/** The regular continuation in steps object. */
export const ContinuationInSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Your Business\nin B.C.',
    to: RouteNames.CONTINUATION_IN_BUSINESS_BC,
    component: Views.CONTINUATION_IN_BUSINESS_BC
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: RouteNames.CONTINUATION_IN_PEOPLE_ROLES,
    component: Views.CONTINUATION_IN_PEOPLE_ROLES

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-sitemap',
    text: 'Create Share\nStructure',
    to: RouteNames.CONTINUATION_IN_SHARE_STRUCTURE,
    component: Views.CONTINUATION_IN_SHARE_STRUCTURE
  },
  {
    id: 'step-5-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.CONTINUATION_IN_REVIEW_CONFIRM,
    component: Views.CONTINUATION_IN_REVIEW_CONFIRM
  }
]
