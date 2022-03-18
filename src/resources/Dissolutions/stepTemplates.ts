import { RouteNames, ViewComponentNames } from '@/enums'

/**
 * The Coop step template.
 * Currently used for CP.
 */
export const CoopDissolutionSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Define \nDissolution',
    to: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: ViewComponentNames.DISSOLUTION_DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Complete \n Special Resolution',
    to: RouteNames.DISSOLUTION_RESOLUTION,
    component: ViewComponentNames.DISSOLUTION_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Upload \nAffidavit',
    to: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: ViewComponentNames.DISSOLUTION_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review \nand Confirm',
    to: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: ViewComponentNames.DISSOLUTION_REVIEW_CONFIRM
  }
]

/**
 * The Corp step template.
 * Currently used for BEN, BC, ULC and CCC.
 */
export const CorpDissolutionSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Define \nDissolution',
    to: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: ViewComponentNames.DISSOLUTION_DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Complete \nResolution',
    to: RouteNames.DISSOLUTION_RESOLUTION,
    component: ViewComponentNames.DISSOLUTION_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Complete \nAffidavit',
    to: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: ViewComponentNames.DISSOLUTION_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review \nand Confirm',
    to: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: ViewComponentNames.DISSOLUTION_REVIEW_CONFIRM
  }
]

/**
 * The stepper template is not needed for SP and GP filing types
 * Hiding of stepper is done by passign meta from route,
 * Still we need one minimum step to render component
 * Currently used for SP, GP.
 * Later we can fix, if we didnt pass stepper, UI should render without stepper
 */

export const CorpFirmDissolutionSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Dissolution',
    to: RouteNames.DISSOLUTION_FIRM,
    component: ViewComponentNames.DISSOLUTION_FIRM
  }
]
