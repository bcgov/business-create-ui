import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const AmalgamationRegularRoutes = [
  {
    path: '/amalg-reg-information',
    name: RouteNames.AMALG_REG_INFORMATION,
    component: Views.AmalgamationInformation,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-reg-business-info',
    name: RouteNames.AMALG_REG_BUSINESS_INFO,
    component: Views.AmalgamationBusinessInfo,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-reg-people-roles',
    name: RouteNames.AMALG_REG_PEOPLE_ROLES,
    component: Views.AmalgamationPeopleRoles,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-reg-share-structure',
    name: RouteNames.AMALG_REG_SHARE_STRUCTURE,
    component: Views.AmalgamationShareStructure,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  },
  {
    path: '/amalg-reg-review-confirm',
    name: RouteNames.AMALG_REG_REVIEW_CONFIRM,
    component: Views.AmalgamationReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION_APPLICATION
    }
  }
]
