import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  tombstone: {
    authRoles: [],
    businessId: '',
    filingType: null,
    userEmail: '',
    userPhone: '',
    userFirstName: '',
    userLastName: '',
    userKeycloakGuid: null,
    userAddress: null
  },
  accountInformation: {
    accountType: '',
    id: null,
    label: '',
    type: ''
  },
  nameRequest: {
    nrNumber: '',
    entityType: '',
    details: {},
    applicant: {},
    filingId: null
  },
  nameTranslations: [],
  currentDate: '',
  incorporationDateTime: {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  tempId: '',
  entityType: null,
  currentStep: 1,
  filingId: 0,
  isSaving: false,
  isSavingResuming: false,
  isFilingPaying: false,
  ignoreChanges: false,
  haveChanges: false,
  defineCompanyStep: {
    valid: false,
    cooperativeType: null,
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: ''
    },
    officeAddresses: {},
    folioNumber: null
  },
  addPeopleAndRoleStep: {
    valid: false,
    orgPeople: []
  },
  createShareStructureStep: {
    valid: false,
    shareClasses: []
  },
  createRulesStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    rulesConfirmed: false,
    rulesDoc: null,
    docKey: null
  },
  incorporationAgreementStep: {
    valid: false,
    agreementType: null
  },
  createMemorandumStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    memorandumConfirmed: false,
    memorandumDoc: null,
    docKey: null
  },
  validateSteps: false,
  showErrors: false
}
