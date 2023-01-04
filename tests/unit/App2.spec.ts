import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
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

describe('Incorporation - Define Company page for a BEN (named)', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

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
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-define-company', query: { id: 'T1234567' } })

    wrapper = shallowMount(App, {
      localVue,
      store,
      router,
      vuetify,
      stubs: { Affix: true, SbcHeader: true, ConfirmDialog }
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
    expect(store.state.stateModel.entityType).toBe('BEN')
    expect(store.state.stateModel.filingId).toBe(12345)

    // Validate Name Request fields
    expect(store.state.stateModel.nameRequest.consentFlag).toBe(nrData.consentFlag)
    expect(store.state.stateModel.nameRequest.expirationDate).toBe(nrData.expirationDate)
    expect(store.state.stateModel.nameRequest.legalType).toBe(nrData.legalType)
    expect(store.state.stateModel.nameRequest.nrNum).toBe(nrData.nrNum)
    expect(store.state.stateModel.nameRequest.request_action_cd).toBe(nrData.request_action_cd)
    expect(store.state.stateModel.nameRequest.state).toBe(nrData.state)

    // Validate NR Applicant
    expect(store.state.stateModel.nameRequest.applicants).toBeDefined()
    expect(store.state.stateModel.nameRequest.applicants.firstName).toBe(nrData.applicants.firstName)
    expect(store.state.stateModel.nameRequest.applicants.middleName).toBe(nrData.applicants.middleName)
    expect(store.state.stateModel.nameRequest.applicants.lastName).toBe(nrData.applicants.lastName)
    expect(store.state.stateModel.nameRequest.applicants.emailAddress).toBe(nrData.applicants.emailAddress)
    expect(store.state.stateModel.nameRequest.applicants.phoneNumber).toBe(nrData.applicants.phoneNumber)
    expect(store.state.stateModel.nameRequest.applicants.addrLine1).toBe(nrData.applicants.addrLine1)
    expect(store.state.stateModel.nameRequest.applicants.addrLine2).toBe(nrData.applicants.addrLine2)
    expect(store.state.stateModel.nameRequest.applicants.addrLine3).toBe(nrData.applicants.addrLine3)
    expect(store.state.stateModel.nameRequest.applicants.city).toBe(nrData.applicants.city)
    expect(store.state.stateModel.nameRequest.applicants.countryTypeCd).toBe(nrData.applicants.countryTypeCd)
    expect(store.state.stateModel.nameRequest.applicants.postalCd).toBe(nrData.applicants.postalCd)
    expect(store.state.stateModel.nameRequest.applicants.stateProvinceCd).toBe(nrData.applicants.stateProvinceCd)

    // Validate NR Names
    expect(store.state.stateModel.nameRequest.names).toBeDefined()
    expect(store.state.stateModel.nameRequest.names[0].name).toBe(nrData.names[0].name)
    expect(store.state.stateModel.nameRequest.names[0].state).toBe(nrData.names[0].state)
    expect(store.state.stateModel.nameRequest.names[1].name).toBe(nrData.names[1].name)
    expect(store.state.stateModel.nameRequest.names[1].state).toBe(nrData.names[1].state)

    // Validate Approved Name
    expect(store.state.stateModel.nameRequestApprovedName).toBe(nrData.names[0].name)
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
    expect(dialog.text()).toContain('You have unsaved changes.')

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
    const baseUrl = 'https://dashboard.url/T1234567?accountid=668'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })
})
