// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import axios from '@/utils/axios-auth'
import sbcFeeSummaryAxios from 'axios'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'
import { ConfirmDialog } from '@/components/dialogs'

// Other
import mockRouter from './MockRouter'
import Vuelidate from 'vuelidate'
import { StaffPaymentOptions } from '@/enums'

// mock fetch() as it is not defined in Jest
// NB: it should be `global.fetch` but that doesn't work and this does
window.fetch = jest.fn().mockImplementation(() => {
  return {
    headers: { get: () => new Date() },
    ok: true,
    statusTxt: ''
  }
})

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

// Mock filing data
const filingData = {
  header: {
    name: 'incorporationApplication',
    filingId: 12345,
    status: 'DRAFT'
  },
  business: {
    identifier: 'T1234567',
    legalType: 'BEN'
  },
  incorporationApplication: {
    contactPoint: {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '(250) 123-4567'
    },
    nameRequest: {
      legalType: 'BEN',
      nrNumber: 'NR 1234567',
      legalName: 'My Name Request Inc.'
    },
    offices: {
      registeredOffice: {
        deliveryAddress: {
          streetAddress: 'delivery_address - address line one',
          addressCity: 'delivery_address city',
          addressCountry: 'delivery_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        mailingAddress: {
          streetAddress: 'mailing_address - address line one',
          addressCity: 'mailing_address city',
          addressCountry: 'mailing_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        }
      },
      recordsOffice: {
        deliveryAddress: {
          streetAddress: 'delivery_address - address line one',
          addressCity: 'delivery_address city',
          addressCountry: 'delivery_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        mailingAddress: {
          streetAddress: 'mailing_address - address line one',
          addressCity: 'mailing_address city',
          addressCountry: 'mailing_address country',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        }
      }
    },
    parties: [
      {
        officer: {
          id: 1,
          firstName: 'Joe',
          lastName: 'Swanson',
          middleName: 'P',
          organizationName: '',
          partyType: 'person',
          email: 'completing-party@example.com'
        },
        mailingAddress: {
          streetAddress: 'mailing_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'mailing_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        deliveryAddress: {
          streetAddress: 'delivery_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'delivery_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        appointmentDate: '2018-01-01',
        roles: [
          {
            roleType: 'CompletingParty',
            appointmentDate: '2018-01-01'
          },
          {
            roleType: 'Director',
            appointmentDate: '2018-01-01'
          }
        ]
      },
      {
        officer: {
          id: 2,
          firstName: '',
          lastName: '',
          middleName: '',
          organizationName: 'XyzInc.',
          partyType: 'organization'
        },
        mailingAddress: {
          streetAddress: 'mailing_address-addresslineone',
          streetAddressAdditional: '',
          addressCity: 'mailing_addresscity',
          addressCountry: 'CA',
          postalCode: 'H0H0H0',
          addressRegion: 'BC'
        },
        appointmentDate: '2018-01-01',
        roles: [
          {
            roleType: 'Incorporator',
            appointmentDate: '2018-01-01'
          }
        ]
      }
    ],
    shareStructure: {
      shareClasses: [
        {
          id: 1,
          name: 'ShareClass1',
          priority: 1,
          hasMaximumShares: true,
          maxNumberOfShares: 100,
          hasParValue: true,
          parValue: 10,
          currency: 'CAD',
          hasRightsOrRestrictions: false,
          series: [
            {
              id: 1,
              name: 'ShareSeries1',
              priority: 1,
              hasMaximumShares: true,
              maxNumberOfShares: 50,
              hasRightsOrRestrictions: false
            },
            {
              id: 2,
              name: 'ShareSeries2',
              priority: 2,
              hasMaximumShares: true,
              maxNumberOfShares: 100,
              hasRightsOrRestrictions: false
            }
          ]
        },
        {
          id: 2,
          name: 'ShareClass2',
          priority: 1,
          hasMaximumShares: false,
          maxNumberOfShares: null,
          hasParValue: false,
          parValue: null,
          currency: null,
          hasRightsOrRestrictions: true,
          series: [

          ]
        }
      ]
    },
    incorporationAgreement: {
      agreementType: 'sample'
    }
  }
}

// Mock NR data
const nrData = {
  applicants: {
    addrLine1: 'address line 1',
    addrLine2: 'address line 2',
    addrLine3: 'address line 3',
    city: 'Victoria',
    countryTypeCd: 'CA',
    emailAddress: 'tester@test.com',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Joe',
    phoneNumber: '250-111-2222',
    postalCd: 'V1V 1A2',
    stateProvinceCd: 'BC'
  },
  consentFlag: 'R',
  corpNum: null,
  entity_type_cd: 'BC',
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  names: [
    {
      choice: 1,
      consumptionDate: null,
      corpNum: null,
      name: 'ABC 1234',
      state: 'APPROVED'
    },
    {
      choice: 2,
      consumptionDate: null,
      corpNum: null,
      name: 'CDE 1234',
      state: 'NE'
    }
  ],
  nrNum: 'NR 1234567',
  state: 'APPROVED'
}

describe('Numbered company setup', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            { email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/T7654321/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET IA filing
    get.withArgs('businesses/T7654321/filings')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filing: {
            header: {
              name: 'incorporationApplication',
              filingId: 54321,
              status: 'DRAFT'
            },
            business: {
              identifier: 'T7654321',
              legalType: 'BEN'
            },
            incorporationApplication: {
              nameRequest: {
                legalType: 'BEN'
              }
            }
          }
        }
      })))

    // GET filing fees
    get.withArgs('fees/BEN/BCINC?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: { futureEffectiveFees: 100 }
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T7654321' } })
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true, ConfirmDialog } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('loads a draft filing into the store', () => {
    // Validate IA for numbered company
    expect(store.state.stateModel.entityType).toBe('BEN')
    expect(store.state.stateModel.filingId).toBe(54321)

    // Validate no offices are loaded
    expect(store.state.stateModel.defineCompanyStep.officeAddresses)
      .toBeDefined()
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toBeUndefined()

    // Validate Contact Info
    expect(store.state.stateModel.businessContact)
      .toBeDefined()

    // Validate Share Structure
    expect(store.state.stateModel.createShareStructureStep.shareClasses)
      .toBeDefined()
  })

  it('does not load a name request into the store', () => {
    // All Name request specific fields should be empty
    expect(store.state.stateModel.nameRequest.nrNumber).toEqual('')
    expect(store.state.stateModel.filingId).toBe(54321)

    // Validate no NR Details
    expect(store.state.stateModel.nameRequest.details.approvedName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.status).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.consentFlag).toBeUndefined()
    expect(store.state.stateModel.nameRequest.details.expirationDate).toBeUndefined()

    // Validate no NR Applicant
    expect(store.state.stateModel.nameRequest.applicant.firstName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.middleName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.lastName).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.emailAddress).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.phoneNumber).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine1).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine2).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.addressLine3).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.city).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode)
      .toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBeUndefined()
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode)
      .toBeUndefined()
  })
})

