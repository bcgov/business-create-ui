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

describe('Review Confirm view', () => {
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

  // TODO: Expand unit testing for validation on step 5. Include routing to appropriate steps from error links.
})
