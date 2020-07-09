// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue, createWrapper } from '@vue/test-utils'
import sinon from 'sinon'
import axios from '@/utils/axios-auth'

// Components
import { Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'
import { NameRequestStates } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

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

describe('Actions component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('Disables File and Pay button when certify from is not valid', () => {
    // verify File and Pay button state
    store.state.stateModel.certifyState = {
      valid: false,
      certifiedBy: 'Some Certifier'
    }
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBe('true')
  })

  it('Enables File and Pay button when certify from is valid', async () => {
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.nameRequest = { entityType: 'BC' }
    store.state.stateModel.defineCompanyStep = { valid: true }
    store.state.stateModel.addPeopleAndRoleStep = { valid: true }
    store.state.stateModel.createShareStructureStep = { valid: true }
    store.state.stateModel.incorporationAgreementStep = { valid: true }
    store.state.stateModel.incorporationDateTime = { valid: true }
    await Vue.nextTick()

    // verify File and Pay button state
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBeUndefined()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})

describe('Emits error event if NR validation fails in file and pay', () => {
  let wrapper: any
  const { assign } = window.location
  const effectiveDate = new Date(new Date().setDate(new Date().getDate() + 5))
  const formattedEffectiveDate = effectiveDate.toISOString().replace('Z', '+00:00')

  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    let expiredNR = { ...nrData }
    expiredNR['expirationDate'] = 'Thu, 31 Dec 2019 23:59:59 GMT'

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data: expiredNR
      })))

    // init store
    store.state.stateModel.currentDate = '2020/01/29'
    store.state.stateModel.nameRequest = {
      entityType: 'BC',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    }
    store.state.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    }
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.defineCompanyStep = { valid: true }
    store.state.stateModel.addPeopleAndRoleStep = { valid: true }
    store.state.stateModel.createShareStructureStep = { valid: true }
    store.state.stateModel.incorporationAgreementStep = { valid: true }
    store.state.stateModel.incorporationDateTime = { valid: true }

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'review-confirm', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Emits the error event for an expired NR', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    await wrapper.vm.onClickFilePay()

    const rootWrapper = createWrapper(wrapper.vm.$root)

    expect(rootWrapper.emitted('name-request-invalid-error')).toEqual([['EXPIRED']])
    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(window.location.assign).not.toHaveBeenCalled()
    expect(wrapper.vm.$route.name).toBe('review-confirm')
  })
})

describe('Actions component - Filing Functionality', () => {
  let wrapper: any
  const { assign } = window.location
  const effectiveDate = new Date(new Date().setDate(new Date().getDate() + 5))
  const formattedEffectiveDate = effectiveDate.toISOString().replace('Z', '+00:00')

  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/business/`)

  // the filing body that would get sent to the API
  const filing = {
    filing: {
      header: {
        name: 'incorporationApplication',
        certifiedBy: 'Certified By',
        date: '2020/01/29',
        effectiveDate: formattedEffectiveDate
      },
      business: {
        identifier: 'T1234567',
        legalType: 'BC'
      },
      incorporationApplication: {
        nameRequest: {
          nrNumber: 'NR 1234567',
          legalType: 'BC',
          legalName: 'My Name Request Inc.'
        },
        offices: {
          registeredOffice: {
            deliveryAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            },
            mailingAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            }
          },
          recordsOffice: {
            deliveryAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            },
            mailingAddress: {
              addressCity: 'someCity',
              addressCountry: 'someCountry',
              addressRegion: 'someRegion',
              postalCode: 'somePostalCode',
              streetAddress: 'someStreet'
            }
          }
        },
        contactPoint: {
          email: 'registered-office@example.com',
          phone: '111-222-3333',
          extension: '444'
        },
        parties: [
          {
            officer: {
              id: 1,
              firstName: 'Joe',
              lastName: 'Swanson',
              middleName: 'P',
              orgName: '',
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
        ],
        incorporationAgreement: {
          agreementType: 'sample'
        }
      }
    }
  }

  beforeEach(() => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any
    const get = sinon.stub(axios, 'get')

    // GET NR data
    get.withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data:
          {
            ...nrData
          }
      })))

    // init store
    store.state.stateModel.currentDate = '2020/01/29'
    store.state.stateModel.nameRequest = {
      entityType: 'BC',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Name Request Inc.' }
    }
    store.state.stateModel.tombstone = {
      keycloakRoles: [],
      authRoles: [],
      userEmail: 'completing-party@example.com'
    }
    store.state.stateModel.certifyState.certifiedBy = filing.filing.header.certifiedBy
    store.state.stateModel.defineCompanyStep.businessContact = {
      email: filing.filing.incorporationApplication.contactPoint.email,
      phone: filing.filing.incorporationApplication.contactPoint.phone,
      extension: filing.filing.incorporationApplication.contactPoint.extension
    }
    store.state.stateModel.incorporationDateTime.effectiveDate = effectiveDate
    store.state.stateModel.defineCompanyStep.businessContact = {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '111-222-3333',
      extension: '444'
    }
    store.state.stateModel.defineCompanyStep.officeAddresses = filing.filing.incorporationApplication.offices
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = filing.filing.incorporationApplication.parties
    store.state.stateModel.createShareStructureStep.shareClasses = filing.filing.incorporationApplication.shareClasses
    store.state.stateModel.filingId = 1234
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.incorporationAgreementStep.agreementType =
      filing.filing.incorporationApplication.incorporationAgreement.agreementType

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })

    // Mock the function calls that may used by saveFiling below
    jest.spyOn(wrapper.vm, 'updateFiling').mockImplementation()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Calls the buildFiling method when onClickSave is called', async () => {
    // Mock the function call
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    // Work-around to interact with the stubbed vuetify button component in ShallowMount
    await wrapper.vm.onClickSave()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('define-company')
  })

  it('Calls the saveFiling method with the correct filing structure when onClickSave is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSave()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, true)
    expect(mockSaveFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('define-company')
  })

  it('Calls the buildFiling method when onClickSaveResume is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Calls the saveFiling method with the correct filing structure when onClickSaveResume is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, true)
    expect(mockSaveFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Calls the buildFiling and saveFiling methods when onClickFilePay is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')
      .mockImplementation(() => Promise.resolve({ header: { paymentToken: 789 } }))

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, false)
    expect(mockSaveFiling).toHaveReturned()

    // verify redirection
    const baseUrl = 'myhost/basePath/auth/makepayment/789/myhost%2Fbusiness%2FT1234567'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Emits "Go To Dashboard" event when onClickCancel is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickCancel()

    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(mockSaveFiling).not.toHaveBeenCalled()

    // verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })
})
