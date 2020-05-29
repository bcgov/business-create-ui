import AddPeopleAndRoles from '@/views/AddPeopleAndRoles.vue'
import CreateShareStructure from '@/views/CreateShareStructure.vue'
import IncorporationAgreement from '@/views/IncorporationAgreement.vue'
import DefineCompany from '@/views/DefineCompany.vue'
import ReviewConfirm from '@/views/ReviewConfirm.vue'
import SigninView from '@/views/auth/Signin.vue'
import SignoutView from '@/views/auth/Signout.vue'
import { RouteNames } from '@/enums'

export const routes = [
  {
    // router.beforeEach() routes here:
    path: '/signin',
    name: RouteNames.SIGN_IN,
    component: SigninView,
    meta: {
      requiresAuth: false
    }
  },
  {
    // SbcHeader.logout() redirects here:
    path: '/signout',
    name: RouteNames.SIGN_OUT,
    component: SignoutView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/define-company',
    name: RouteNames.DEFINE_COMPANY,
    component: DefineCompany,
    meta: {
      step: 1,
      label: 'Define Your Company',
      requiresAuth: true
    }
  },
  {
    path: '/add-people-roles',
    name: RouteNames.ADD_PEOPLE_AND_ROLES,
    component: AddPeopleAndRoles,
    meta: {
      step: 2,
      label: 'Add People and Roles',
      requiresAuth: true
    }
  },
  {
    path: '/create-share-structure',
    name: RouteNames.CREATE_SHARE_STRUCTURE,
    component: CreateShareStructure,
    meta: {
      step: 3,
      label: 'Create Share Structure',
      requiresAuth: true
    }
  },
  {
    path: '/incorporation-agreement',
    name: RouteNames.INCORPORATION_AGREEMENT,
    component: IncorporationAgreement,
    meta: {
      step: 4,
      label: 'Incorporation Agreement',
      requiresAuth: true
    }
  },
  {
    path: '/review-confirm',
    name: RouteNames.REVIEW_CONFIRM,
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
    redirect: '/define-company'
  }
]
