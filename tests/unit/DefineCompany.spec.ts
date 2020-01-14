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
    // FUTURE
  })
})
