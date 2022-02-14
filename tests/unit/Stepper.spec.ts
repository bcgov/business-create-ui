import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import Stepper from '@/components/common/Stepper.vue'

Vue.use(Vuetify)
Vue.use(VueRouter)
const router = new VueRouter()

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Stepper component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(Stepper, { store, vuetify, router })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    // FUTURE
  })
})
