import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import NaicsResult from '@/components/Registration/NaicsResult.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('NAICS Result component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(
      NaicsResult,
      { vuetify, propsData: { result: {} } }
    )
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('.naics-result').exists()).toBe(true)
  })
})
