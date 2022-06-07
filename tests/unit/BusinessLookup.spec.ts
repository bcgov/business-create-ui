import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import BusinessLookup from '@/components/Registration/BusinessLookup.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('Business Lookup component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(
      BusinessLookup,
      {
        vuetify,
        propsData: {
          showErrors: false,
          businessLookup: {},
          BusinessLookupServices: {}
        }
      }
    )
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#business-lookup').exists()).toBe(true)
  })

  // it('renders the undo action when prompted', async () => {
  //   wrapper.vm.state = 'summary'
  //   wrapper.setProps({ hasBusinessLookupChanges: true })
  //   await Vue.nextTick()

  //   expect(wrapper.find('#bl-undo-btn').exists()).toBe(true)
  // })
})
