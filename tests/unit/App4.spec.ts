import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
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

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

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
  state: 'APPROVED'
}

// *** TODO: implement more tests!
describe('Restoration - Restore Business Name for a BEN', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.staffPaymentStep.staffPayment.isPriority = false

    const feesPromise = new Promise(resolve => resolve({
      data:
      {
        filingFees: 123.0,
        filingType: 'Restoration',
        filingTypeCode: 'RESTORATION_BEN',
        futureEffectiveFees: 0,
        priorityFees: 0,
        processingFees: 0,
        serviceFees: 2.0,
        tax: {
          gst: 0,
          pst: 0
        },
        total: 125.0
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
    get.withArgs('https://pay.api.url/fees/BEN/RESTORATION_BEN?futureEffective=true')
      .returns(feesPromise)

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
                restoration: {
                  // *** TODO: implement
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

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuelidate)
    localVue.filter('currency', (x) => x)
    const router = mockRouter.mock()
    router.push({ name: 'restoration-business-name', query: { id: 'BC0870803' } })

    wrapper = mount(App, {
      localVue,
      store,
      router,
      vuetify,
      stubs: { Affix: true, SbcHeader: true, SbcFeeSummary: true }
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