describe('App component', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/T1234567/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data:
        {
          ...nrData
        }
      })))

    // GET IA filing
    get.withArgs('businesses/T1234567/filings')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filing: {
            ...filingData
          }
        }
      })))

    // GET filing fees
    get.withArgs('fees/BEN/BCINC?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: { futureEffectiveFees: 100 }
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true, ConfirmDialog } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.find(SbcHeader).exists()).toBe(true)
    expect(wrapper.find(SbcFooter).exists()).toBe(true)
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
    expect(wrapper.find(Stepper).exists()).toBe(true)
    expect(wrapper.find(Actions).exists()).toBe(true)
  })

  it('gets auth and user info properly', () => {
    expect(store.getters.isAuthEdit).toBe(true)
    expect(store.getters.isAuthView).toBe(true)
    expect(store.state.stateModel.tombstone.userEmail).toBe('completing-party@example.com')
  })

  it('loads a draft filing into the store', () => {
    // Validate Filing ID - set by fetchDraft()
    expect(store.state.stateModel.filingId).toBe(12345)

    // Validate Entity Type
    expect(store.state.stateModel.entityType).toBe('BEN')

    // Validate Office Addresses
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)

    // Validate People And Roles
    expect(store.state.stateModel.addPeopleAndRoleStep.orgPeople)
      .toStrictEqual(filingData.incorporationApplication.parties)

    // Validate Share Structure
    expect(store.state.stateModel.createShareStructureStep.shareClasses)
      .toStrictEqual(filingData.incorporationApplication.shareStructure.shareClasses)

    // Validate Incorporation Agreement
    expect(store.state.stateModel.incorporationAgreementStep.agreementType)
      .toStrictEqual(filingData.incorporationApplication.incorporationAgreement.agreementType)
  })

  it('loads a name request into the store', () => {
    // Validate Name Request
    expect(store.state.stateModel.entityType).toBe('BEN')
    expect(store.state.stateModel.nameRequest.nrNumber).toBe(nrData.nrNum)
    expect(store.state.stateModel.filingId).toBe(12345)
    expect(store.state.stateModel.nameRequest.details).toBeDefined()
    expect(store.state.stateModel.nameRequest.applicant).toBeDefined()

    // Validate NR Details
    expect(store.state.stateModel.nameRequest.details.approvedName).toBe(nrData.names[0].name)
    expect(store.state.stateModel.nameRequest.details.status).toBe(nrData.state)
    expect(store.state.stateModel.nameRequest.details.consentFlag).toBe(nrData.consentFlag)
    expect(store.state.stateModel.nameRequest.details.expirationDate).toBe(nrData.expirationDate)

    // Validate NR Applicant
    expect(store.state.stateModel.nameRequest.applicant.firstName).toBe(nrData.applicants.firstName)
    expect(store.state.stateModel.nameRequest.applicant.middleName).toBe(nrData.applicants.middleName)
    expect(store.state.stateModel.nameRequest.applicant.lastName).toBe(nrData.applicants.lastName)
    expect(store.state.stateModel.nameRequest.applicant.emailAddress).toBe(nrData.applicants.emailAddress)
    expect(store.state.stateModel.nameRequest.applicant.phoneNumber).toBe(nrData.applicants.phoneNumber)
    expect(store.state.stateModel.nameRequest.applicant.addressLine1).toBe(nrData.applicants.addrLine1)
    expect(store.state.stateModel.nameRequest.applicant.addressLine2).toBe(nrData.applicants.addrLine2)
    expect(store.state.stateModel.nameRequest.applicant.addressLine3).toBe(nrData.applicants.addrLine3)
    expect(store.state.stateModel.nameRequest.applicant.city).toBe(nrData.applicants.city)
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode).toBe(nrData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBe(nrData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode).toBe(nrData.applicants.stateProvinceCd)
  })

  it('shows confirm popup if exiting before saving changes', async () => {
    // simulate that we have unsaved changes
    store.state.stateModel.haveChanges = true

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog is showing
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.classes('v-dialog--active')).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    expect(dialog.text()).toContain('You have unsaved changes')

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('redirects to dashboard if exiting after saving changes', async () => {
    // simulate that we have no unsaved changes
    store.state.stateModel.haveChanges = false

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog does not exist
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.exists()).toBe(false)

    // verify redirection
    const baseUrl = 'myhost/business/T1234567'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})

