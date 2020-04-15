// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import mockRouter from './MockRouter'

// Components
import DefineCompany from '@/views/DefineCompany.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

describe('Define Company component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(DefineCompany, { localVue, store, router, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // verify page content
    expect(wrapper.find('h2').text()).toContain('Company Name')
  })

  it('does not display records office in the office address header when entity is a COOP', () => {
    store.state.stateModel.nameRequest.entityType = 'CP'

    expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).not.toContain('Records')
  })

  it('does display records office in the office address header when entity is a BCOMP', async () => {
    store.state.stateModel.nameRequest.entityType = 'BC'

    await Vue.nextTick(() => {
      expect(wrapper.vm.$el.querySelector('#office-address-header').textContent).toContain('Records')
    })
  })
})
