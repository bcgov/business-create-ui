import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import FeeAcknowledgement from '@/components/Registration/FeeAcknowledgement.vue'

const vuetify = new Vuetify({})
setActivePinia(createPinia())

describe('Stepper component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FeeAcknowledgement, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#fee-acknowledgement').exists()).toBe(true)
  })
})
