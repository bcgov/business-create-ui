import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import NaicsHelpText from '@/components/Registration/NaicsHelpText.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('NAICS Help Text component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(
      NaicsHelpText,
      { vuetify }
    )
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#naics-help-text').exists()).toBe(true)
  })

  // *** TODO: add more tests here
})
