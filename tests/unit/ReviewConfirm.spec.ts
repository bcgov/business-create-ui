// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import ReviewConfirm from '@/views/ReviewConfirm.vue'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = mockRouter.mock()

describe('Review Confirm view', () => {
  let wrapper: any

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // init store
    store.state.entityType = 'BC'

    wrapper = shallowMount(ReviewConfirm, { localVue, store, router, vuetify })

    // verify page content
    expect(wrapper.find('h2').text()).toContain('Review')
  })

  it('displays benefit company statement when it is a BC', () => {
    store.state.stateModel.entityType = 'BC'
    const wrapper = shallowMount(ReviewConfirm, { localVue, store, router, vuetify })

    expect(wrapper.find('.benefit-company-statement').exists()).toBe(true)

    wrapper.destroy()
  })

  it('doesn\'t display benefit company statement when it is not a BC', () => {
    store.state.stateModel.entityType = 'CP'
    const wrapper = shallowMount(ReviewConfirm, { localVue, store, router, vuetify })

    expect(wrapper.find('.benefit-company-statement').exists()).toBe(false)

    wrapper.destroy()
  })

  // TODO: Expand unit testing for validation on step 5. Include routing to appropriate steps from error links.
})
