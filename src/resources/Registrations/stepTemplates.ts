import { RouteNames, ViewComponentNames } from '@/enums'

/**
 * The Registration step template.
 * Currently used for both Sole Props and General Partnerships.
 */
export const RegistrationSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your \nCompany',
    to: RouteNames.DEFINE_REGISTRATION,
    component: ViewComponentNames.DEFINE_REGISTRATION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Add People \nand Roles',
    to: RouteNames.REGISTER_PEOPLE_AND_ROLES,
    component: ViewComponentNames.REGISTER_PEOPLE_AND_ROLES

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.REGISTER_REVIEW_CONFIRM,
    component: ViewComponentNames.REGISTER_REVIEW_CONFIRM
  }
]