describe('Dissolution BEN - External User', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.effectiveDateTime.isFutureEffective = false
    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = false
    await flushPromises()

    const sbcFeeSummaryGet = sinon.stub(sbcFeeSummaryAxios, 'get')

    const feesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 1.50,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 21.5
      }
    }))

    const feesFutureEffectivePromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 100.0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 1.5,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 121.5
      }
    }))

    // GET filing fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/BEN/DIS_VOL')
      .returns(feesPromise)

    // GET filing fees from SbcFeeSummary component with future effective flag
    sbcFeeSummaryGet.withArgs('fees/BEN/DIS_VOL?futureEffective=true')
      .returns(feesFutureEffectivePromise)

    const get = sinon.stub(axios, 'get')

    // GET filing fees
    get.withArgs('fees/BEN/DIS_VOL')
      .returns(feesPromise)

    // GET filing fees with future effective flag
    get.withArgs('fees/BEN/DIS_VOL?futureEffective=true')
      .returns(feesFutureEffectivePromise)

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/BC0870803/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET business data
    get.withArgs('entities/BC0870803')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          affiliations: [5925],
          businessIdentifier: 'BC0870803',
          contacts: [{
            email: 'andre.pestana@aot-technologies.com',
            phone: '(123) 456-7890',
            phoneExtension: ''
          }],
          corpType: {
            code: 'BEN',
            default: false,
            desc: 'Benefit Company'
          },
          created: '2021-10-07T20:37:41+00:00',
          createdBy: 'None None',
          modified: '2021-10-07T20:37:41+00:00',
          modifiedBy: 'None None',
          name: '0870803 B.C. LTD.',
          passCodeClaimed: true
        }
      })))

    // GET business tasks
    get.withArgs('businesses/BC0870803/tasks')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          tasks: [{
            enabled: true,
            order: 1,
            task: {
              filing: {
                business: {
                  identifier: 'BC0870803',
                  legalName: '0870803 B.C. LTD.',
                  legalType: 'BEN'
                },
                dissolution: {
                  custodialOffice: {
                    deliveryAddress: {
                      addressCity: 'North Saanich',
                      addressCountry: 'CA',
                      addressRegion: 'BC',
                      deliveryInstructions: '',
                      postalCode: 'V8L 5V4',
                      streetAddress: '132-1640 Electra Blvd',
                      streetAddressAdditional: ''
                    },
                    mailingAddress: {
                      addressCity: 'North Saanich',
                      addressCountry: 'CA',
                      addressRegion: 'BC',
                      deliveryInstructions: '',
                      postalCode: 'V8L 5V4',
                      streetAddress: '132-1640 Electra Blvd',
                      streetAddressAdditional: ''
                    }
                  },
                  dissolutionType: 'voluntary'
                },
                header: {
                  affectedFilings: [],
                  availableOnPaperOnly: false,
                  colinIds: [],
                  comments: [],
                  date: '2021-11-01T22:57:50.017255+00:00',
                  deletionLocked: false,
                  effectiveDate: '2021-11-01T22:57:50.017306+00:00',
                  filingId: 113152,
                  inColinOnly: false,
                  isCorrected: false,
                  isCorrectionPending: false,
                  name: 'dissolution',
                  status: 'DRAFT',
                  submitter: 'apestana@idir'
                }
              }
            }
          }]

        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    const router = mockRouter.mock()
    router.push({ name: 'define-dissolution', query: { id: 'BC0870803' } })
    wrapper = mount(App, { localVue, store, router, vuetify })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.find(SbcHeader).exists()).toBe(true)
    expect(wrapper.find(SbcFooter).exists()).toBe(true)
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
    expect(wrapper.find(Stepper).exists()).toBe(true)
    expect(wrapper.find(Actions).exists()).toBe(true)
  })

  it('calculates the correct fees', async () => {
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    const feeText = wrapper.find(SbcFeeSummary).text()
    expect(feeText).toContain('Voluntary dissolution 20')
    expect(feeText).toContain('Service Fee 1.5')
    expect(feeText).toContain('Total Fees CAD 21.5')
    store.state.stateModel.effectiveDateTime.isFutureEffective = true
    await flushPromises()
    const feeTextFutureEffective = wrapper.find(SbcFeeSummary).text()
    expect(feeTextFutureEffective).toContain('Total Fees CAD 121.5')
  })
})

