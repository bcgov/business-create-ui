import { RouteNames, Views } from '@/enums'

/**
 * The dissolution steps object for Coops.
 */
export const DissolutionStepsCoop = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Define\nDissolution',
    to: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: Views.DISSOLUTION_DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Complete\n Special Resolution',
    to: RouteNames.DISSOLUTION_RESOLUTION,
    component: Views.DISSOLUTION_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Upload\nAffidavit',
    to: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: Views.DISSOLUTION_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: Views.DISSOLUTION_REVIEW_CONFIRM
  }
]

/**
 * The dissolutions steps object for corps.
 * Currently used for BEN, BC, ULC and CCC.
 */
export const DissolutionStepsCorp = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Define\nDissolution',
    to: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: Views.DISSOLUTION_DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Complete\nResolution',
    to: RouteNames.DISSOLUTION_RESOLUTION,
    component: Views.DISSOLUTION_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Complete\nAffidavit',
    to: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: Views.DISSOLUTION_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: Views.DISSOLUTION_REVIEW_CONFIRM
  }
]

/**
 * The dissolution steps object for firms (SP and GP).
 * Note that the stepper is hidden via meta property in route object
 * but we still need 1 step to define the dynamic component.
 */
export const DissolutionStepsFirm = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain-remove',
    text: 'Dissolution',
    to: RouteNames.DISSOLUTION_FIRM,
    component: Views.DISSOLUTION_FIRM
  }
]
