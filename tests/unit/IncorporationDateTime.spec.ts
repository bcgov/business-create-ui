// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { IncorporationDateTime } from '@/components/ReviewConfirm'

Vue.use(Vuetify)
Vue.use(Vuelidate)
const vuetify = new Vuetify({})

// Store
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

describe('Incorporation Date Time', () => {
  let wrapperFactory: any

  const dateTimeDefault = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  }

  beforeEach(() => {
    const localVue = createLocalVue()

    wrapperFactory = (propsData) => {
      return mount(IncorporationDateTime, {
        propsData: {
          ...propsData
        },
        localVue,
        store,
        vuetify
      })
    }
  })

  afterEach(async () => {
  })

  it('confirms no default Date Time Selection', () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    // Reference the Radios
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    // Verify radios are false
    expect(radioIsImmediate.attributes('aria-checked')).toBe('false')
    expect(radioIsFutureEffective.attributes('aria-checked')).toBe('false')
  })

  it('confirms the selector fields are disabled if future effective is NOT selected', () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe('disabled')
  })

  it('confirms the selector fields are NOT disabled if future effective is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe(undefined)
  })

  it('confirms the selector fields are toggled to disabled if Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe(undefined)

    await radioIsImmediate.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe('disabled')
  })

  it('emits a valid state when the Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    await radioIsImmediate.trigger('click')

    // Verify the Valid emit event is true
    expect(wrapper.emitted().valid).toEqual([[true]])
  })

  it('emits an invalid state when the Future Effective is selected and no date is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // Verify the Valid emit event is true
    expect(wrapper.emitted().valid).toEqual([[false]])
  })
})
