// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { store } from '@/store'
import { shallowMount } from '@vue/test-utils'

// Components
import { Stepper } from '@/components/common'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Stepper component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(Stepper, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})
