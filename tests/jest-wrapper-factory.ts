// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueObserveVisibility from 'vue-observe-visibility'

import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './unit/MockRouter'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { IncorporationResources } from '@/resources'
// This polyfill(intersection-observer) was installed as a dev dependency as without it components being tested
// that use the IntersectionObserver API results in warnings that browser does not support this API.
// e.g. IntersectionObserver API is not available in your browser.
//      Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill
import 'intersection-observer'

const vuetify = new Vuetify({})
const localVue = createLocalVue()
const router = mockRouter.mock()

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VueObserveVisibility)
localVue.use(VueRouter)

export const shallowWrapperFactory = (
  component,
  propsData = null,
  stateValues = null,
  routeName = null,
  resource = null
) => {
  const store = getVuexStore()
  if (routeName) router.push({ name: routeName }).catch(() => {})

  if (stateValues) applyStoreValues(store, stateValues, resource)
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

export const wrapperFactory = (
  component,
  propsData = null,
  stateValues = null,
  routeName = null,
  resource = null,
  computed = null
) => {
  const store = getVuexStore()
  if (routeName) router.push({ name: routeName }).catch(() => {})
  if (stateValues) applyStoreValues(store, stateValues, resource)
  return mount(component, {
    propsData: {
      ...propsData
    },
    localVue,
    router,
    store,
    vuetify,
    computed
  })
}

const applyStoreValues = (store, stateValues, resource = null) => {
  resource = resource || IncorporationResources
  // Set Company Resources
  store.state.resourceModel = resource.find(x => x.entityType === stateValues.entityType)

  // Set individual state properties
  const stateKeys = Object.keys(stateValues)
  stateKeys.forEach((key) => {
    store.state.stateModel[key] = stateValues[key]
  })
}