describe('Dissolution BEN - Staff User', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.effectiveDateTime.isFutureEffective = false
    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = false
    await flushPromises()

    const sbcFeeSummaryGet = sinon.stub(sbcFeeSummaryAxios, 'get')

    const feesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 20.0
      }
    }))

    const feesFutureEffectivePromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 100.0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 120.0
      }
    }))

    // GET filing fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/BEN/DIS_VOL')
      .returns(feesPromise)

    // GET filing fees from SbcFeeSummary component with future effective flag
    sbcFeeSummaryGet.withArgs('fees/BEN/DIS_VOL?futureEffective=true')
      .returns(feesFutureEffectivePromise)

    const get = sinon.stub(axios, 'get')

    // GET filing fees
    get.withArgs('fees/BEN/DIS_VOL')
      .returns(feesPromise)

    // GET filing fees with future effective flag
    get.withArgs('fees/BEN/DIS_VOL?futureEffective=true')
      .returns(feesFutureEffectivePromise)

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/BC0870803/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view', 'staff']
        }
      })))

    // GET business data
    get.withArgs('entities/BC0870803')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          affiliations: [5925],
          businessIdentifier: 'BC0870803',
          contacts: [{
            email: 'andre.pestana@aot-technologies.com',
            phone: '(123) 456-7890',
            phoneExtension: ''
          }],
          corpType: {
            code: 'BEN',
            default: false,
            desc: 'Benefit Company'
          },
          created: '2021-10-07T20:37:41+00:00',
          createdBy: 'None None',
          modified: '2021-10-07T20:37:41+00:00',
          modifiedBy: 'None None',
          name: '0870803 B.C. LTD.',
          passCodeClaimed: true
        }
      })))

    // GET business tasks
    get.withArgs('businesses/BC0870803/tasks')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          tasks: [{
            enabled: true,
            order: 1,
            task: {
              filing: {
                business: {
                  identifier: 'BC0870803',
                  legalName: '0870803 B.C. LTD.',
                  legalType: 'BEN'
                },
                dissolution: {
                  custodialOffice: {
                    deliveryAddress: {
                      addressCity: 'North Saanich',
                      addressCountry: 'CA',
                      addressRegion: 'BC',
                      deliveryInstructions: '',
                      postalCode: 'V8L 5V4',
                      streetAddress: '132-1640 Electra Blvd',
                      streetAddressAdditional: ''
                    },
                    mailingAddress: {
                      addressCity: 'North Saanich',
                      addressCountry: 'CA',
                      addressRegion: 'BC',
                      deliveryInstructions: '',
                      postalCode: 'V8L 5V4',
                      streetAddress: '132-1640 Electra Blvd',
                      streetAddressAdditional: ''
                    }
                  },
                  dissolutionType: 'voluntary'
                },
                header: {
                  affectedFilings: [],
                  availableOnPaperOnly: false,
                  colinIds: [],
                  comments: [],
                  date: '2021-11-01T22:57:50.017255+00:00',
                  deletionLocked: false,
                  effectiveDate: '2021-11-01T22:57:50.017306+00:00',
                  filingId: 113152,
                  inColinOnly: false,
                  isCorrected: false,
                  isCorrectionPending: false,
                  name: 'dissolution',
                  status: 'DRAFT',
                  submitter: 'apestana@idir'
                }
              }
            }
          }]

        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    const router = mockRouter.mock()
    router.push({ name: 'define-dissolution', query: { id: 'BC0870803' } })
    wrapper = mount(App, { localVue, store, router, vuetify })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('calculates the correct fees', async () => {
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    const feeText = wrapper.find(SbcFeeSummary).text()
    expect(feeText).toContain('Voluntary dissolution 20')
    expect(feeText).toContain('Total Fees CAD 20')

    store.state.stateModel.effectiveDateTime.isFutureEffective = true
    await flushPromises()
    const feeTextFutureEffective = wrapper.find(SbcFeeSummary).text()
    expect(feeTextFutureEffective).toContain('Future Effective Fee 100')
    expect(feeTextFutureEffective).toContain('Total Fees CAD 120')
  })
})

