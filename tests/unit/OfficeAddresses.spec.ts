// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'

// Components
import { OfficeAddresses } from '@/components/DefineCompany'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Office Address delivery address <same as> is unchecked by default', () => {
  let wrapper: any

  const registeredOffice = {
    registeredOffice: {
      deliveryAddress: {
        addressCity: '',
        addressCountry: '',
        addressRegion: '',
        postalCode: '',
        streetAddress: ''
      },
      mailingAddress: {
        addressCity: '',
        addressCountry: '',
        addressRegion: '',
        postalCode: '',
        streetAddress: ''
      }
    }
  }

  // the commented corp types are not available to test currently
  const corpTypes = [
    CorpTypeCd.COOP,
    CorpTypeCd.BENEFIT_COMPANY
    // CorpTypeCd.BC_CCC,
    // CorpTypeCd.BC_COMPANY,
    // CorpTypeCd.BC_ULC_COMPANY
  ]

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = mount(OfficeAddresses, {
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

  test.each(corpTypes)('display both mailing and delivery addresses when creating for %p', async (corptype) => {
    store.state.stateModel.entityType = corptype
    expect(wrapper.find('#address-registered-mailing').exists()).toBeTruthy()
    expect(wrapper.find('#address-registered-delivery').exists()).toBeTruthy()

    // check the 'same as mailing' checkbox ( Default is unchecked )
    const checkbox = wrapper.find('#registered-mailing-same-chkbx')
    checkbox.trigger('click')
    await Vue.nextTick()

    // after clicking the checkbox, the delivery address should be invisible
    expect(wrapper.vm.inheritMailingAddress).toBeTruthy()
    expect(wrapper.find('#address-registered-mailing').exists()).toBeTruthy()
    expect(wrapper.find('#address-registered-delivery').exists()).toBeFalsy()
  })
})

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
    store.state.stateModel.entityType = 'CP'
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
    store.state.stateModel.entityType = 'BEN'
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

describe('same as checkboxes reset addresses to default when unchecked - BCOMP', () => {
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
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: { registeredOffice, recordsOffice: registeredOffice },
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
    store.state.stateModel.entityType = 'BEN'
  })

  it('should reset registered and records delivery addresses', async () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    // un-Check the 'same as mailing' checkbox ( Default is checked )
    const checkbox1 = wrapper.find('#registered-mailing-same-chkbx')
    checkbox1.trigger('click')
    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    const deliveryAddress = wrapper.vm.$data.deliveryAddress
    expect(deliveryAddress['streetAddress']).toEqual('')
    expect(deliveryAddress['addressCity']).toEqual('')
    expect(deliveryAddress['addressRegion']).toEqual('BC')
    expect(deliveryAddress['postalCode']).toEqual('')
    expect(deliveryAddress['addressCountry']).toEqual('CA')

    const mailingAddress = wrapper.vm.$data.mailingAddress
    expect(mailingAddress['streetAddress']).toEqual('someStreet')
    expect(mailingAddress['addressCity']).toEqual('someCity')
    expect(mailingAddress['addressRegion']).toEqual('someRegion')
    expect(mailingAddress['postalCode']).toEqual('somePostalCode')
    expect(mailingAddress['addressCountry']).toEqual('someCountry')

    const recMailingAddress = wrapper.vm.$data.recMailingAddress
    expect(recMailingAddress['streetAddress']).toEqual('someStreet')
    expect(recMailingAddress['addressCity']).toEqual('someCity')
    expect(recMailingAddress['addressRegion']).toEqual('someRegion')
    expect(recMailingAddress['postalCode']).toEqual('somePostalCode')
    expect(recMailingAddress['addressCountry']).toEqual('someCountry')

    const recDeliveryAddress = wrapper.vm.$data.recDeliveryAddress
    expect(recDeliveryAddress['streetAddress']).toEqual('')
    expect(recDeliveryAddress['addressCity']).toEqual('')
    expect(recDeliveryAddress['addressRegion']).toEqual('BC')
    expect(recDeliveryAddress['postalCode']).toEqual('')
    expect(recDeliveryAddress['addressCountry']).toEqual('CA')
  })

  it('should reset records delivery and mailing addresses', async () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    // un-Check the 'Same as Registered Office' checkbox ( Default is checked )
    const checkbox1 = wrapper.find('#records-mailing-same-chkbx')
    checkbox1.trigger('click')
    await Vue.nextTick()

    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()

    const deliveryAddress = wrapper.vm.$data.deliveryAddress
    expect(deliveryAddress['streetAddress']).toEqual('someStreet')
    expect(deliveryAddress['addressCity']).toEqual('someCity')
    expect(deliveryAddress['addressRegion']).toEqual('someRegion')
    expect(deliveryAddress['postalCode']).toEqual('somePostalCode')
    expect(deliveryAddress['addressCountry']).toEqual('someCountry')

    const mailingAddress = wrapper.vm.$data.mailingAddress
    expect(mailingAddress['streetAddress']).toEqual('someStreet')
    expect(mailingAddress['addressCity']).toEqual('someCity')
    expect(mailingAddress['addressRegion']).toEqual('someRegion')
    expect(mailingAddress['postalCode']).toEqual('somePostalCode')
    expect(mailingAddress['addressCountry']).toEqual('someCountry')

    const recMailingAddress = wrapper.vm.$data.recMailingAddress
    expect(recMailingAddress['streetAddress']).toEqual('')
    expect(recMailingAddress['addressCity']).toEqual('')
    expect(recMailingAddress['addressRegion']).toEqual('BC')
    expect(recMailingAddress['postalCode']).toEqual('')
    expect(recMailingAddress['addressCountry']).toEqual('CA')

    const recDeliveryAddress = wrapper.vm.$data.recDeliveryAddress
    expect(recDeliveryAddress['streetAddress']).toEqual('')
    expect(recDeliveryAddress['addressCity']).toEqual('')
    expect(recDeliveryAddress['addressRegion']).toEqual('BC')
    expect(recDeliveryAddress['postalCode']).toEqual('')
    expect(recDeliveryAddress['addressCountry']).toEqual('CA')
  })
})

