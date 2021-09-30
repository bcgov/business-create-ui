import SigninView from '@/views/auth/Signin.vue'
import SignoutView from '@/views/auth/Signout.vue'
import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'
const businessId = sessionStorage.getItem('BUSINESS_ID')
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
    component: Views.DefineCompany,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/add-people-and-roles',
    name: RouteNames.ADD_PEOPLE_AND_ROLES,
    component: Views.AddPeopleAndRoles,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/create-share-structure',
    name: RouteNames.CREATE_SHARE_STRUCTURE,
    component: Views.CreateShareStructure,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/create-rules',
    name: RouteNames.CREATE_RULES,
    component: Views.CreateRules,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/incorporation-agreement',
    name: RouteNames.INCORPORATION_AGREEMENT,
    component: Views.IncorporationAgreement,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/create-memorandum',
    name: RouteNames.CREATE_MEMORANDUM,
    component: Views.CreateMemorandum,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/review-confirm',
    name: RouteNames.REVIEW_CONFIRM,
    component: Views.ReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: `/define-dissolution`,
    name: RouteNames.DEFINE_DISSOLUTION,
    component: Views.DefineDissolution,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/upload-special-resolution',
    name: RouteNames.UPLOAD_RESOLUTION,
    component: Views.UploadSpecialResolution,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/upload-affidavit',
    name: RouteNames.UPLOAD_AFFIDAVIT,
    component: Views.UploadAffidavit,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/review-confirm-dissolution',
    name: RouteNames.REVIEW_CONFIRM_DISSOLUTION,
    component: Views.ReviewConfirmDissolution,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    // default/fallback route
    // must be last
    path: '*',
    redirect: '/define-company'
  }
]
