import {
  EmptyAccountInformation,
  EmptyContactPoint,
  EmptyFees,
  EmptyNameRequest,
  EmptyOfficer,
  EmptyNaics,
  StateModelIF
} from '@/interfaces'
import { BusinessStatuses } from '@/enums'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'
import { cloneDeep } from 'lodash'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const AMALGAMATING_BUSINESSES = [
  {
    businessId: 'BC1111111',
    name: 'Frozen Yogurt',
    email: 'froyo@example.com',
    type: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Holding Company',
    goodStanding: true,
    status: BusinessStatuses.OK
  },
  {
    businessId: 'BC2222222',
    name: 'Jelly Bean',
    email: 'oval.treat@example.com',
    type: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Amalgamating Business',
    goodStanding: false
  },
  {
    businessId: 'BC3333333',
    name: 'Cupcake',
    email: 'cute.sugarbomb@example.com',
    type: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.OK
  },
  {
    businessId: 'BC4444444',
    name: 'Eclair',
    email: null,
    type: CorpTypeCd.BC_COMPANY, // *** TODO: we may not know this until affiliated
    jurisdiction: null,
    address: null,
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.ERROR_AFFILIATION
  },
  {
    businessId: '12345678',
    name: 'Gingerbread',
    email: null,
    type: CorpTypeCd.FOREIGN,
    jurisdiction: 'United States of America',
    address: null,
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.ERROR_FOREIGN
  },
  {
    businessId: 'BC5555555',
    name: 'Lollipop',
    email: 'sucker@example.com',
    type: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.OK
  },
  {
    businessId: 'BC6666666',
    name: 'Oreo Ice Cream Sandwich',
    email: 'we.all.scream@example.com',
    type: CorpTypeCd.BC_CCC,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.ERROR_CCC_MISMATCH
  },
  {
    businessId: 'BC7777777',
    name: 'Donut',
    email: 'holey.goodness@example.com',
    type: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: 'Amalgamating Business',
    goodStanding: true,
    status: BusinessStatuses.OK
  }
]

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
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
    amalgamatingBusinesses: cloneDeep(AMALGAMATING_BUSINESSES),
    type: null
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
  windowWidth: 0
}
