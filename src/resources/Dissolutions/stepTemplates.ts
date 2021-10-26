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
    to: RouteNames.DEFINE_DISSOLUTION,
    component: ViewComponentNames.DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Upload Special \nResolution',
    to: RouteNames.UPLOAD_RESOLUTION,
    component: ViewComponentNames.UPLOAD_SPECIAL_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Upload \nAffidavit',
    to: RouteNames.UPLOAD_AFFIDAVIT,
    component: ViewComponentNames.UPLOAD_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review \nand Confirm',
    to: RouteNames.REVIEW_CONFIRM_DISSOLUTION,
    component: ViewComponentNames.REVIEW_CONFIRM_DISSOLUTION
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
    to: RouteNames.DEFINE_DISSOLUTION,
    component: ViewComponentNames.DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-handshake',
    text: 'Complete \nResolution',
    to: RouteNames.UPLOAD_RESOLUTION,
    component: ViewComponentNames.UPLOAD_SPECIAL_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-book-variant-multiple',
    text: 'Complete \nAffidavit',
    to: RouteNames.UPLOAD_AFFIDAVIT,
    component: ViewComponentNames.UPLOAD_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review \nand Confirm',
    to: RouteNames.REVIEW_CONFIRM_DISSOLUTION,
    component: ViewComponentNames.REVIEW_CONFIRM_DISSOLUTION
  }
]
