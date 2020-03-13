import DefineCompany from '@/views/DefineCompany.vue'
import ReviewConfirm from '@/views/ReviewConfirm.vue'
import SigninView from '@/views/auth/Signin.vue'
import SignoutView from '@/views/auth/Signout.vue'

export const routes = [
  {
    path: '/',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signin/:idpHint',
    name: 'signin',
    component: SigninView,
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  // This route is consumed by SbcHeader
  {
    path: '/signout',
    name: 'signout',
    component: SignoutView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signout/:redirectUrl',
    name: 'signout-redirect',
    component: SignoutView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/define-company',
    name: 'define-company',
    component: DefineCompany,
    meta: {
      step: 1,
      label: 'Define Your Company',
      requiresAuth: true
    }
  },
  //
  // TODO: handle steps differently because they
  //       differ depending on company type (BC, CP)
  //
  {
    path: '/review-confirm',
    name: 'review-confirm',
    component: ReviewConfirm,
    meta: {
      step: 5,
      label: 'Review and Confirm',
      requiresAuth: true
    }
  },
  {
    // default/fallback route
    // must be last
    path: '*',
    redirect: '/'
  }
]
