import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const RestorationRoutes = [
  {
    path: '/restoration-business-name',
    name: RouteNames.RESTORATION_BUSINESS_NAME,
    component: Views.RestorationBusinessName,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-applicant-information',
    name: RouteNames.RESTORATION_APPLICANT_INFORMATION,
    component: Views.RestorationApplicantInformation,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-business-information',
    name: RouteNames.RESTORATION_BUSINESS_INFORMATION,
    component: Views.RestorationBusinessInformation,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-review-confirm',
    name: RouteNames.RESTORATION_REVIEW_CONFIRM,
    component: Views.RestorationReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  }
]
