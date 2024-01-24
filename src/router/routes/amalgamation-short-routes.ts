import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const AmalgamationShortRoutes = [
  {
    path: '/amalg-short-information',
    name: RouteNames.AMALG_SHORT_INFORMATION,
    component: Views.AmalgamationInformation,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-short-business-info',
    name: RouteNames.AMALG_SHORT_BUSINESS_INFO,
    component: Views.AmalgamationBusinessInfo,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-short-people-roles',
    name: RouteNames.AMALG_SHORT_PEOPLE_ROLES,
    component: Views.AmalgamationPeopleRoles,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-short-review-confirm',
    name: RouteNames.AMALG_SHORT_REVIEW_CONFIRM,
    component: Views.AmalgamationReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  }
]
