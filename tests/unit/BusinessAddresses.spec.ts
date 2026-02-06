import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import BusinessAddresses from '@/components/Registration/BusinessAddresses.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import flushPromises from 'flush-promises'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe.skip('Business Address delivery address <same as> is unchecked by default', () => {
  let wrapper: any

  const BUSINESS_ADDRESSES = {
    deliveryAddress: {
      streetAddress: '',
      streetAddressAdditional: '',
      addressCity: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: '',
      deliveryInstructions: ''
    },
    mailingAddress: {
      streetAddress: '',
      streetAddressAdditional: '',
      addressCity: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: '',
      deliveryInstructions: ''
    }
  }

  const CORP_TYPES = [
    CorpTypeCd.SOLE_PROP,
    CorpTypeCd.PARTNERSHIP
  ]

  afterEach(() => {
    wrapper.destroy()
  })

  test.each(CORP_TYPES)('display both mailing and delivery addresses when creating for %s', async (corptype) => {
    const localVue = createLocalVue()
    // pre-set entity type when mounting
    store.stateModel.entityType = corptype

    wrapper = mount(BusinessAddresses, {
      propsData: {
        inputAddresses: { registeredOffice: BUSINESS_ADDRESSES },
        isEditing: true
      },
      localVue,
      vuetify
    })

    expect(wrapper.vm.inheritMailingAddress).toBeFalsy()
    expect(wrapper.find('#address-mailing').exists()).toBeTruthy()
    expect(wrapper.find('#address-delivery').exists()).toBeTruthy()

    // check the 'same as mailing' checkbox (default is unchecked)
    const checkbox = wrapper.find('#same-as-mailing-checkbox')
    checkbox.trigger('click')
    await Vue.nextTick()

    // after clicking the checkbox, the delivery address should be invisible
    expect(wrapper.vm.inheritMailingAddress).toBeTruthy()
    expect(wrapper.find('#address-mailing').exists()).toBeTruthy()
    expect(wrapper.find('#address-delivery').exists()).toBeFalsy()
  })
})

