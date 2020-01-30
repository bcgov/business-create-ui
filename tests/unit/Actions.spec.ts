// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import { Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Actions component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(Actions, { localVue, store, router, vuetify })
  })

  it('Disables File and Pay button when certify from is not valid', () => {
    // verify File and Pay button state
    store.state.stateModel.certifyState = {
      certifyFormValid: false,
      certifiedBy: 'Some Certifier'
    }
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBe('true')
  })

  it('Enables File and Pay button when certify from is valid', () => {
    store.state.stateModel.certifyState = {
      certifyFormValid: true,
      certifiedBy: 'Some certifier'
    }
    store.state.stateModel.nameRequest = { entityType: 'BC' }
    store.state.stateModel.defineCompanyStep = {
      valid: true
    }
    // verify File and Pay button state
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBeUndefined()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})
