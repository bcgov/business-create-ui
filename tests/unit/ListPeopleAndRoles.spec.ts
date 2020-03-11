// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'

// Store
import { store } from '@/store'

// Utils
import { createLocalVue, shallowMount } from '@vue/test-utils'

// Components
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'

Vue.use(Vuetify)
Vue.use(Vuelidate)

let vuetify = new Vuetify({})

describe('List People And Roles', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    wrapper = shallowMount(ListPeopleAndRoles, {
      propsData: {},
      localVue,
      store,
      vuetify
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  beforeAll(() => {
    // init store
  })

  it('does not show the peoples / roles list if there is no data to display', () => {
    expect(wrapper.vm.$el.querySelector('#people-roles-lists')).toBeNull()
  })
})
