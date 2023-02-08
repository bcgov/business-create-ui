import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import RestorationTypeSummary from '@/components/Restoration/RestorationTypeSummary.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// selectors to test changes to the DOM elements
const limited = '.limited-text'
const full = '.full-text'

describe(`Initialize Restoration Type Component`, () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.state.stateModel.restoration = {
      type: 'fullRestoration',
      expiry: null,
      relationships: ['Officer'],
      isRestorationTypeValid: true
    }
    wrapperFactory = () => mount(RestorationTypeSummary, {
      store,
      vuetify
    })
  })

  it('renders the component properly', () => {
    // verify the component is rendered
    const wrapper = wrapperFactory()
    expect(wrapper.find('#restoration-type-summary').exists()).toBe(true)
  })

  it('Show full restoration details when the restoration loaded is full with officer relationship.', async () => {
    const wrapper = wrapperFactory()
    expect(wrapper.find(full).text()).toContain('Applicant\'s relationship: Officer.')
  })

  it('Show limited restoration details when the restoration loaded is limited.', async () => {
    store.state.stateModel.restoration.type = 'limitedRestoration'
    store.state.stateModel.restoration.relationships = []
    store.state.stateModel.restoration.expiry = '2023-12-08'
    const wrapper = wrapperFactory()
    expect(wrapper.find(limited).text()).toContain('Expire on Dec 8, 2023')
  })
})
