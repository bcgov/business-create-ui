import {
  AmalgamatingBusinessIF,
  EmptyAccountInformation,
  EmptyContactPoint,
  EmptyFees,
  EmptyNameRequest,
  EmptyOfficer,
  EmptyNaics,
  StateModelIF
} from '@/interfaces'
import { AmalgamatingStatuses, AmlRoles } from '@/enums'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'
import { cloneDeep } from 'lodash'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

const AMALGAMATING_BUSINESSES: AmalgamatingBusinessIF[] = [
  {
    type: 'lear',
    identifier: 'BC1111111',
    name: 'Frozen Yogurt',
    email: 'froyo@example.com',
    legalType: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: AmlRoles.HOLDING,
    goodStanding: true,
    status: AmalgamatingStatuses.OK
  },
  {
    type: 'lear',
    identifier: 'A5555555',
    name: 'Lollipop Canada',
    email: 'sucker@example.com',
    legalType: CorpTypeCd.EXTRA_PRO_A,
    role: AmlRoles.AMALGAMATING,
    goodStanding: true,
    status: AmalgamatingStatuses.OK
  },
  {
    type: 'lear',
    identifier: 'BC2222222',
    name: 'Jelly Bean',
    email: 'oval.treat@example.com',
    legalType: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: AmlRoles.AMALGAMATING,
    goodStanding: false,
    status: AmalgamatingStatuses.ERROR_NIGS
  },
  {
    type: 'lear',
    identifier: 'BC4444444',
    name: 'Eclair',
    email: null,
    legalType: CorpTypeCd.BC_COMPANY, // *** KARIM: we can get this from the business lookup
    role: AmlRoles.AMALGAMATING,
    goodStanding: null,
    status: AmalgamatingStatuses.ERROR_AFFILIATION
  },
  {
    type: 'foreign',
    corpNumber: 'ABC123',
    legalName: 'Gingerbread USA',
    foreignJurisdiction: { country: 'US' },
    role: AmlRoles.AMALGAMATING,
    status: AmalgamatingStatuses.ERROR_FOREIGN
  },
  {
    type: 'foreign',
    corpNumber: 'XYZ789',
    legalName: 'Oreo Ice Cream Sandwich',
    foreignJurisdiction: { region: 'FEDERAL', country: 'CA' },
    role: AmlRoles.AMALGAMATING,
    status: AmalgamatingStatuses.ERROR_FOREIGN
  },
  {
    type: 'lear',
    identifier: 'BC7777777',
    name: 'Donut',
    email: 'holey.goodness@example.com',
    legalType: CorpTypeCd.BC_CCC,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: AmlRoles.AMALGAMATING,
    goodStanding: true,
    status: AmalgamatingStatuses.ERROR_CCC_MISMATCH
  },
  {
    type: 'lear',
    identifier: 'BC3333333',
    name: 'Cupcake',
    email: 'cute.sugarbomb@example.com',
    legalType: CorpTypeCd.BC_COMPANY,
    address: {
      streetAddress: '1234 Main St',
      addressCity: 'Vancouver',
      addressRegion: 'BC',
      postalCode: 'V6A 1A1',
      addressCountry: 'CA'
    },
    role: AmlRoles.AMALGAMATING,
    goodStanding: true,
    status: AmalgamatingStatuses.OK
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
    courtApproval: null,
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
