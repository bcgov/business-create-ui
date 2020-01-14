// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import { Actions } from '@/components/common'

// Other
import mockRouter from './mockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Actions component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    // router.push({ name: 'dashboard', query: { filing_id: '123' } }) // example for future
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})
