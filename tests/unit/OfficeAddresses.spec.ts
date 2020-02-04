// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'

// Store
import { store } from '@/store'

// Utils
import { createLocalVue, shallowMount } from '@vue/test-utils'

// Components
import { OfficeAddresses } from '@/components/DefineCompany'

Vue.use(Vuetify)
Vue.use(Vuelidate)

let vuetify = new Vuetify({})

describe('OfficeAddresses as a COOP', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
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

  it('loads the current office addresses properly from a draft filing', () => {
    // TODO: Test for data when we are retrieving drafts
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
})

describe('OfficeAddresses as a BCOMP', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
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

  it('loads the current office addresses properly from a draft filing', () => {
    // TODO: Test for data when we are retrieving drafts
  })

  it('does not show the summary ui when editing', () => {
    expect(wrapper.vm.$el.querySelector('#summary-registered-address')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#summary-records-address')).toBeNull()
  })

  it('displays the ui for registered mailing and NOT delivery address or Records Office when new filing', () => {
    expect(wrapper.vm.$el.querySelector('#address-registered-mailing')).toBeDefined()
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-delivery')).toBeNull()
  })

  it('displays the ui for registered mailing and NOT delivery address when new filing', () => {
    // Verify no ui for registered delivery address
    expect(wrapper.vm.$el.querySelector('#address-registered-delivery')).toBeNull()
    expect(wrapper.vm.$el.querySelector('#address-records-mailing')).toBeNull()
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
})

describe('OfficeAddresses Summary UI', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(OfficeAddresses, {
      propsData: {
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
