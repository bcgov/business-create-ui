// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import ReviewConfirm from '@/views/ReviewConfirm.vue'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Review Confirm component', () => {
  let wrapper: any
  let vm: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(ReviewConfirm, { localVue, store, router, vuetify })
    vm = wrapper.vm as any
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // init store
    store.state.entityType = 'BC'

    // verify page content
    expect(wrapper.find('h2').text()).toContain('Review')
  })

  it('routes back to step 1 when Entity Type isn\'t set', () => {
    expect(vm.$route.name).toBe('define-company')
  })
})
