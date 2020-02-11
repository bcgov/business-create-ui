// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import mockRouter from './MockRouter'

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

  it('does not display records office in the office address header when entity is a COOP', () => {
    store.state.stateModel.nameRequest.entityType = 'CP'

    expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).not.toContain('Records')
  })

  it('does display records office in the office address header when entity is a BCOMP', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'

    expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).toContain('Records')
  })
})
