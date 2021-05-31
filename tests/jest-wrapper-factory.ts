// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './unit/MockRouter'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { CompanyResources } from '@/resources'

const vuetify = new Vuetify({})
const localVue = createLocalVue()
const router = mockRouter.mock()

Vue.use(Vuetify)
Vue.use(Vuelidate)
localVue.use(VueRouter)

export const shallowWrapperFactory = (component, propsData = null, stateValues = null) => {
  const store = getVuexStore()

  if (stateValues) applyStoreValues(store, stateValues)
  return shallowMount(component, {
    propsData: {
      ...propsData
    },
    localVue,
    router,
    store,
    vuetify
  })
}

export const wrapperFactory = (component, propsData = null, stateValues = null) => {
  const store = getVuexStore()

  if (stateValues) applyStoreValues(store, stateValues)
  return mount(component, {
    propsData: {
      ...propsData
    },
    localVue,
    router,
    store,
    vuetify
  })
}

const applyStoreValues = (store, stateValues) => {
  // Set Company Resources
  const companyResources = CompanyResources.find(x => x.entityType === stateValues.entityType)
  store.state.resourceModel = companyResources

  // Set individual state properties
  const stateKeys = Object.keys(stateValues)
  stateKeys.forEach((key) => {
    store.state.stateModel[key] = stateValues[key]
  })
}
