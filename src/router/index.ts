import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import KeyCloakService from 'sbc-common-components/src/services/keycloak.services'

// Enums for Keycloak
import { SessionStorageKeys } from 'sbc-common-components/src/util/constants'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
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

  // FUTURE: We will want to do something to handle expired tokens here at some point.

  next()
})
export default router
