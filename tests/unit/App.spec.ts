// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('App component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(App, { sync: false, localVue, store, router, vuetify, stubs: { Affix: true } })
  })

  afterEach(() => {
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

  it('loads a draft filing into store', async () => {
    // Mock Filing response from api
    const data = {
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
          nrNumber: 'NR7654446'
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

    await wrapper.vm.parseDraft(data)

    // Validate Office Addresses
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toStrictEqual(data.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toStrictEqual(data.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.defineCompanyStep.businessContact)
      .toStrictEqual(data.incorporationApplication.contactPoint)
  })

  it('loads nr data into store', async () => {
    // Mock NR data from the API
    const mockNrResponseData = {
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
      expirationDate: 'Wed, 24 Jun 2020 07:00:00 GMT',
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
      state: 'CONDITIONAL'
    }

    await wrapper.vm.setNameRequestState(
      wrapper.vm.generateNameRequestState(mockNrResponseData, 12345))

    // Validate nr
    expect(store.state.stateModel.nameRequest.entityType).toBe(mockNrResponseData.requestTypeCd)
    expect(store.state.stateModel.nameRequest.nrNumber).toBe(mockNrResponseData.nrNum)
    expect(store.state.stateModel.nameRequest.filingId).toBe(12345)
    expect(store.state.stateModel.nameRequest.details).toBeDefined()
    expect(store.state.stateModel.nameRequest.applicant).toBeDefined()

    // Validate nr details
    expect(store.state.stateModel.nameRequest.details.approvedName).toBe(mockNrResponseData.names[0].name)
    expect(store.state.stateModel.nameRequest.details.status).toBe(mockNrResponseData.state)
    expect(store.state.stateModel.nameRequest.details.consentFlag).toBe(mockNrResponseData.consentFlag)
    expect(store.state.stateModel.nameRequest.details.expirationDate).toBe(mockNrResponseData.expirationDate)

    // Validate nr applicant
    expect(store.state.stateModel.nameRequest.applicant.firstName).toBe(mockNrResponseData.applicants.firstName)
    expect(store.state.stateModel.nameRequest.applicant.middleName).toBe(mockNrResponseData.applicants.middleName)
    expect(store.state.stateModel.nameRequest.applicant.lastName).toBe(mockNrResponseData.applicants.lastName)
    expect(store.state.stateModel.nameRequest.applicant.emailAddress).toBe(mockNrResponseData.applicants.emailAddress)
    expect(store.state.stateModel.nameRequest.applicant.phoneNumber).toBe(mockNrResponseData.applicants.phoneNumber)
    expect(store.state.stateModel.nameRequest.applicant.addressLine1).toBe(mockNrResponseData.applicants.addrLine1)
    expect(store.state.stateModel.nameRequest.applicant.addressLine2).toBe(mockNrResponseData.applicants.addrLine2)
    expect(store.state.stateModel.nameRequest.applicant.addressLine3).toBe(mockNrResponseData.applicants.addrLine3)
    expect(store.state.stateModel.nameRequest.applicant.city).toBe(mockNrResponseData.applicants.city)
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode)
      .toBe(mockNrResponseData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBe(mockNrResponseData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode)
      .toBe(mockNrResponseData.applicants.stateProvinceCd)
  })
})
