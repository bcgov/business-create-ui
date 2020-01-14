// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Other
import mockRouter from './mockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('App component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.find(SbcHeader).exists()).toBe(true)
    expect(wrapper.find(SbcFooter).exists()).toBe(true)
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
    expect(wrapper.find(Stepper).exists()).toBe(true)
    expect(wrapper.find(Actions).exists()).toBe(true)
  })
})
