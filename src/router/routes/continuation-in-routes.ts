import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const ContinuationInRoutes = [
  {
    path: '/continuation-in-business-home',
    name: RouteNames.CONTINUATION_IN_BUSINESS_HOME,
    component: Views.ContinuationInBusinessHome,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-business-bc',
    name: RouteNames.CONTINUATION_IN_BUSINESS_BC,
    component: Views.ContinuationInBusinessBc,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-people-roles',
    name: RouteNames.CONTINUATION_IN_PEOPLE_ROLES,
    component: Views.ContinuationInPeopleRoles,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-share-structure',
    name: RouteNames.CONTINUATION_IN_SHARE_STRUCTURE,
    component: Views.ContinuationInShareStructure,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-review-confirm',
    name: RouteNames.CONTINUATION_IN_REVIEW_CONFIRM,
    component: Views.ContinuationInReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  }
]
