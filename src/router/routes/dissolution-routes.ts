import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const DissolutionRoutes = [
  {
    path: '/dissolution-define-dissolution',
    name: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: Views.DissolutionDefineDissolution,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-resolution',
    name: RouteNames.DISSOLUTION_RESOLUTION,
    component: Views.DissolutionResolution,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-affidavit',
    name: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: Views.DissolutionAffidavit,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-review-confirm',
    name: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: Views.DissolutionReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  }
]

export const DissolutionFirmRoutes = [
  {
    path: '/dissolution-firm',
    name: RouteNames.DISSOLUTION_FIRM,
    component: Views.DissolutionFirm,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION,
      noStepper: true // hide stepper for this route/filing type
    }
  }
]
