// import Home from '@/views/Home.vue'
// import MixinExample from '@/views/MixinExample.vue'
// import StateExample from '@/views/StateExample.vue'
import DefineCompany from '@/views/DefineCompany.vue'
import ReviewConfirm from '@/views/ReviewConfirm.vue'

export const routes = [
  {
    path: '/',
    redirect: '/define-company'
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Home,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
  // {
  //   path: '/MixinExample',
  //   name: 'mixinExample',
  //   component: MixinExample,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
  // {
  //   path: '/StateExample',
  //   name: 'stateExample',
  //   component: StateExample,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
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
