import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount } from '@vue/test-utils'
import NatureOfBusiness from '@/components/Registration/NatureOfBusiness.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Nature Of Business component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(
      NatureOfBusiness,
      {
        vuetify,
        propsData: {
          showErrors: false
        }
      }
    )
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('natureofbusinessshared-stub').exists()).toBe(true)
  })

  it('has valid local properties', () => {
    const vm = wrapper.vm as any

    expect(vm.showErrors).toBe(false)
    expect(vm.getRegistration).toHaveProperty('naics')
    expect(vm.NaicsServices).toBeInstanceOf(Function)
  })
})
