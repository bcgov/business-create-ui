import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const IncorporationRoutes = [
  {
    path: '/incorporation-define-company',
    name: RouteNames.INCORPORATION_DEFINE_COMPANY,
    component: Views.IncorporationDefineCompany,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/incorporation-people-roles',
    name: RouteNames.INCORPORATION_PEOPLE_ROLES,
    component: Views.IncorporationPeopleRoles,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/incorporation-share-structure',
    name: RouteNames.INCORPORATION_SHARE_STRUCTURE,
    component: Views.IncorporationShareStructure,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/incorporation-rules',
    name: RouteNames.INCORPORATION_RULES,
    component: Views.IncorporationRules,
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
    path: '/incorporation-memorandum',
    name: RouteNames.INCORPORATION_MEMORANDUM,
    component: Views.IncorporationMemorandum,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  },
  {
    path: '/incorporation-review-confirm',
    name: RouteNames.INCORPORATION_REVIEW_CONFIRM,
    component: Views.IncorporationReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.INCORPORATION_APPLICATION
    }
  }
]
