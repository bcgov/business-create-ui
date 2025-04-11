import {
  EmptyAccountInformation,
  EmptyContactPoint,
  EmptyFees,
  EmptyNameRequest,
  EmptyOfficer,
  EmptyNaics,
  ExistingBusinessInfoIF,
  StateModelIF
} from '@/interfaces'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'
import { cloneDeep } from 'lodash'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    filingStatus: null,
    filingType: null,
    keycloakGuid: null,
    keycloakRoles: [],
    legalName: '',
    userEmail: '',
    userPhone: '',
    userFirstName: '',
    userLastName: '',
    userAddress: null,
    folioNumber: '',
    folioNumberValid: false,
    transactionalFolioNumber: '',
    transactionalFolioNumberValid: false
  },
  business: {
    businessId: '',
    legalName: '',
    foundingDate: '',
    businessContact: { ...EmptyContactPoint },
    officeAddress: {
      mailingAddress: { ...EmptyAddress },
      deliveryAddress: { ...EmptyAddress }
    },
    adminFreeze: false,
    arMaxDate: '',
    arMinDate: '',
    dissolutionDate: '',
    warnings: [],
    fiscalYearEndDate: '',
    goodStanding: false,
    hasRestrictions: false,
    identifier: '',
    lastAddressChangeDate: '',
    lastAnnualGeneralMeetingDate: '',
    lastAnnualReportDate: '',
    lastDirectorChangeDate: '',
    lastLedgerTimestamp: '',
    lastModified: '',
    legalType: null,
    nextAnnualReport: '',
    taxId: '',
    state: null,
    stateFiling: '',
    startDate: '',
    submitter: ''
  },
  businessContact: { ...EmptyContactPoint },
  dissolution: {
    dissolutionType: null,
    dissolutionDate: '',
    dissolutionStatementStep: {
      valid: false,
      dissolutionStatementType: null
    },
    hasCertificateDestroyed: false,
    custodianOfRecords: {
      valid: false,
      custodian: {
        officer: { ...EmptyOfficer },
        mailingAddress: { ...EmptyAddress },
        deliveryAddress: { ...EmptyAddress },
        roles: [
          {
            roleType: null,
            appointmentDate: ''
          }
        ],
        inheritMailingAddress: false // draft only property
      }
    }
  },
  accountInformation: { ...EmptyAccountInformation },
  orgInformation: null,
  nameRequest: cloneDeep(EmptyNameRequest),
  nameRequestApprovedName: null,
  alternateName: null,
  correctNameOption: null,
  nameTranslations: [],
  nameTranslationsValid: true,
  currentDate: '',
  effectiveDateTime: {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  documentDelivery: {
    documentOptionalEmail: '',
    valid: true
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
    officeAddresses: {
      registeredOffice: {
        mailingAddress: { ...EmptyAddress },
        deliveryAddress: { ...EmptyAddress }
      },
      recordsOffice: {
        mailingAddress: { ...EmptyAddress },
        deliveryAddress: { ...EmptyAddress }
      }
    }
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
    rulesFile: null,
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
    memorandumFile: null,
    docKey: null
  },
  uploadAffidavitStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    affidavitConfirmed: false,
    affidavitFile: null,
    docKey: null
  },
  createResolutionStep: {
    validationDetail: {
      valid: false,
      validationItemDetails: []
    },
    resolutionConfirmed: false
  },
  validateSteps: false,
  showErrors: false,
  feePrices: [cloneDeep(EmptyFees)],
  staffPaymentStep: {
    valid: false,
    staffPayment: {
      option: NaN,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    }
  },
  courtOrderStep: {
    valid: false,
    courtOrder: {
      fileNumber: '',
      hasPlanOfArrangement: null
    }
  },
  registration: {
    defineBusinessValid: false,
    startDate: '',
    businessAddress: null,
    feeAcknowledgement: false,
    naics: { ...EmptyNaics },
    businessType: null,
    businessNumber: null,
    businessTypeConfirm: false,
    isAutoPopulatedBusinessNumber: false
  },
  amalgamation: {
    amalgamatingBusinesses: [],
    amalgamatingBusinessesValid: false,
    courtApproval: null,
    courtApprovalValid: false,
    type: null
  },
  continuationIn: {
    continuationAuthorizationPageValid: false,
    authorizationProof: null,
    existingBusinessInfo: {} as ExistingBusinessInfoIF
  },
  restoration: {
    applicationDate: null,
    approvalType: null,
    approvalTypeValid: true,
    businessNameValid: false,
    courtOrder: {
      fileNumber: null
    },
    expiry: null,
    noticeDate: null,
    relationships: [],
    restorationTypeValid: false,
    type: null
  },
  completingParty: null,
  parties: null,
  resolutions: [],
  windowWidth: 0,
  documentIdState: {
    valid: false,
    consumerDocumentId: ''
  }
}
