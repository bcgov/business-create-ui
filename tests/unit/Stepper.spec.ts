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
    expect(wrapper.find('#step-buttons-container').exists()).toBe(true)
  })

  it('renders valid registration components', () => {
    store.state.resourceModel.steps = [
      {
        id: 'step-1-btn',
        step: 1,
        icon: 'mdi-domain',
        text: 'Define Your \nBusiness',
        to: 'registration-define-business',
        component: 'registration-define-business'
      },
      {
        id: 'step-2-btn',
        step: 2,
        icon: 'mdi-account-multiple-plus',
        text: 'Add People \nand Roles',
        to: 'registration-people-roles',
        component: 'registration-people-roles'
      },
      {
        id: 'step-3-btn',
        step: 3,
        icon: 'mdi-text-box-check-outline',
        text: 'Review\nand Confirm',
        to: 'registration-review-confirm',
        component: 'registration-review-confirm'
      }
    ]
    wrapper = shallowMount(Stepper, { store, vuetify, router })
    const indicators = wrapper.findAll('#step-buttons-container .step__indicator')
    expect(indicators.length).toBe(3)

    const icons = wrapper.findAll('#step-buttons-container .step__indicator .step__icon')
    expect(icons.length).toBe(3)
    expect(icons.at(0).text()).toBe('mdi-domain')
    expect(icons.at(1).text()).toBe('mdi-account-multiple-plus')
    expect(icons.at(2).text()).toBe('mdi-text-box-check-outline')

    const labels = wrapper.findAll('#step-buttons-container .step__label')
    expect(labels.length).toBe(3)
    expect(labels.at(0).text()).toBe('Define Your \nBusiness')
    expect(labels.at(1).text()).toBe('Add People \nand Roles')
    expect(labels.at(2).text()).toBe('Review\nand Confirm')
  })

  it('check the status of the method isRegistrationValid', () => {
    // check isRegistrationValid is false given two conditions
    // set either defineBusinessValid or addPeopleAndRoleStep.valid to false
    store.state.stateModel.registration.defineBusinessValid = true
    store.state.stateModel.addPeopleAndRoleStep.valid = false
    store.state.stateModel.entityType = 'SP'
    store.state.stateModel.entityType = 'GP'
    store.state.resourceModel.clickFileAndPay = false
    expect(wrapper.vm.isRegistrationValid()).toBe(false)

    // check isRegistrationValid is true if clickFileAndPay is false
    store.state.stateModel.addPeopleAndRoleStep.valid = true
    expect(wrapper.vm.isRegistrationValid()).toBe(true)

    // check isRegistrationValid is false if isFinalRegistrationValid is false
    store.state.resourceModel.clickFileAndPay = true
    expect(wrapper.vm.isRegistrationValid()).toBe(false)

    // check isRegistrationValid is true if isFinalRegistrationValid is true
    store.state.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Aliprand Saar'
    }
    store.state.stateModel.tombstone.authRoles = ['staff']
    store.state.stateModel.staffPaymentStep.valid = true
    expect(wrapper.vm.isRegistrationValid()).toBe(true)
  })
})
