/**
 * Enum for views for component templating.
 */
export enum Views {
  // Auth views
  SIGN_IN = 'signin',
  SIGN_OUT = 'signout',

  // Amalgamation views
  AMALGAMATION_REG_BUSINESS_INFO = 'amalg-reg-business-info',
  AMALGAMATION_REG_INFORMATION = 'amalg-reg-information',
  AMALGAMATION_REG_PEOPLE_ROLES = 'amalg-reg-people-roles',
  AMALGAMATION_REG_REVIEW_CONFIRM = 'amalg-reg-review-confirm',
  AMALGAMATION_REG_SHARE_STRUCTURE = 'amalg-reg-share-structure',

  // Dissolution views
  DISSOLUTION_AFFIDAVIT = 'dissolution-affidavit',
  DISSOLUTION_DEFINE_DISSOLUTION = 'dissolution-define-dissolution',
  DISSOLUTION_RESOLUTION = 'dissolution-resolution',
  DISSOLUTION_REVIEW_CONFIRM = 'dissolution-review-confirm',

  // Dissolution view - SP and GP
  DISSOLUTION_FIRM = 'dissolution-firm',

  // Incorporation views
  INCORPORATION_AGREEMENT = 'incorporation-agreement',
  INCORPORATION_DEFINE_COMPANY = 'incorporation-define-company',
  INCORPORATION_MEMORANDUM = 'incorporation-memorandum',
  INCORPORATION_PEOPLE_ROLES = 'incorporation-people-roles',
  INCORPORATION_REVIEW_CONFIRM = 'incorporation-review-confirm',
  INCORPORATION_RULES = 'incorporation-rules',
  INCORPORATION_SHARE_STRUCTURE = 'incorporation-share-structure',

  // Registration views
  REGISTRATION_DEFINE_BUSINESS = 'registration-define-business',
  REGISTRATION_PEOPLE_ROLES = 'registration-people-roles',
  REGISTRATION_REVIEW_CONFIRM = 'registration-review-confirm',

  // Restorations views
  RESTORATION_APPLICANT_INFORMATION = 'restoration-applicant-information',
  RESTORATION_BUSINESS_INFORMATION = 'restoration-business-information',
  RESTORATION_BUSINESS_NAME = 'restoration-business-name',
  RESTORATION_REVIEW_CONFIRM = 'restoration-review-confirm',
}
