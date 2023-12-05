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
import { AmlRoles } from '@/enums'
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
    goodStanding: true
  },
  {
    // this business is an xpro and should only be valid if staff
    type: 'lear',
    identifier: 'A5555555',
    name: 'Lollipop Canada',
    email: 'sucker@example.com',
    legalType: CorpTypeCd.EXTRA_PRO_A,
    address: {
      streetAddress: '4321 Principal Ave',
      addressCity: 'Halifax',
      addressRegion: 'NS',
      postalCode: 'B3H 1A1',
      addressCountry: 'CA'
    },
    role: AmlRoles.AMALGAMATING,
    goodStanding: true
  },
  {
    // this business is NIGS and should only be valid if staff
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
    goodStanding: false
  },
  {
    // this business has 2 issues:
    // 1. not affiliated
    // 2. not in good standing
    type: 'lear',
    identifier: 'BC4444444', // we know this from the business lookup
    name: 'Eclair', // we know this from the business lookup
    email: undefined, // we don't know this yet (not affiliated)
    legalType: CorpTypeCd.BC_COMPANY, // we know this from the business lookup
    address: undefined, // we don't know this yet (not affiliated)
    role: AmlRoles.AMALGAMATING,
    goodStanding: false // we know this from the business lookup
  },
  {
    type: 'foreign',
    corpNumber: 'XYZ789',
    legalName: 'Ice Cream Sandwich Canada',
    foreignJurisdiction: { region: 'FEDERAL', country: 'CA' },
    role: AmlRoles.AMALGAMATING
  },
  {
    type: 'foreign',
    corpNumber: 'ABC123',
    legalName: 'Gingerbread USA',
    foreignJurisdiction: { country: 'US' },
    role: AmlRoles.AMALGAMATING
  },
  {
    // this business is CCC and should only be valid if amalg type is CCC
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
    goodStanding: true
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
    goodStanding: true
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
