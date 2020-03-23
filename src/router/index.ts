import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import { routes } from './routes'

// Enums for Keycloak
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // set base URL for Vue Router
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    // see https://router.vuejs.org/guide/advanced/scroll-behavior.html
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // If the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If we  dont have a token
    if (!sessionStorage.getItem(SessionStorageKeys.KeyCloakToken)) {
      // Send them to the bcsc login
      return next({
        path: `/signin/bcsc${to.path}`,
        query: { redirect: to.fullPath }
      })
    }
  }

  // Currently only activate if the from route has a nrNumber query param
  if (from.query.nrNumber && !to.query.nrNumber) {
    // Carry over route params and allow the target route to overwrite any params with the same key
    return next({ path: to.path, query: { ...from.query, ...to.query } })
  }

  // FUTURE: We will want to do something to handle expired tokens here at some point.

  next()
})
export default router
