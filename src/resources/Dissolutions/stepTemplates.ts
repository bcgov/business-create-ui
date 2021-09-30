import { RouteNames, ViewComponentNames } from '@/enums'

/**
 * The base step template.
 * Currently used for BEN, BC, ULC and CCC.
 */
export const BaseDissolutionSteps = [
  {
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define \nDissolution',
    to: RouteNames.DEFINE_DISSOLUTION,
    component: ViewComponentNames.DEFINE_DISSOLUTION
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Upload Special \nResolution',
    to: RouteNames.UPLOAD_RESOLUTION,
    component: ViewComponentNames.UPLOAD_SPECIAL_RESOLUTION

  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: 'mdi-sitemap',
    text: 'Upload \nAffidavit',
    to: RouteNames.UPLOAD_AFFIDAVIT,
    component: ViewComponentNames.UPLOAD_AFFIDAVIT
  },
  {
    id: 'step-4-btn',
    step: 4,
    icon: 'mdi-handshake',
    text: 'Review \nand Confirm',
    to: RouteNames.REVIEW_CONFIRM_DISSOLUTION,
    component: ViewComponentNames.REVIEW_CONFIRM_DISSOLUTION
  }
]
