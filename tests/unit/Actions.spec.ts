// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import { Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

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
    store.state.stateModel.nameRequest = { entityType: 'BC' }
    store.state.stateModel.defineCompanyStep = {
      valid: true
    }
    store.state.stateModel.addPeopleAndRoleStep = {
      valid: true
    }
    await Vue.nextTick(() => {
      // verify File and Pay button state
      expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBeUndefined()
    })
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})

describe('Actions Filing Functionality', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)
  sessionStorage.setItem('DASHBOARD_URL', `myhost/cooperatives/`)

  const filing = {
    filing: {
      header: {
        name: 'incorporationApplication',
        certifiedBy: 'somePerson',
        email: 'someEmail',
        date: '2020/01/29'
      },
      incorporationApplication: {
        nameRequest: {
          nrNumber: 'NR1234567',
          legalType: 'BC'
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
          email: 'someEmail',
          phone: '123-456-7890'
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
  }

  beforeEach(() => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.nameRequest = { entityType: 'BC', nrNumber: 'NR1234567' }
    store.state.stateModel.certifyState.certifiedBy = 'somePerson'
    store.state.stateModel.defineCompanyStep.businessContact = { email: 'someEmail', phone: '123-456-7890' }
    store.state.stateModel.currentDate = '2020/01/29'
    store.state.stateModel.defineCompanyStep.officeAddresses = filing.filing.incorporationApplication.offices
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = filing.filing.incorporationApplication.parties
    store.state.stateModel.createShareStructureStep.shareClasses = filing.filing.incorporationApplication.shareClasses

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'define-company', query: { nrNumber: 'NR 1234567' } })
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
    jest.spyOn(wrapper.vm, 'createFiling').mockImplementation()
  })

  afterEach(() => {
    window.location.assign = assign
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

  it('Calls the buildFiling method when onClickFilePay is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')
      .mockImplementation(() => Promise.resolve({ header: { paymentToken: 789 } })) // required for save

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify redirection
    const baseUrl = 'myhost/basePath/auth/makepayment/789/myhost%2Fcooperatives%2FNR%201234567'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Calls the saveFiling method with the correct filing structure when onClickFilePay is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')
      .mockImplementation(() => Promise.resolve({ header: { paymentToken: 789 } }))

    await wrapper.vm.onClickFilePay()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, false)
    expect(mockSaveFiling).toHaveReturned()

    // verify redirection
    const baseUrl = 'myhost/basePath/auth/makepayment/789/myhost%2Fcooperatives%2FNR%201234567'

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
