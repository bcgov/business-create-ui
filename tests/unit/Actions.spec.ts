// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import { Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

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
      certifyFormValid: false,
      certifiedBy: 'Some Certifier'
    }
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBe('true')
  })

  it('Enables File and Pay button when certify from is valid', () => {
    store.state.stateModel.certifyState = {
      certifyFormValid: true,
      certifiedBy: 'Some certifier'
    }
    store.state.stateModel.nameRequest = { entityType: 'BC' }
    store.state.stateModel.defineCompanyStep = {
      valid: true
    }
    store.state.stateModel.addPeopleAndRoleStep = {
      valid: true
    }
    // verify File and Pay button state
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBeUndefined()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})

describe('Actions Filing Functionality', () => {
  let wrapper: any
  const { assign } = window.location
  sessionStorage.setItem('AUTH_URL', `myhost/basePath/auth/`)

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
        }
      }
    }
  }

  beforeEach(() => {
    delete window.location
    window.location = { assign: jest.fn() } as any

    store.state.stateModel.nameRequest = { entityType: 'BC', nrNumber: 'NR1234567' }
    store.state.stateModel.certifyState.certifiedBy = 'somePerson'
    store.state.stateModel.defineCompanyStep.businessContact = { email: 'someEmail', phone: '123-456-7890' }
    store.state.stateModel.currentDate = '2020/01/29'
    store.state.stateModel.defineCompanyStep.officeAddresses = filing.filing.incorporationApplication.offices

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
    jest.spyOn(wrapper.vm, 'createFiling').mockImplementation()
  })

  afterEach(() => {
    window.location.assign = assign
    wrapper.destroy()
  })

  it('Calls the buildFiling method when clickSave is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    // Mock the function call
    // Work around to interact with the stubbed vuetify button component in ShallowMount
    await wrapper.vm.onClickSave()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })

  it('Calls the saveFiling method when clickSave is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSave()

    expect(mockSaveFiling).toHaveBeenCalled()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })

  it('Calls the saveFiling method when clickSave is called with the correct filing structure', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSave()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, true)

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })

  it('Calls the buildFiling method when clickSaveResume is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify redirection
    // TODO: To update when dashboard URLs are established
    const baseUrl = 'myhost/basePath/auth/'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Calls the saveFiling method when clickSaveResume is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockSaveFiling).toHaveBeenCalled()

    // verify redirection
    // TODO: To update when dashboard URLs are established
    const baseUrl = 'myhost/basePath/auth/'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Calls the saveFiling method when clickSaveResume is called with the correct filing structure', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, true)

    // verify redirection
    // TODO: To update when dashboard URLs are established
    const baseUrl = 'myhost/basePath/auth/'

    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Calls the buildFiling method when onClickFilePay is called', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })

  it('Calls the completeFiling method when onClickFilePay is called', async () => {
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickFilePay()

    expect(mockSaveFiling).toHaveBeenCalled()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })

  it('Calls the completeFiling method when onClickFilePay is called with the correct filing structure', async () => {
    const mockBuildFiling = jest.spyOn(wrapper.vm, 'buildFiling')
    const mockSaveFiling = jest.spyOn(wrapper.vm, 'saveFiling')

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockSaveFiling).toHaveBeenCalledWith(filing, false)

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBeNull()
  })
})
