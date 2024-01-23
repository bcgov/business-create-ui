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
    // default/fallback route
    // must be last
    // NB: this route is IA-specific but App::fetchData() will reroute
    // if user is on a route not valid for the current filing type
    path: '*',
    redirect: '/incorporation-define-company'
  }
]
