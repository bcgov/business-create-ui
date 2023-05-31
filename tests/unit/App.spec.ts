import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils'
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import Actions from '@/components/common/Actions.vue'
import EntityInfo from '@/components/common/EntityInfo.vue'
import Stepper from '@/components/common/Stepper.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import mockRouter from './MockRouter'
import Vuelidate from 'vuelidate'

// mock fetch() as it is not defined in Jest
// NB: it should be `global.fetch` but that doesn't work and this does
window.fetch = jest.fn().mockImplementation(() => {
  return {
    headers: { get: () => new Date() },
    ok: true,
    statusTxt: ''
  }
})

// mock alert() as it is not defined in Jest
window.alert = jest.fn()

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

// Populate session variables
sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')
sessionStorage.setItem('AUTH_API_URL', 'https://auth.api.url/')
sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')

// sample filing data
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

// sample NR data
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
  legalType: 'BEN',
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  names: [
    {
      name: 'ABC 1234',
      state: 'APPROVED'
    },
    {
      name: 'CDE 1234',
      state: 'NE'
    }
  ],
  nrNum: 'NR 1234567',
  request_action_cd: 'NEW',
  requestTypeCd: 'BC',
  state: 'APPROVED'
}

describe('Incorporation - Define Company page for a BEN (numbered)', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.stateModel.tempId = ''
    store.stateModel.business.businessId = ''

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('https://auth.api.url/users/@me')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/entities/T7654321/authorizations')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://pay.api.url/fees/BEN/BCINC?futureEffective=true')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filingFees: { futureEffectiveFees: 100 }
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    localVue.filter('currency', (x) => x)
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-define-company', query: { id: 'T7654321' } })

    wrapper = shallowMount(App, {
      localVue,
      router,
      vuetify,
      stubs: { Affix: true }
    })

    // return some valid Keycloak roles
    jest.spyOn(wrapper.vm, 'loadKeycloakRoles').mockImplementation(() => {
      return Promise.resolve(['edit', 'view'])
    })

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
    expect(store.stateModel.entityType).toBe('BEN')
    expect(store.stateModel.filingId).toBe(54321)

    // Validate no offices are loaded
    expect(store.stateModel.defineCompanyStep.officeAddresses).toBeDefined()
    expect(store.stateModel.defineCompanyStep.officeAddresses.recordsOffice).toBeUndefined()
    expect(store.stateModel.defineCompanyStep.officeAddresses.registeredOffice).toBeUndefined()

    // Validate Contact Info
    expect(store.stateModel.businessContact).toBeDefined()

    // Validate Share Structure
    expect(store.stateModel.createShareStructureStep.shareClasses).toBeDefined()
  })

  it('does not load a name request into the store', () => {
    // Validate empty Name Request fields
    expect(store.stateModel.nameRequest.applicants).toEqual({})
    expect(store.stateModel.nameRequest.consentFlag).toBeNull()
    expect(store.stateModel.nameRequest.expirationDate).toBeNull()
    expect(store.stateModel.nameRequest.legalType).toBeNull()
    expect(store.stateModel.nameRequest.names).toEqual([])
    expect(store.stateModel.nameRequest.nrNum).toBe('')
    expect(store.stateModel.nameRequest.request_action_cd).toBeNull()
    expect(store.stateModel.nameRequest.state).toBeNull()

    // Validate empty Approved Name
    expect(store.stateModel.nameRequestApprovedName).toBeNull()
  })
})

