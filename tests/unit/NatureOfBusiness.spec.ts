import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import NatureOfBusiness from '@/components/Registration/NatureOfBusiness.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Nature Of Business component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(
      NatureOfBusiness,
      { store, vuetify, propsData: { showErrors: false } }
    )
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#nature-of-business').exists()).toBe(true)
  })

  // *** TODO: add more tests here
})
