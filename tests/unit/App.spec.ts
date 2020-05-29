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
import { ConfirmDialog } from '@/components/dialogs'

// Other
import mockRouter from './MockRouter'

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
    status: 'draft'
  },
  business: {
    identifier: 'T1234567',
    legalType: 'BC'
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
    },
    parties: [
      {
        officer: {
          id: 1,
          firstName: 'Joe',
          lastName: 'Swanson',
          middleName: 'P',
          orgName: '',
          partyType: 'person'
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
          orgName: 'XyzInc.',
          partyType: 'org'
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
  const { assign } = window.location
  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/cooperatives/`)

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET authorizations (role)
    get.withArgs('T1234567/authorizations')
      .returns(new Promise((resolve) => resolve({
        data:
          {
            roles: ['edit', 'view']
          }
      })))

    // GET NR data
    get.withArgs('nameRequests/NR1234567')
      .returns(new Promise(resolve => resolve({
        data:
          {
            ...nrData
          }
      })))

    get.withArgs('businesses/T1234567/filings')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filing: {
            ...filingData
          }
        }
      })))

    // businesses/${this.getBusinessIdentifier}/filings
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

  it('loads a draft filing into the store', () => {
    // Validate Name Request
    console.log(store.state.stateModel.entityType)
    expect(store.state.stateModel.entityType).toBe('BC')
    expect(store.state.stateModel.filingId).toBe(12345)

    // Validate Office Addresses
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toStrictEqual(filingData.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.defineCompanyStep.businessContact)
      .toStrictEqual(filingData.incorporationApplication.contactPoint)

    // Validate People And Roles
    expect(store.state.stateModel.addPeopleAndRoleStep.orgPeople)
      .toStrictEqual(filingData.incorporationApplication.parties)

    // Validate Share Structure
    expect(store.state.stateModel.createShareStructureStep.shareClasses)
      .toStrictEqual(filingData.incorporationApplication.shareClasses)
  })

  it('loads a name request into the store', () => {
    // Validate Name Request
    expect(store.state.stateModel.entityType).toBe(nrData.requestTypeCd)
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
    expect(store.state.stateModel.nameRequest.applicant.countryTypeCode)
      .toBe(nrData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicant.postalCode).toBe(nrData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicant.stateProvinceCode)
      .toBe(nrData.applicants.stateProvinceCd)
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
    const baseUrl = 'myhost/cooperatives/T1234567'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})
