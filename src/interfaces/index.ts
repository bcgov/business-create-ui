// Filing interfaces
export * from './filing-interfaces/colin-business-interface'
export * from './filing-interfaces/court-order-interface'
export * from './filing-interfaces/filing-data-interface'
export * from './filing-interfaces/filing-interfaces'
export * from './filing-interfaces/party-interface'
export * from './filing-interfaces/special-resolution-interface'

// Payment interfaces
export * from './payment-interfaces/fees-interface'

// Registration interfaces
export * from './Registration/business-address-interface'

// Resource interfaces
export * from './resource-interfaces/component-resource-interfaces/affidavit-resource-interface'
export * from './resource-interfaces/component-resource-interfaces/agreement-types-interface'
export * from './resource-interfaces/component-resource-interfaces/completing-party-interface'
export * from './resource-interfaces/component-resource-interfaces/step-interface'
export * from './resource-interfaces/component-resource-interfaces/custodian-resource-interface'
export * from './resource-interfaces/resource-interface'

// Stepper interfaces
export * from './stepper-interfaces/AddPeopleAndRole/add-people-role-interface'
export * from './stepper-interfaces/AddPeopleAndRole/org-person-interface'
export * from './stepper-interfaces/AddPeopleAndRole/people-and-roles-resource-interface'
export * from './stepper-interfaces/AddPeopleAndRole/roles-array-interface'
export * from './stepper-interfaces/Affidavit/affidavit-interface'
export * from './stepper-interfaces/common/staff-payment-step-interface'
export * from './stepper-interfaces/common/court-order-step-interface'
export * from './stepper-interfaces/common/person-interface'
export * from './stepper-interfaces/CreateMemorandum/create-memorandum-interface'
export * from './stepper-interfaces/CreateMemorandum/create-memorandum-resource-interface'
export * from './stepper-interfaces/CreateResolution/create-resolution-interface'
export * from './stepper-interfaces/CreateResolution/create-resolution-resource-interface'
export * from './stepper-interfaces/CreateRules/create-rules-interface'
export * from './stepper-interfaces/CreateRules/create-rules-resource-interface'
export * from './stepper-interfaces/CreateShareStructure/create-share-structure-interface'
export * from './stepper-interfaces/DefineCompany/address-interfaces'
export * from './stepper-interfaces/DefineCompany/define-company-interface'
export * from './stepper-interfaces/DefineCompany/name-translation-interface'
export * from './stepper-interfaces/Dissolution/dissolution-statement-interface'
export * from './stepper-interfaces/IncorporationAgreement/help-section-interface'
export * from './stepper-interfaces/IncorporationAgreement/incorporation-agreement-interface'
export * from './stepper-interfaces/ReviewConfirm/certify-interface'

// Store interfaces
export * from './store-interfaces/state-interfaces/account-information-interface'
export * from './store-interfaces/state-interfaces/amalgamation-state-interface'
export * from './store-interfaces/state-interfaces/auth-information-interface'
export * from './store-interfaces/state-interfaces/authorization-proof-interface'
export * from './store-interfaces/state-interfaces/business-interface'
export * from './store-interfaces/state-interfaces/continuation-in-state-interface'
export * from './store-interfaces/state-interfaces/dissolution-state-interface'
export * from './store-interfaces/state-interfaces/document-delivery-interface'
export * from './store-interfaces/state-interfaces/existing-business-info-interface'
export * from './store-interfaces/state-interfaces/org-information-interface'
export * from './store-interfaces/state-interfaces/registration-state-interface'
export * from './store-interfaces/state-interfaces/restoration-state-interface'
export * from './store-interfaces/state-interfaces/tombstone-interface'
export * from './store-interfaces/state-interface'

// Utils interfaces
export * from './utils-interfaces/address-schema-interface'
export * from './utils-interfaces/confirm-dialog-type'
export * from './utils-interfaces/form-field-type'
export * from './utils-interfaces/form-type'
export * from './utils-interfaces/key-value-interface'
export * from './utils-interfaces/pdf-info-interface'
export * from './utils-interfaces/presigned-url-interface'
export * from './utils-interfaces/validation-detail-interface'
export * from './utils-interfaces/validation-item-detail-interface'

// External interfaces
// NB: importing EmptyAddress doesn't work in local components
export type {
  AddressIF,
  BreadcrumbIF,
  BusinessLookupIF,
  BusinessLookupResultIF,
  CommentIF,
  ContactPointIF,
  EffectiveDateTimeIF,
  NaicsIF,
  NaicsResultIF,
  NrApplicantIF,
  NrNameIF,
  NameRequestIF,
  StaffPaymentIF
} from '@bcrs-shared-components/interfaces'

export {
  EmptyAddress,
  EmptyBusinessLookup,
  EmptyContactPoint,
  EmptyNaics,
  EmptyNameRequest
} from '@bcrs-shared-components/interfaces'