describe('Dissolution COOP - External User', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.effectiveDateTime.isFutureEffective = false
    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = false
    await flushPromises()

    const sbcFeeSummaryGet = sinon.stub(sbcFeeSummaryAxios, 'get')

    const voluntaryDissolutionFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 20.0
      }
    }))

    const affidavitFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Affidavit',
        filingTypeCode: 'AFDVT',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 20.0
      }
    }))

    const specialResolutionFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 70.0,
        filingType: 'Special resolution',
        filingTypeCode: 'SPRLN',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 70.0
      }
    }))

    // GET filing voluntary dissolution fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/DIS_VOL')
      .returns(voluntaryDissolutionFeesPromise)

    // GET filing Special resolution fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/SPRLN')
      .returns(specialResolutionFeesPromise)

    // GET filing Affidavit fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/AFDVT')
      .returns(affidavitFeesPromise)

    const get = sinon.stub(axios, 'get')

    // GET filing voluntary dissolution fees
    get.withArgs('fees/CP/DIS_VOL')
      .returns(voluntaryDissolutionFeesPromise)

    // GET filing Special resolution fees
    get.withArgs('fees/CP/SPRLN')
      .returns(specialResolutionFeesPromise)

    // GET filing Affidavit fees
    get.withArgs('fees/CP/AFDVT')
      .returns(affidavitFeesPromise)

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/CP1002398/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET business data
    get.withArgs('entities/CP1002398')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          affiliations: [6158],
          businessIdentifier: 'CP1002398',
          contacts: [
            {
              email: 'andre.pestana@aot-technologies.com',
              phone: '',
              phoneExtension: ''
            }
          ],
          corpType: {
            code: 'CP',
            default: true,
            desc: 'Cooperatives'
          },
          created: '2021-11-03T20:00:58+00:00',
          createdBy: 'None None',
          modified: '2021-11-03T20:00:58+00:00',
          modifiedBy: 'None None',
          name: 'HJJHV COOP',
          passCodeClaimed: true
        }
      })))

    // GET business tasks
    get.withArgs('businesses/CP1002398/tasks')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          tasks: [
            {
              enabled: true,
              order: 1,
              task: {
                filing: {
                  business: {
                    identifier: 'CP1002398',
                    legalName: 'HJJHV COOP',
                    legalType: 'CP'
                  },
                  dissolution: {
                    custodialOffice: {
                      deliveryAddress: {
                        addressCity: 'North Saanich',
                        addressCountry: 'CA',
                        addressRegion: 'BC',
                        deliveryInstructions: '',
                        postalCode: 'V8L 5V4',
                        streetAddress: '123-1640 Electra Blvd',
                        streetAddressAdditional: ''
                      },
                      mailingAddress: {
                        addressCity: 'North Saanich',
                        addressCountry: 'CA',
                        addressRegion: 'BC',
                        deliveryInstructions: '',
                        postalCode: 'V8L 5V4',
                        streetAddress: '123-1640 Electra Blvd',
                        streetAddressAdditional: ''
                      }
                    },
                    dissolutionType: 'voluntary'
                  },
                  header: {
                    affectedFilings: [],
                    availableOnPaperOnly: false,
                    colinIds: [],
                    comments: [],
                    date: '2021-11-03T20:50:51.553999+00:00',
                    deletionLocked: false,
                    effectiveDate: '2021-11-03T20:50:51.554019+00:00',
                    filingId: 113176,
                    inColinOnly: false,
                    isCorrected: false,
                    isCorrectionPending: false,
                    name: 'dissolution',
                    status: 'DRAFT',
                    submitter: 'bcsc/sdsqcixfw7czxwu5jzddwkty3p72od6a'
                  }
                }
              }
            }
          ]
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    const router = mockRouter.mock()
    router.push({ name: 'define-dissolution', query: { id: 'CP1002398' } })
    wrapper = mount(App, { localVue, store, router, vuetify, stubs: { 'UploadResolution': true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('calculates the correct fees', async () => {
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    const feeText = wrapper.find(SbcFeeSummary).text()
    expect(feeText).toContain('Voluntary dissolution 20')
    expect(feeText).toContain('Affidavit 20')
    expect(feeText).toContain('Special resolution 70')
    expect(feeText).toContain('Total Fees CAD 110')
  })
})

describe('Dissolution COOP - Staff User', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_WEB_URL', 'myhost/basePath/auth/')
  sessionStorage.setItem('DASHBOARD_URL', 'myhost/business/')
  sessionStorage.setItem('AUTH_API_URL', '')
  sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
  sessionStorage.setItem('PAY_API_URL', '')

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.effectiveDateTime.isFutureEffective = false
    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = false
    await flushPromises()

    const sbcFeeSummaryGet = sinon.stub(sbcFeeSummaryAxios, 'get')

    const voluntaryDissolutionFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 20.0
      }
    }))

    const voluntaryDissolutionFeesFutureEffectivePromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 100.0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 20.0
      }
    }))

    const voluntaryDissolutionWaiveFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 0,
        filingType: 'Voluntary dissolution',
        filingTypeCode: 'DIS_VOL',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          'gst': 0,
          'pst': 0
        },
        total: 0
      }
    }))

    const affidavitFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 20.0,
        filingType: 'Affidavit',
        filingTypeCode: 'AFDVT',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 20.0
      }
    }))

    const affidavitWaiveFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 0,
        filingType: 'Affidavit',
        filingTypeCode: 'AFDVT',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 0
      }
    }))

    const specialResolutionFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 70.0,
        filingType: 'Special resolution',
        filingTypeCode: 'SPRLN',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 70.0
      }
    }))

    const specialResolutionWaiveFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 0,
        filingType: 'Special resolution',
        filingTypeCode: 'SPRLN',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 0
      }
    }))

    const specialResolutionWithPriorityFeesPromise = new Promise((resolve) => resolve({
      data:
      {
        filingFees: 70.0,
        filingType: 'Special resolution',
        filingTypeCode: 'SPRLN',
        futureEffectiveFees: 0,
        priorityFees: 100.0,
        processingFees: 0,
        serviceFees: 0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 170.0
      }
    }))

    // GET filing voluntary dissolution fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/DIS_VOL')
      .returns(voluntaryDissolutionFeesPromise)

    // GET filing voluntary dissolution future effective fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('voluntaryDissolutionFeesFutureEffectivePromise')
      .returns(voluntaryDissolutionFeesFutureEffectivePromise)

    // GET filing voluntary dissolution waive fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/DIS_VOL?waiveFees=true')
      .returns(voluntaryDissolutionWaiveFeesPromise)

    // GET filing Special resolution fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/SPRLN')
      .returns(specialResolutionFeesPromise)

    // GET filing Special resolution waive fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/SPRLN?waiveFees=true')
      .returns(specialResolutionWaiveFeesPromise)

    // GET filing Special resolution with priority fees from SbcFeeSummary component
    sbcFeeSummaryGet.withArgs('fees/CP/SPRLN?priority=true')
      .returns(specialResolutionWithPriorityFeesPromise)

    // GET filing Affidavit fees from SbcFeeSummary component with future effective flag
    sbcFeeSummaryGet.withArgs('fees/CP/AFDVT')
      .returns(affidavitFeesPromise)

    // GET filing Affidavit waive fees from SbcFeeSummary component with future effective flag
    sbcFeeSummaryGet.withArgs('fees/CP/AFDVT?waiveFees=true')
      .returns(affidavitWaiveFeesPromise)

    const get = sinon.stub(axios, 'get')

    // GET filing voluntary dissolution fees
    get.withArgs('fees/CP/DIS_VOL')
      .returns(voluntaryDissolutionFeesPromise)

    // GET filing voluntary dissolution waive fees
    get.withArgs('fees/CP/DIS_VOL?waiveFees=true')
      .returns(voluntaryDissolutionWaiveFeesPromise)

    // GET filing Special resolution fees
    get.withArgs('fees/CP/SPRLN')
      .returns(specialResolutionFeesPromise)

    // GET filing Special resolution waive fees
    get.withArgs('fees/CP/SPRLN?waiveFees=true')
      .returns(specialResolutionWaiveFeesPromise)

    // GET filing Special resolution with priority fees
    get.withArgs('fees/CP/SPRLN?priority=true')
      .returns(specialResolutionWithPriorityFeesPromise)

    // GET filing Affidavit fees
    get.withArgs('fees/CP/AFDVT')
      .returns(affidavitFeesPromise)

    // GET filing Affidavit waive fees
    get.withArgs('fees/CP/AFDVT?waiveFees=true')
      .returns(affidavitWaiveFeesPromise)

    // GET current user's info
    get.withArgs('users/@me')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('orgs/668')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('entities/CP1002398/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          roles: ['edit', 'view', 'staff']
        }
      })))

    // GET business data
    get.withArgs('entities/CP1002398')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          affiliations: [6158],
          businessIdentifier: 'CP1002398',
          contacts: [
            {
              email: 'andre.pestana@aot-technologies.com',
              phone: '',
              phoneExtension: ''
            }
          ],
          corpType: {
            code: 'CP',
            default: true,
            desc: 'Cooperatives'
          },
          created: '2021-11-03T20:00:58+00:00',
          createdBy: 'None None',
          modified: '2021-11-03T20:00:58+00:00',
          modifiedBy: 'None None',
          name: 'HJJHV COOP',
          passCodeClaimed: true
        }
      })))

    // GET business tasks
    get.withArgs('businesses/CP1002398/tasks')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          tasks: [
            {
              enabled: true,
              order: 1,
              task: {
                filing: {
                  business: {
                    identifier: 'CP1002398',
                    legalName: 'HJJHV COOP',
                    legalType: 'CP'
                  },
                  dissolution: {
                    custodialOffice: {
                      deliveryAddress: {
                        addressCity: 'North Saanich',
                        addressCountry: 'CA',
                        addressRegion: 'BC',
                        deliveryInstructions: '',
                        postalCode: 'V8L 5V4',
                        streetAddress: '123-1640 Electra Blvd',
                        streetAddressAdditional: ''
                      },
                      mailingAddress: {
                        addressCity: 'North Saanich',
                        addressCountry: 'CA',
                        addressRegion: 'BC',
                        deliveryInstructions: '',
                        postalCode: 'V8L 5V4',
                        streetAddress: '123-1640 Electra Blvd',
                        streetAddressAdditional: ''
                      }
                    },
                    dissolutionType: 'voluntary'
                  },
                  header: {
                    affectedFilings: [],
                    availableOnPaperOnly: false,
                    colinIds: [],
                    comments: [],
                    date: '2021-11-03T20:50:51.553999+00:00',
                    deletionLocked: false,
                    effectiveDate: '2021-11-03T20:50:51.554019+00:00',
                    filingId: 113176,
                    inColinOnly: false,
                    isCorrected: false,
                    isCorrectionPending: false,
                    name: 'dissolution',
                    status: 'DRAFT',
                    submitter: 'bcsc/sdsqcixfw7czxwu5jzddwkty3p72od6a'
                  }
                }
              }
            }
          ]
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    const router = mockRouter.mock()
    router.push({ name: 'define-dissolution', query: { id: 'CP1002398' } })
    wrapper = mount(App, { localVue, store, router, vuetify, stubs: { 'UploadResolution': true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('calculates the correct fees', async () => {
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    const feeText = wrapper.find(SbcFeeSummary).text()
    expect(feeText).toContain('Voluntary dissolution 20')
    expect(feeText).toContain('Affidavit 20')
    expect(feeText).toContain('Special resolution 70')
    expect(feeText).toContain('Total Fees CAD 110')

    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = true
    await flushPromises()
    const feeTextPriority = wrapper.find(SbcFeeSummary).text()
    expect(feeTextPriority).toContain('Priority Fee 100')
    expect(feeTextPriority).toContain('Total Fees CAD 210')

    store.state.stateModel.staffPaymentStep.staffPayment.option = StaffPaymentOptions.NO_FEE
    await flushPromises()
    const feeTextWaiveFees = wrapper.find(SbcFeeSummary).text()
    expect(feeTextWaiveFees).toContain('Voluntary dissolution No Fee')
    expect(feeTextWaiveFees).toContain('Affidavit No Fee')
    expect(feeTextWaiveFees).toContain('Special resolution No Fee')
    expect(feeTextWaiveFees).toContain('Total Fees CAD 0')
  })
})