describe('Incorporation - Define Company page for a BEN (named)', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.stateModel.tempId = ''
    store.stateModel.business.businessId = ''

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('https://auth.api.url/users/@me')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/entities/T1234567/authorizations')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://pay.api.url/fees/BEN/BCINC?futureEffective=true')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filingFees: { futureEffectiveFees: 100 }
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    localVue.filter('currency', (x) => x)
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-define-company', query: { id: 'T1234567' } })

    wrapper = shallowMount(App, {
      localVue,
      router,
      vuetify,
      stubs: { Affix: true, ConfirmDialog }
    })

    // return some valid Keycloak roles
    jest.spyOn(wrapper.vm, 'loadKeycloakRoles').mockImplementation(() => {
      return Promise.resolve(['edit', 'view'])
    })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.findComponent(SbcHeader).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.findComponent(EntityInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Stepper).exists()).toBe(true)
    expect(wrapper.findComponent(Actions).exists()).toBe(true)
  })

  it('gets user email properly', () => {
    expect(store.stateModel.tombstone.userEmail).toBe('completing-party@example.com')
  })

  it('loads a draft filing into the store', () => {
    // Validate Filing ID - set by fetchDraft()
    expect(store.stateModel.filingId).toBe(12345)

    // Validate Entity Type
    expect(store.stateModel.entityType).toBe('BEN')

    // Validate Office Addresses
    expect(store.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.stateModel.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)

    // Validate People And Roles
    expect(store.stateModel.addPeopleAndRoleStep.orgPeople)
      .toStrictEqual(filingData.incorporationApplication.parties)

    // Validate Share Structure
    expect(store.stateModel.createShareStructureStep.shareClasses)
      .toStrictEqual(filingData.incorporationApplication.shareStructure.shareClasses)

    // Validate Incorporation Agreement
    expect(store.stateModel.incorporationAgreementStep.agreementType)
      .toStrictEqual(filingData.incorporationApplication.incorporationAgreement.agreementType)
  })

  it('loads a name request into the store', () => {
    expect(store.stateModel.entityType).toBe('BEN')
    expect(store.stateModel.filingId).toBe(12345)

    // Validate Name Request fields
    expect(store.stateModel.nameRequest.consentFlag).toBe(nrData.consentFlag)
    expect(store.stateModel.nameRequest.expirationDate).toBe(nrData.expirationDate)
    expect(store.stateModel.nameRequest.legalType).toBe(nrData.legalType)
    expect(store.stateModel.nameRequest.nrNum).toBe(nrData.nrNum)
    expect(store.stateModel.nameRequest.request_action_cd).toBe(nrData.request_action_cd)
    expect(store.stateModel.nameRequest.state).toBe(nrData.state)

    // Validate NR Applicant
    expect(store.stateModel.nameRequest.applicants).toBeDefined()
    expect(store.stateModel.nameRequest.applicants.firstName).toBe(nrData.applicants.firstName)
    expect(store.stateModel.nameRequest.applicants.middleName).toBe(nrData.applicants.middleName)
    expect(store.stateModel.nameRequest.applicants.lastName).toBe(nrData.applicants.lastName)
    expect(store.stateModel.nameRequest.applicants.emailAddress).toBe(nrData.applicants.emailAddress)
    expect(store.stateModel.nameRequest.applicants.phoneNumber).toBe(nrData.applicants.phoneNumber)
    expect(store.stateModel.nameRequest.applicants.addrLine1).toBe(nrData.applicants.addrLine1)
    expect(store.stateModel.nameRequest.applicants.addrLine2).toBe(nrData.applicants.addrLine2)
    expect(store.stateModel.nameRequest.applicants.addrLine3).toBe(nrData.applicants.addrLine3)
    expect(store.stateModel.nameRequest.applicants.city).toBe(nrData.applicants.city)
    expect(store.stateModel.nameRequest.applicants.countryTypeCd).toBe(nrData.applicants.countryTypeCd)
    expect(store.stateModel.nameRequest.applicants.postalCd).toBe(nrData.applicants.postalCd)
    expect(store.stateModel.nameRequest.applicants.stateProvinceCd).toBe(nrData.applicants.stateProvinceCd)

    // Validate NR Names
    expect(store.stateModel.nameRequest.names).toBeDefined()
    expect(store.stateModel.nameRequest.names[0].name).toBe(nrData.names[0].name)
    expect(store.stateModel.nameRequest.names[0].state).toBe(nrData.names[0].state)
    expect(store.stateModel.nameRequest.names[1].name).toBe(nrData.names[1].name)
    expect(store.stateModel.nameRequest.names[1].state).toBe(nrData.names[1].state)

    // Validate Approved Name
    expect(store.stateModel.nameRequestApprovedName).toBe(nrData.names[0].name)
  })

  it('shows confirm popup if exiting before saving changes', async () => {
    // simulate that we have unsaved changes
    store.stateModel.haveChanges = true

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog is showing
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.classes('v-dialog--active')).toBe(true)
    expect(dialog.isVisible()).toBe(true)
    expect(dialog.text()).toContain('You have unsaved changes.')

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('redirects to dashboard if exiting after saving changes', async () => {
    // simulate that we have no unsaved changes
    store.stateModel.haveChanges = false

    // call Go To Dashboard event handler
    await wrapper.vm.goToDashboard()

    // verify that dialog does not exist
    const dialog = wrapper.find('.confirm-dialog')
    expect(dialog.exists()).toBe(false)

    // verify redirection
    const baseUrl = 'https://dashboard.url/T1234567?accountid=668'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})

describe('Voluntary Dissolution - Define Dissolution page for a BEN', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.stateModel.tempId = ''
    store.stateModel.business.businessId = ''
    store.stateModel.effectiveDateTime.isFutureEffective = false
    store.stateModel.staffPaymentStep.staffPayment.isPriority = false

    const feesPromise = new Promise(resolve => resolve({
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
          gst: 0,
          pst: 0
        },
        total: 21.5
      }
    }))

    const feesFutureEffectivePromise = new Promise(resolve => resolve({
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
          gst: 0,
          pst: 0
        },
        total: 121.5
      }
    }))

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('https://auth.api.url/users/@me')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/entities/BC0870803/authorizations')
      .returns(new Promise(resolve => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET filing fees
    get.withArgs('https://pay.api.url/fees/BEN/DIS_VOL')
      .returns(feesPromise)

    // GET filing fees with future effective flag
    get.withArgs('https://pay.api.url/fees/BEN/DIS_VOL?futureEffective=true')
      .returns(feesFutureEffectivePromise)

    // GET auth info
    get.withArgs('https://auth.api.url/entities/BC0870803')
      .returns(new Promise(resolve => resolve({
        data:
        {
          contacts: [],
          folioNumber: null
        }
      })))

    // GET business data
    get.withArgs('entities/BC0870803')
      .returns(new Promise(resolve => resolve({
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

    // GET business info from Legal API
    get.withArgs('businesses/BC0870803')
      .returns(new Promise(resolve => resolve({
        data:
        {
        // Legal API Business data
          business: {
            legalName: '0870803 B.C. LTD.',
            goodStanding: true,
            taxId: '123456789',
            identifier: 'BC0870803',
            foundingDate: '2021-10-07T20:37:41+00:00',
            legalType: 'BEN'
          }
        }
      })))

    // GET business tasks
    get.withArgs('businesses/BC0870803/tasks')
      .returns(new Promise(resolve => resolve({
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
                  legalType: 'BEN',
                  foundingDate: '2021-10-07T20:37:41+00:00'
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

    // GET staff comments
    get.withArgs('businesses/BC0870803/comments')
      .returns(new Promise(resolve => resolve({
        data: []
      })))

    // create a Local Vue and install a few things on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    localVue.filter('currency', (x) => x)
    const router = mockRouter.mock()
    router.push({ name: 'dissolution-define-dissolution', query: { id: 'BC0870803' } })

    wrapper = shallowMount(App, {
      localVue,
      router,
      vuetify,
      stubs: { Affix: true }
    })

    // return some valid Keycloak roles
    jest.spyOn(wrapper.vm, 'loadKeycloakRoles').mockImplementation(() => {
      return Promise.resolve(['edit', 'view'])
    })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.findComponent(SbcHeader).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.findComponent(EntityInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Stepper).exists()).toBe(true)
    expect(wrapper.findComponent(Actions).exists()).toBe(true)
  })
})

describe('Restoration - App page', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.stateModel.tempId = ''
    store.stateModel.business.businessId = ''
    store.stateModel.staffPaymentStep.staffPayment.isPriority = false

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('https://auth.api.url/users/@me')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(new Promise(resolve => resolve({
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
    get.withArgs('https://auth.api.url/entities/BC0870803/authorizations')
      .returns(new Promise(resolve => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET filing fees
    get.withArgs('https://pay.api.url/fees/BEN/RESTF?futureEffective=true')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filingFees: {}
        }
      })))

    // GET auth info
    get.withArgs('https://auth.api.url/entities/BC0870803')
      .returns(new Promise(resolve => resolve({
        data:
        {
          contacts: [],
          folioNumber: null
        }
      })))

    // GET business data
    get.withArgs('entities/BC0870803')
      .returns(new Promise(resolve => resolve({
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

    // GET business info from Legal API
    get.withArgs('businesses/BC0870803')
      .returns(new Promise(resolve => resolve({
        data:
        {
        // Legal API Business data
          business: {
            legalName: '0870803 B.C. LTD.',
            goodStanding: true,
            taxId: '123456789',
            identifier: 'BC0870803',
            foundingDate: '2021-10-07T20:37:41+00:00',
            legalType: 'BEN',
            state: 'HISTORICAL'
          }
        }
      })))

    // GET business tasks
    get.withArgs('businesses/BC0870803/tasks')
      .returns(new Promise(resolve => resolve({
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
                  legalType: 'BEN',
                  foundingDate: '2021-10-07T20:37:41+00:00'
                },
                restoration: {
                  type: 'fullRestoration'
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
                  name: 'restoration',
                  status: 'DRAFT',
                  submitter: 'apestana@idir'
                }
              }
            }
          }]
        }
      })))

    // create a Local Vue and install a few things on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    localVue.filter('currency', (x) => x)
    const router = mockRouter.mock()
    router.push({ name: 'restoration-business-name', query: { id: 'BC0870803' } })

    wrapper = shallowMount(App, {
      localVue,
      router,
      vuetify,
      stubs: { Affix: true }
    })

    // return some valid Keycloak roles
    jest.spyOn(wrapper.vm, 'loadKeycloakRoles').mockImplementation(() => {
      return Promise.resolve(['edit', 'view'])
    })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.findComponent(SbcHeader).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFooter).exists()).toBe(true)
    expect(wrapper.findComponent(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.findComponent(EntityInfo).exists()).toBe(true)
    expect(wrapper.findComponent(Stepper).exists()).toBe(true)
    expect(wrapper.findComponent(Actions).exists()).toBe(true)
  })
})
