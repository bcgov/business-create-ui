import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  tombstone: {
    authRoles: [],
    userEmail: '',
    userFirstName: '',
    userLastName: '',
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
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: '',
      extension: ''
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
    valid: false
  },
  incorporationAgreementStep: {
    valid: false,
    agreementType: null
  },
  createMemorandumStep: {
    valid: false
  },
  validateSteps: false,
  showErrors: false
}
