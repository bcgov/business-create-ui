import { RouteNames } from '@/enums'
import * as Views from '@/views'
import {
  AmalgamationRegularRoutes,
  AmalgamationShortRoutes,
  ContinuationInRoutes,
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
  ...ContinuationInRoutes,
  ...DissolutionFirmRoutes,
  ...DissolutionRoutes,
  ...IncorporationRoutes,
  ...RegistrationRoutes,
  ...RestorationRoutes,
  {
    path: '/amalg-reg-information',
    name: RouteNames.AMALG_REG_INFORMATION,
    component: Views.AmalgRegInformation,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-business-info',
    name: RouteNames.AMALG_REG_BUSINESS_INFO,
    component: Views.AmalgRegBusinessInfo,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-people-roles',
    name: RouteNames.AMALG_REG_PEOPLE_ROLES,
    component: Views.AmalgRegPeopleRoles,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-share-structure',
    name: RouteNames.AMALG_REG_SHARE_STRUCTURE,
    component: Views.AmalgRegShareStructure,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-review-confirm',
    name: RouteNames.AMALG_REG_REVIEW_CONFIRM,
    component: Views.AmalgRegReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
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
