// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { store } from '@/store'
import { shallowMount } from '@vue/test-utils'

// Components
import ReviewConfirm from '@/views/ReviewConfirm.vue'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Review Confirm component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(ReviewConfirm, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})
