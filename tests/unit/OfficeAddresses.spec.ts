// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, shallowMount } from '@vue/test-utils'

// Components
import { OfficeAddresses } from '@/components/DefineCompany'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Office Addresses component - COOP', () => {
  let wrapper: any

  const registeredOffice = {
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
    }
  }

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
        inputAddresses: registeredOffice,
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.state.stateModel.nameRequest.entityType = 'CP'
  })

  it('does not show the summary ui when editing', () => {
    expect(wrapper.vm.$el.querySelector('#summary-registered-address')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#summary-records-address')).toBeNull()
  })

  it('displays the ui for registered mailing and NOT delivery address when new filing', () => {
    expect(wrapper.vm.$el.querySelector('#address-registered-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
  })

  it('displays the ui for delivery address when the `same as mailing` checkbox is unchecked', () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox = wrapper.find('#registered-mailing-same-chkbx')
    checkbox.trigger('click')

    expect(wrapper.vm.$el.querySelector('#address-registered-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeDefined()
  })

  it('loads the current office addresses properly from a draft filing', () => {
    const deliveryAddress = wrapper.vm.addresses.registeredOffice.deliveryAddress
    expect(deliveryAddress['streetAddress']).toEqual('someStreet')
    expect(deliveryAddress['addressCity']).toEqual('someCity')
    expect(deliveryAddress['addressRegion']).toEqual('someRegion')
    expect(deliveryAddress['postalCode']).toEqual('somePostalCode')
    expect(deliveryAddress['addressCountry']).toEqual('someCountry')

    const mailingAddress = wrapper.vm.addresses.registeredOffice.mailingAddress
    expect(mailingAddress['streetAddress']).toEqual('someStreet')
    expect(mailingAddress['addressCity']).toEqual('someCity')
    expect(mailingAddress['addressRegion']).toEqual('someRegion')
    expect(mailingAddress['postalCode']).toEqual('somePostalCode')
    expect(mailingAddress['addressCountry']).toEqual('someCountry')
  })
})

describe('Office Addresses component - BCOMP', () => {
  let wrapper: any

  const registeredOffice = {
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

  const recordsOffice = {
    deliveryAddress: {
      addressCity: 'someRecCity',
      addressCountry: 'someRecCountry',
      addressRegion: 'someRecRegion',
      postalCode: 'someRecPostalCode',
      streetAddress: 'someRecStreet'
    },
    mailingAddress: {
      addressCity: 'someRecCity',
      addressCountry: 'someRecCountry',
      addressRegion: 'someRecRegion',
      postalCode: 'someRecPostalCode',
      streetAddress: 'someRecStreet'
    }
  }

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
        inputAddresses: { registeredOffice, recordsOffice },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.state.stateModel.nameRequest.entityType = 'BC'
  })

  it('does not show the summary ui when editing', () => {
    expect(wrapper.vm.$el.querySelector('#summary-registered-address')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#summary-records-address')).toBeNull()
  })

  it('displays the ui for mailing and NOT delivery address for Records & Registered Office when new filing', () => {
    expect(wrapper.vm.$el.querySelector('#address-registered-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()
  })

  it('displays the ui for registered mailing and NOT delivery address when new filing', () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox1 = wrapper.find('#registered-mailing-same-chkbx')
    checkbox1.trigger('click')

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox2 = wrapper.find('#records-mailing-same-chkbx')
    checkbox2.trigger('click')

    expect(wrapper.vm.$el.querySelector('#address-registered-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeDefined()
  })

  it('loads the current office addresses properly from a draft filing', () => {
    const deliveryAddress = wrapper.vm.addresses.registeredOffice.deliveryAddress
    expect(deliveryAddress['streetAddress']).toEqual('someStreet')
    expect(deliveryAddress['addressCity']).toEqual('someCity')
    expect(deliveryAddress['addressRegion']).toEqual('someRegion')
    expect(deliveryAddress['postalCode']).toEqual('somePostalCode')
    expect(deliveryAddress['addressCountry']).toEqual('someCountry')

    const mailingAddress = wrapper.vm.addresses.registeredOffice.mailingAddress
    expect(mailingAddress['streetAddress']).toEqual('someStreet')
    expect(mailingAddress['addressCity']).toEqual('someCity')
    expect(mailingAddress['addressRegion']).toEqual('someRegion')
    expect(mailingAddress['postalCode']).toEqual('somePostalCode')
    expect(mailingAddress['addressCountry']).toEqual('someCountry')

    const recDeliveryAddress = wrapper.vm.addresses.recordsOffice.deliveryAddress
    expect(recDeliveryAddress['streetAddress']).toEqual('someRecStreet')
    expect(recDeliveryAddress['addressCity']).toEqual('someRecCity')
    expect(recDeliveryAddress['addressRegion']).toEqual('someRecRegion')
    expect(recDeliveryAddress['postalCode']).toEqual('someRecPostalCode')
    expect(recDeliveryAddress['addressCountry']).toEqual('someRecCountry')

    const recMailingAddress = wrapper.vm.addresses.recordsOffice.mailingAddress
    expect(recMailingAddress['streetAddress']).toEqual('someRecStreet')
    expect(recMailingAddress['addressCity']).toEqual('someRecCity')
    expect(recMailingAddress['addressRegion']).toEqual('someRecRegion')
    expect(recMailingAddress['postalCode']).toEqual('someRecPostalCode')
    expect(recMailingAddress['addressCountry']).toEqual('someRecCountry')
  })
})

describe('Office Addresses component - Summary UI', () => {
  let wrapper: any

  const registeredOffice = {
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

  const recordsOffice = {
    deliveryAddress: {
      addressCity: 'someRecCity',
      addressCountry: 'someRecCountry',
      addressRegion: 'someRecRegion',
      postalCode: 'someRecPostalCode',
      streetAddress: 'someRecStreet'
    },
    mailingAddress: {
      addressCity: 'someRecCity',
      addressCountry: 'someRecCountry',
      addressRegion: 'someRecRegion',
      postalCode: 'someRecPostalCode',
      streetAddress: 'someRecStreet'
    }
  }

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
        inputAddresses: { registeredOffice, recordsOffice },
        isEditing: false
      },
      localVue,
      store,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.state.stateModel.nameRequest.entityType = 'BC'
  })

  it('displays the summary ui when in summary mode', () => {
    expect(wrapper.vm.$el.querySelector('#summary-registered-address')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#summary-records-address')).toBeDefined()
  })
})
