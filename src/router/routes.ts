// import Home from '@/views/Home.vue'
// import MixinExample from '@/views/MixinExample.vue'
// import StateExample from '@/views/StateExample.vue'
import DefineCompany from '@/views/DefineCompany.vue'
import ReviewConfirm from '@/views/ReviewConfirm.vue'
import SigninView from '@/views/auth/Signin.vue'
import SignoutView from '@/views/auth/Signout.vue'

export const routes = [
  {
    path: '/',
    redirect: '/define-company'
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
  {
    path: '/signin/:idpHint/:redirectUrl',
    name: 'signin-redirect',
    component: SigninView,
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/signin/:idpHint/:redirectUrl/:redirectUrlLoginFail',
    name: 'signin-redirect-fail',
    component: SigninView,
    props: true,
    meta: {
      requiresAuth: false
    }
  },
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
