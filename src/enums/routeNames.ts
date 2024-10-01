/**
 * Enum for route names for vue router.
 */
export enum RouteNames {
  // Auth route names
  SIGN_IN = 'signin',
  SIGN_OUT = 'signout',

  // Amalgamation (regular) route names
  AMALG_REG_BUSINESS_INFO = 'amalg-reg-business-info',
  AMALG_REG_INFORMATION = 'amalg-reg-information',
  AMALG_REG_PEOPLE_ROLES = 'amalg-reg-people-roles',
  AMALG_REG_REVIEW_CONFIRM = 'amalg-reg-review-confirm',
  AMALG_REG_SHARE_STRUCTURE = 'amalg-reg-share-structure',

  // Amalgamation (horizontal and vertical short-form) route names
  AMALG_SHORT_BUSINESS_INFO = 'amalg-short-business-info',
  AMALG_SHORT_INFORMATION = 'amalg-short-information',
  AMALG_SHORT_PEOPLE_ROLES = 'amalg-short-people-roles',
  AMALG_SHORT_REVIEW_CONFIRM = 'amalg-short-review-confirm',

  // Continuation In route names
  CONTINUATION_IN_AUTHORIZATION = 'continuation-in-authorization',
  CONTINUATION_IN_BUSINESS_BC = 'continuation-in-business-bc',
  CONTINUATION_IN_PEOPLE_ROLES = 'continuation-in-people-roles',
  CONTINUATION_IN_REVIEW_CONFIRM = 'continuation-in-review-confirm',
  CONTINUATION_IN_SHARE_STRUCTURE = 'continuation-in-share-structure',

  // Dissolution route names
  DISSOLUTION_AFFIDAVIT = 'dissolution-affidavit',
  DISSOLUTION_DEFINE_DISSOLUTION = 'dissolution-define-dissolution',
  DISSOLUTION_RESOLUTION = 'dissolution-resolution',
  DISSOLUTION_REVIEW_CONFIRM = 'dissolution-review-confirm',

  // Dissolution route name - SP and GP
  DISSOLUTION_FIRM = 'dissolution-firm',

  // Incorporation route names
  INCORPORATION_AGREEMENT = 'incorporation-agreement',
  INCORPORATION_DEFINE_COMPANY = 'incorporation-define-company',
  INCORPORATION_MEMORANDUM = 'incorporation-memorandum',
  INCORPORATION_PEOPLE_ROLES = 'incorporation-people-roles',
  INCORPORATION_REVIEW_CONFIRM = 'incorporation-review-confirm',
  INCORPORATION_RULES = 'incorporation-rules',
  INCORPORATION_SHARE_STRUCTURE = 'incorporation-share-structure',

  // Registration route names
  REGISTRATION_DEFINE_BUSINESS = 'registration-define-business',
  REGISTRATION_PEOPLE_ROLES = 'registration-people-roles',
  REGISTRATION_REVIEW_CONFIRM = 'registration-review-confirm',

  // Restoration route names
  RESTORATION_APPLICANT_INFORMATION = 'restoration-applicant-information',
  RESTORATION_BUSINESS_INFORMATION = 'restoration-business-information',
  RESTORATION_BUSINESS_NAME = 'restoration-business-name',
  RESTORATION_REVIEW_CONFIRM = 'restoration-review-confirm',
}
