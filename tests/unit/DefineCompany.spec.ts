// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import mockRouter from './MockRouter'

// Components
import DefineCompany from '@/views/DefineCompany.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

describe('Define Company view', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })

    // verify page content
    expect(wrapper.find('h2').text()).toContain('Company Name')

    // ensure there are no saved addresses to interfere with other tests
    const addresses = store.state.stateModel.defineCompanyStep.officeAddresses
    delete addresses.registeredOffice
    delete addresses.recordsOffice

    wrapper.destroy()
  })

  it('doesn\'t display records office in the office address header when entity is a COOP', () => {
    store.state.stateModel.nameRequest.entityType = 'CP'
    const wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })

    expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).not.toContain('Records')

    // verify default addresses
    const addresses = store.state.stateModel.defineCompanyStep.officeAddresses
    expect(addresses.registeredOffice.mailingAddress.addressCountry).toBe('CA')
    expect(addresses.registeredOffice.mailingAddress.addressRegion).toBe('BC')
    expect(addresses.registeredOffice.deliveryAddress.addressCountry).toBe('CA')
    expect(addresses.registeredOffice.deliveryAddress.addressRegion).toBe('BC')
    expect(addresses.recordsOffice).toBeUndefined()

    // ensure there are no saved addresses to interfere with other tests
    delete addresses.registeredOffice
    delete addresses.recordsOffice

    wrapper.destroy()
  })

  it('displays records office in the office address header when entity is a BCOMP', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'
    const wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })

    expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).toContain('Records')

    // verify default addresses
    const addresses = store.state.stateModel.defineCompanyStep.officeAddresses
    expect(addresses.registeredOffice).not.toBeUndefined()
    expect(addresses.recordsOffice.mailingAddress.addressCountry).toBe('CA')
    expect(addresses.recordsOffice.mailingAddress.addressRegion).toBe('BC')
    expect(addresses.recordsOffice.deliveryAddress.addressCountry).toBe('CA')
    expect(addresses.recordsOffice.deliveryAddress.addressRegion).toBe('BC')

    // ensure there are no saved addresses to interfere with other tests
    delete addresses.registeredOffice
    delete addresses.recordsOffice

    wrapper.destroy()
  })

  it('displays folio number when it is a premium account', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'
    sessionStorage.setItem('CURRENT_ACCOUNT', 'PREMIUM')
    const wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })

    expect(wrapper.find('#folio-number-header').exists()).toBe(true)
    expect(wrapper.find('#folio-number-header').text()).toContain('Folio / Reference Number (optional)')

    wrapper.destroy()
  })

  it('doesn\'t display folio number when it is not a premium account', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'
    sessionStorage.removeItem('CURRENT_ACCOUNT')
    const wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })

    expect(wrapper.find('#folio-number-header').exists()).toBe(false)

    wrapper.destroy()
  })
})
