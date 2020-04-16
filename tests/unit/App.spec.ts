// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from '@/utils/axios-auth'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Mock filing data
const filingData = {
  header: {
    name: 'incorporationApplication',
    filingId: 12345,
    status: 'draft'
  },
  incorporationApplication: {
    contactPoint: {
      email: 'mockEmail@mock.com',
      confirmEmail: 'mockEmail@mock.com',
      phone: '(250) 123-4567'
    },
    nameRequest: {
      legalType: 'BC',
      nrNumber: 'NR1234567'
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
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  requestTypeCd: 'BC',
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

describe('App component', () => {
  let wrapper: any
  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)

  beforeEach(async () => {
    const get = sinon.stub(axios, 'get')

    // GET authorizations (role)
    get.withArgs('NR 1234567/authorizations')
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

    // GET tasks
    get.withArgs('businesses/NR 1234567/tasks')
      .returns(new Promise(resolve => resolve({
        data:
          {
            tasks: [
              {
                task: {
                  filing: {
                    ...filingData
                  }
                }
              }
            ]
          }
      })))

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { nrNumber: 'NR 1234567' } })
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
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

  it('loads a draft filing into the store', () => {
    // Validate Name Request
    expect(store.state.stateModel.nameRequest.entityType).toBe('BC')
    expect(store.state.stateModel.nameRequest.filingId).toBe(12345)

    // Validate Office Addresses
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.defineCompanyStep.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)
  })

  it('loads a name request into the store', () => {
    // Validate Name Request
    expect(store.state.stateModel.nameRequest.entityType).toBe(nrData.requestTypeCd)
    expect(store.state.stateModel.nameRequest.nrNumber).toBe(nrData.nrNum)
    expect(store.state.stateModel.nameRequest.filingId).toBe(12345)
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
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode)
      .toBe(nrData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBe(nrData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode)
      .toBe(nrData.applicants.stateProvinceCd)
  })
})
