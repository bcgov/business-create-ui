/**
 * Enum for route names for vue router.
 */
export enum RouteNames {
  // Auth route names
  SIGN_IN = 'signin',
  SIGN_OUT = 'signout',

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
