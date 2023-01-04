import { RouteNames, Views } from '@/enums'

/**
 * The Restoration step template.
 */
export const RestorationSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-plus',
    text: 'Restore Business\nName',
    to: RouteNames.RESTORATION_BUSINESS_NAME,
    component: Views.RESTORATION_BUSINESS_NAME
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add Applicant\nInformation',
    to: RouteNames.RESTORATION_APPLICANT_INFORMATION,
    component: Views.RESTORATION_APPLICANT_INFORMATION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-domain',
    text: 'Confirm Business\nInformation',
    to: RouteNames.RESTORATION_BUSINESS_INFORMATION,
    component: Views.RESTORATION_BUSINESS_INFORMATION
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.RESTORATION_REVIEW_CONFIRM,
    component: Views.RESTORATION_REVIEW_CONFIRM
  }
]