describe('should properly emit valid - BCOMP', () => {
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
    postalCode: 'somePostalCode',
    streetAddress: 'someStreet'
  }

  const validMailingAddress = {
    addressCity: 'someCity2',
    addressCountry: 'CA',
    addressRegion: 'BC',
    postalCode: 'somePostalCode',
    streetAddress: 'someStreet'
  }

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
    store.state.stateModel.entityType = 'BEN'
  })

  it('should emit valid form', async () => {
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: {
          registeredOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress },
          recordsOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress }
        },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
    await Vue.nextTick()

    expect(wrapper.emitted('valid').pop()).toEqual([true])
  })

  it('should emit invalid with invalid registered delivery address', async () => {
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: {
          registeredOffice: { deliveryAddress: invalidDeliveryAddress, mailingAddress: validMailingAddress },
          recordsOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress }
        },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
    await Vue.nextTick()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
  })

  it('should emit invalid with invalid registered mailing address', async () => {
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: {
          registeredOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: invalidMailingAddress },
          recordsOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress }
        },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
    await Vue.nextTick()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
  })

  it('should emit invalid with invalid records delivery address', async () => {
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: {
          registeredOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress },
          recordsOffice: { deliveryAddress: invalidDeliveryAddress, mailingAddress: validMailingAddress }
        },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
    await Vue.nextTick()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
  })

  it('should emit invalid with invalid records mailing address', async () => {
    wrapper = mount(OfficeAddresses, {
      propsData: {
        inputAddresses: {
          registeredOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: validMailingAddress },
          recordsOffice: { deliveryAddress: validDeliveryAddress, mailingAddress: invalidMailingAddress }
        },
        isEditing: true
      },
      localVue,
      store,
      vuetify
    })
    await Vue.nextTick()

    expect(wrapper.emitted('valid').pop()).toEqual([false])
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
    store.state.stateModel.nameRequest.entityType = 'BEN'
  })

  it('displays the summary ui when in summary mode', () => {
    expect(wrapper.vm.$el.querySelector('#summary-registered-address')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#summary-records-address')).toBeDefined()
  })
})
