import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import { routes } from './routes'
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

/**
 * Configures and returns Vue Router.
 */
export function getVueRouter () {
  Vue.use(VueRouter)

  const router = new VueRouter({
    mode: 'history',
    // set base URL for Vue Router
    base: sessionStorage.getItem('VUE_ROUTER_BASE'),
    routes,
    scrollBehavior (to, from, savedPosition) {
      // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
      return { x: 0, y: 0 }
    }
  })

  router.beforeEach((to, from, next) => {
    if (requiresAuth(to) && !isAuthenticated()) {
      // this route needs authentication, so re-route to signin
      // NB: save current route for future redirect
      next({
        name: 'signin',
        query: { redirect: to.fullPath }
      })
    } else if (!isSigninRoute(to) && !isSignoutRoute(to) && !to.query?.id) {
      // for normal routes, re-route along with query params
      next({
        name: to.name,
        query: { ...from.query, ...to.query }
      })
    } else {
      // otherwise just proceed normally
      next()
    }
  })

  /** Returns True if route requires authentication, else False. */
  function requiresAuth (route: Route): boolean {
    return route.matched.some(r => r.meta?.requiresAuth)
  }

  /** Returns True if user is authenticated, else False. */
  function isAuthenticated (): boolean {
    // FUTURE: also check that token isn't expired!
    return Boolean(sessionStorage.getItem(SessionStorageKeys.KeyCloakToken))
  }

  /** Returns True if route is Signin, else False. */
  function isSigninRoute (route: Route): boolean {
    return Boolean(route.name === 'signin')
  }

  /** Returns True if route is Signout, else False. */
  function isSignoutRoute (route: Route): boolean {
    return Boolean(route.name === 'signout')
  }

  return router
}
