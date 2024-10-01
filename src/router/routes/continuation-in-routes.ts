import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const ContinuationInRoutes = [
  // this route is used for Draft and Change Requested statuses:
  {
    path: '/continuation-in-authorization',
    name: RouteNames.CONTINUATION_IN_AUTHORIZATION,
    component: Views.ContinuationInAuthorization,
    meta: {
      step: 0,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN,
      noStepper: true // hide stepper for this route/filing type
    }
  },
  // the following routes are used for Approved status:
  {
    path: '/continuation-in-business-bc',
    name: RouteNames.CONTINUATION_IN_BUSINESS_BC,
    component: Views.ContinuationInBusinessBc,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-people-roles',
    name: RouteNames.CONTINUATION_IN_PEOPLE_ROLES,
    component: Views.ContinuationInPeopleRoles,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-share-structure',
    name: RouteNames.CONTINUATION_IN_SHARE_STRUCTURE,
    component: Views.ContinuationInShareStructure,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  },
  {
    path: '/continuation-in-review-confirm',
    name: RouteNames.CONTINUATION_IN_REVIEW_CONFIRM,
    component: Views.ContinuationInReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.CONTINUATION_IN
    }
  }
]
