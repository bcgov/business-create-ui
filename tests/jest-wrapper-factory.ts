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
import { IncorporationResources } from '@/resources'

const vuetify = new Vuetify({})
const localVue = createLocalVue()
const router = mockRouter.mock()

Vue.use(Vuetify)
Vue.use(Vuelidate)
localVue.use(VueRouter)

export const shallowWrapperFactory = (component, propsData = null, stateValues = null, routeName = null) => {
  const store = getVuexStore()
  if (routeName) router.push({ name: routeName })

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

export const wrapperFactory = (component, propsData = null, stateValues = null, routeName = null, resource = null) => {
  const store = getVuexStore()
  if (routeName) router.push({ name: routeName })

  if (stateValues) applyStoreValues(store, stateValues, resource)
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

const applyStoreValues = (store, stateValues, resource = IncorporationResources) => {
  // Set Company Resources
  store.state.resourceModel = resource.find(x => x.entityType === stateValues.entityType)

  // Set individual state properties
  const stateKeys = Object.keys(stateValues)
  stateKeys.forEach((key) => {
    store.state.stateModel[key] = stateValues[key]
  })
}
