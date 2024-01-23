import { RouteNames } from '@/enums'
import * as Views from '@/views'
import {
  AmalgamationRegularRoutes,
  AmalgamationShortRoutes,
  DissolutionFirmRoutes,
  DissolutionRoutes,
  IncorporationRoutes,
  RegistrationRoutes,
  RestorationRoutes
} from './routes/index'

export const routes = [
  {
    // router.beforeEach() routes here:
    path: '/signin',
    name: RouteNames.SIGN_IN,
    component: Views.Signin,
    meta: {
      requiresAuth: false
    }
  },
  {
    // SbcHeader.logout() redirects here:
    path: '/signout',
    name: RouteNames.SIGN_OUT,
    component: Views.Signout,
    meta: {
      requiresAuth: false
    }
  },
  ...AmalgamationRegularRoutes,
  ...AmalgamationShortRoutes,
  ...DissolutionFirmRoutes,
  ...DissolutionRoutes,
  ...IncorporationRoutes,
  ...RegistrationRoutes,
  ...RestorationRoutes,
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
  },
  {
    // default/fallback route
    // must be last
    // NB: this route is IA-specific but App::fetchData() will reroute
    // if user is on a route not valid for the current filing type
    path: '*',
    redirect: '/incorporation-define-company'
  }
]
