import AddPeopleAndRoles from '@/views/AddPeopleAndRoles.vue'
import CreateShareStructure from '@/views/CreateShareStructure.vue'
import DefineCompany from '@/views/DefineCompany.vue'
import ReviewConfirm from '@/views/ReviewConfirm.vue'
import SigninView from '@/views/auth/Signin.vue'
import SignoutView from '@/views/auth/Signout.vue'

export const routes = [
  {
    // router.beforeEach() routes here:
    path: '/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      requiresAuth: false
    }
  },
  {
    // SbcHeader.logout() redirects here:
    path: '/signout',
    name: 'signout',
    component: SignoutView,
    meta: {
      requiresAuth: false
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
  {
    path: '/add-people-roles',
    name: 'add-people-roles',
    component: AddPeopleAndRoles,
    meta: {
      step: 2,
      label: 'Add People and Roles',
      requiresAuth: true
    }
  },
  {
    path: '/create-share-structure',
    name: 'create-share-structure',
    component: CreateShareStructure,
    meta: {
      step: 3,
      label: 'Create Share Structure',
      requiresAuth: true
    }
  },
  {
    path: '/review-confirm',
    name: 'review-confirm',
    component: ReviewConfirm,
    meta: {
      step: 4,
      label: 'Review and Confirm',
      requiresAuth: true
    }
  },
  {
    // default/fallback route
    // must be last
    path: '*',
    redirect: '/define-company'
  }
]