describe.skip('Business Addresses', () => {
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
    wrapper = shallowMount(BusinessAddresses, {
      propsData: {
        inputAddresses: registeredOffice,
        isEditing: true
      },
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.stateModel.entityType = CorpTypeCd.SOLE_PROP
  })

  it('does not show the summary when editing', () => {
    expect(wrapper.vm.$el.querySelector('.summary-section')).toBeNull()
  })

  it('displays the ui for registered mailing and NOT delivery address when new filing', () => {
    expect(wrapper.vm.$el.querySelector('#address-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeNull()
  })

  it('displays the ui for delivery address when the `same as mailing` checkbox is unchecked', () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeNull()

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox = wrapper.find('#same-as-mailing-checkbox')
    checkbox.trigger('click')

    expect(wrapper.vm.$el.querySelector('#address-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeDefined()
  })

  it('loads the current office addresses properly from a draft filing', () => {
    const deliveryAddress = wrapper.vm.addresses.registeredOffice.deliveryAddress
    expect(deliveryAddress.streetAddress).toEqual('someStreet')
    expect(deliveryAddress.addressCity).toEqual('someCity')
    expect(deliveryAddress.addressRegion).toEqual('someRegion')
    expect(deliveryAddress.postalCode).toEqual('somePostalCode')
    expect(deliveryAddress.addressCountry).toEqual('someCountry')

    const mailingAddress = wrapper.vm.addresses.registeredOffice.mailingAddress
    expect(mailingAddress.streetAddress).toEqual('someStreet')
    expect(mailingAddress.addressCity).toEqual('someCity')
    expect(mailingAddress.addressRegion).toEqual('someRegion')
    expect(mailingAddress.postalCode).toEqual('somePostalCode')
    expect(mailingAddress.addressCountry).toEqual('someCountry')
  })
})

describe.skip('same as checkbox resets addresses to default when unchecked - BCOMP', () => {
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

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = mount(BusinessAddresses, {
      propsData: {
        inputAddresses: { registeredOffice },
        isEditing: true
      },
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
  })

  it('should reset registered and records delivery addresses', async () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox1 = wrapper.find('#same-as-mailing-checkbox')
    checkbox1.trigger('click')
    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    const deliveryAddress = wrapper.vm.$data.deliveryAddress
    expect(deliveryAddress.streetAddress).toEqual('')
    expect(deliveryAddress.addressCity).toEqual('')
    expect(deliveryAddress.addressRegion).toEqual('BC')
    expect(deliveryAddress.postalCode).toEqual('')
    expect(deliveryAddress.addressCountry).toEqual('CA')

    const mailingAddress = wrapper.vm.$data.mailingAddress
    expect(mailingAddress.streetAddress).toEqual('someStreet')
    expect(mailingAddress.addressCity).toEqual('someCity')
    expect(mailingAddress.addressRegion).toEqual('someRegion')
    expect(mailingAddress.postalCode).toEqual('somePostalCode')
    expect(mailingAddress.addressCountry).toEqual('someCountry')

    const recMailingAddress = wrapper.vm.$data.recMailingAddress
    expect(recMailingAddress.streetAddress).toEqual('someStreet')
    expect(recMailingAddress.addressCity).toEqual('someCity')
    expect(recMailingAddress.addressRegion).toEqual('someRegion')
    expect(recMailingAddress.postalCode).toEqual('somePostalCode')
    expect(recMailingAddress.addressCountry).toEqual('someCountry')

    const recDeliveryAddress = wrapper.vm.$data.recDeliveryAddress
    expect(recDeliveryAddress.streetAddress).toEqual('')
    expect(recDeliveryAddress.addressCity).toEqual('')
    expect(recDeliveryAddress.addressRegion).toEqual('BC')
    expect(recDeliveryAddress.postalCode).toEqual('')
    expect(recDeliveryAddress.addressCountry).toEqual('CA')
  })

  it('should reset records delivery and mailing addresses', async () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    // un-Check the 'Same as Registered Office' checkbox ( Default is checked )
    const checkbox1 = wrapper.find('#records-mailing-same-chkbx')
    checkbox1.trigger('click')
    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('#address-delivery')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    const deliveryAddress = wrapper.vm.$data.deliveryAddress
    expect(deliveryAddress.streetAddress).toEqual('someStreet')
    expect(deliveryAddress.addressCity).toEqual('someCity')
    expect(deliveryAddress.addressRegion).toEqual('someRegion')
    expect(deliveryAddress.postalCode).toEqual('somePostalCode')
    expect(deliveryAddress.addressCountry).toEqual('someCountry')

    const mailingAddress = wrapper.vm.$data.mailingAddress
    expect(mailingAddress.streetAddress).toEqual('someStreet')
    expect(mailingAddress.addressCity).toEqual('someCity')
    expect(mailingAddress.addressRegion).toEqual('someRegion')
    expect(mailingAddress.postalCode).toEqual('somePostalCode')
    expect(mailingAddress.addressCountry).toEqual('someCountry')

    const recMailingAddress = wrapper.vm.$data.recMailingAddress
    expect(recMailingAddress.streetAddress).toEqual('')
    expect(recMailingAddress.addressCity).toEqual('')
    expect(recMailingAddress.addressRegion).toEqual('BC')
    expect(recMailingAddress.postalCode).toEqual('')
    expect(recMailingAddress.addressCountry).toEqual('CA')

    const recDeliveryAddress = wrapper.vm.$data.recDeliveryAddress
    expect(recDeliveryAddress.streetAddress).toEqual('')
    expect(recDeliveryAddress.addressCity).toEqual('')
    expect(recDeliveryAddress.addressRegion).toEqual('BC')
    expect(recDeliveryAddress.postalCode).toEqual('')
    expect(recDeliveryAddress.addressCountry).toEqual('CA')
  })
})

describe('should properly emit valid', () => {
  let wrapper: any
  const localVue = createLocalVue()

  const invalidDeliveryAddress = {
    addressCity: 'someCity',
    addressCountry: 'someCountry',
    addressRegion: 'someRegion',
    postalCode: 'somePostalCode',
    streetAddress: 'someStreet'
  }

  const invalidMailingAddress = {
    addressCity: 'someCity',
    addressCountry: 'someCountry',
    addressRegion: 'someRegion',
    postalCode: 'somePostalCode',
    streetAddress: 'someStreet'
  }

  const validDeliveryAddress = {
    addressCity: 'someCity1',
    addressCountry: 'CA',
    addressRegion: 'BC',
    postalCode: 'V8V 8V8',
    streetAddress: 'someStreet'
  }

  const validMailingAddress = {
    addressCity: 'someCity2',
    addressCountry: 'CA',
    addressRegion: 'BC',
    postalCode: 'V8V 8V8',
    streetAddress: 'someStreet'
  }

  beforeAll(() => {
    // init store
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('should emit valid when all addresses are valid', async () => {
    // init store
    store.stateModel.registration.businessAddress = {
      deliveryAddress: validDeliveryAddress,
      mailingAddress: validMailingAddress
    }
    wrapper = mount(BusinessAddresses, {
      propsData: {
        isEditing: true,
        showErrors: true
      },
      localVue,
      vuetify
    })
    // wait for all components to update
    await flushPromises()

    expect(wrapper.emitted('valid').pop()).toEqual([true])
  })

  it('should emit invalid when registered delivery address is invalid', async () => {
    // init store
    store.stateModel.registration.businessAddress = {
      deliveryAddress: invalidDeliveryAddress,
      mailingAddress: validMailingAddress
    }
    wrapper = mount(BusinessAddresses, {
      propsData: {
        isEditing: true,
        showErrors: true
      },
      localVue,
      vuetify
    })
    // wait for all components to update
    await flushPromises()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
  })

  it('should emit invalid when registered mailing address is invalid', async () => {
    // init store
    store.stateModel.registration.businessAddress = {
      deliveryAddress: validDeliveryAddress,
      mailingAddress: invalidMailingAddress
    }
    wrapper = mount(BusinessAddresses, {
      propsData: {
        isEditing: true,
        showErrors: true
      },
      localVue,
      vuetify
    })
    // wait for all components to update
    await flushPromises()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
  })
})

describe('Business Addresses - Summary', () => {
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

  beforeAll(() => {
    // init store
    store.stateModel.nameRequest.legalType = CorpTypeCd.BENEFIT_COMPANY
  })

  beforeEach(() => {
    const localVue = createLocalVue()
    // init store
    store.stateModel.registration.businessAddress = registeredOffice
    wrapper = mount(BusinessAddresses, {
      propsData: {
        isEditing: false,
        showErrors: true
      },
      localVue,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the summary ui when in summary mode', () => {
    expect(wrapper.vm.$el.querySelector('.summary-section')).toBeDefined()
  })
})
