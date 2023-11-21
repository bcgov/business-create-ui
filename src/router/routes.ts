import { AmalgamationTypes, FilingTypes, RouteNames } from '@/enums'
import * as Views from '@/views'

export const routes = [
  {
    // router.beforeEach() routes here:
    path: '/signin',
    name: RouteNames.SIGN_IN,
    component: Views.Signin,
    meta: {
      requiresAuth: false
    }
  },
  {
    // SbcHeader.logout() redirects here:
    path: '/signout',
    name: RouteNames.SIGN_OUT,
    component: Views.Signout,
    meta: {
      requiresAuth: false
    }
  },
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
  },
  {
    path: '/dissolution-define-dissolution',
    name: RouteNames.DISSOLUTION_DEFINE_DISSOLUTION,
    component: Views.DissolutionDefineDissolution,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-resolution',
    name: RouteNames.DISSOLUTION_RESOLUTION,
    component: Views.DissolutionResolution,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-affidavit',
    name: RouteNames.DISSOLUTION_AFFIDAVIT,
    component: Views.DissolutionAffidavit,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
  {
    path: '/dissolution-review-confirm',
    name: RouteNames.DISSOLUTION_REVIEW_CONFIRM,
    component: Views.DissolutionReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION
    }
  },
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
  },
  {
    path: '/dissolution-firm',
    name: RouteNames.DISSOLUTION_FIRM,
    component: Views.DissolutionFirm,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.DISSOLUTION,
      noStepper: true // hide stepper for this route/filing type
    }
  },
  {
    path: '/restoration-business-name',
    name: RouteNames.RESTORATION_BUSINESS_NAME,
    component: Views.RestorationBusinessName,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-applicant-information',
    name: RouteNames.RESTORATION_APPLICANT_INFORMATION,
    component: Views.RestorationApplicantInformation,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-business-information',
    name: RouteNames.RESTORATION_BUSINESS_INFORMATION,
    component: Views.RestorationBusinessInformation,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/restoration-review-confirm',
    name: RouteNames.RESTORATION_REVIEW_CONFIRM,
    component: Views.RestorationReviewConfirm,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.RESTORATION
    }
  },
  {
    path: '/amalg-reg-information',
    name: RouteNames.AMALG_REG_INFORMATION,
    component: Views.AmalgRegInformation,
    meta: {
      step: 1,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-business-info',
    name: RouteNames.AMALG_REG_BUSINESS_INFO,
    component: Views.AmalgRegBusinessInfo,
    meta: {
      step: 2,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-people-roles',
    name: RouteNames.AMALG_REG_PEOPLE_ROLES,
    component: Views.AmalgRegPeopleRoles,
    meta: {
      step: 3,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-share-structure',
    name: RouteNames.AMALG_REG_SHARE_STRUCTURE,
    component: Views.AmalgRegShareStructure,
    meta: {
      step: 4,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    path: '/amalg-reg-review-confirm',
    name: RouteNames.AMALG_REG_REVIEW_CONFIRM,
    component: Views.AmalgRegReviewConfirm,
    meta: {
      step: 5,
      requiresAuth: true,
      filingType: FilingTypes.AMALGAMATION,
      filingSubType: AmalgamationTypes.REGULAR
    }
  },
  {
    // default/fallback route
    // must be last
    // NB: this route is IA-specific but App::fetchData() will reroute
    // if user is on a route not valid for the current filing type
    path: '*',
    redirect: '/incorporation-define-company'
  }
]
