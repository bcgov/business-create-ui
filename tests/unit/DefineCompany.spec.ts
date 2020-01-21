// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import mockRouter from './mockRouter'

// Components
import DefineCompany from '@/views/DefineCompany.vue'

Vue.use(Vuetify)
let vuetify = new Vuetify({})
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

describe('Define Company component', () => {
  let wrapper: any

  beforeEach(() => {
    router.push({ name: 'define-company', query: {} })
    wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })
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
