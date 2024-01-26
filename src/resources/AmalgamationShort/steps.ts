import { RouteNames, Views } from '@/enums'

/**
 * The amalgamation (short-form) steps object.
 * Currently used for BC, BEN, CC and ULC.
 */
export const AmalgamationShortSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-plus',
    text: 'Amalgamation\nInformation',
    to: RouteNames.AMALG_SHORT_INFORMATION,
    component: Views.AMALGAMATION_INFORMATION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-domain',
    text: 'Amalgamated\nBusiness Information',
    to: RouteNames.AMALG_SHORT_BUSINESS_INFO,
    component: Views.AMALGAMATION_BUSINESS_INFO
  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: RouteNames.AMALG_SHORT_PEOPLE_ROLES,
    component: Views.AMALGAMATION_PEOPLE_ROLES

  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.AMALG_SHORT_REVIEW_CONFIRM,
    component: Views.AMALGAMATION_REVIEW_CONFIRM
  }
]
