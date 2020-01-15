// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { store } from '@/store'
import { shallowMount } from '@vue/test-utils'

// Components
import DefineCompany from '@/views/DefineCompany.vue'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Define Company component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(DefineCompany, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // verify page content
    expect(wrapper.find('h2').text()).toContain('Company Name')

    // verify initial button state
    expect(wrapper.find('#select-bc-btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#select-cp-btn').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#reset-btn').attributes('disabled')).toBe('true')
  })
})
