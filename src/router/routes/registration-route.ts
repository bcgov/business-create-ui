import { FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const RegistrationRoutes = [
  {
    path: '/registration-define-business',
    name: RouteNames.REGISTRATION_DEFINE_BUSINESS,
    component: Views.RegistrationDefineBusiness,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.REGISTRATION
    }
  },
  {
    path: '/registration-people-roles',
    name: RouteNames.REGISTRATION_PEOPLE_ROLES,
    component: Views.RegistrationPeopleRoles,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.REGISTRATION
    }
  },
  {
    path: '/registration-review-confirm',
    name: RouteNames.REGISTRATION_REVIEW_CONFIRM,
    component: Views.RegistrationReviewConfirm,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.REGISTRATION
    }
  }
]
