// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'

// Components
import { IncorporationDateTime } from '@/components/ReviewConfirm'
import get = Reflect.get;

Vue.use(Vuetify)
Vue.use(Vuelidate)
const vuetify = new Vuetify({})

// Store
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<IncorporationDateTime>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]

  return events[0]
}

describe('Incorporation Date Time component', () => {
  let wrapperFactory: any
  const today = new Date()

  const dateTimeDefault = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  }

  const dateTimeValid = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: new Date(today.setDate(today.getDate() + 5))
  }

  const dateTimeInvalid = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: new Date(today.setDate(today.getDate() + 11))
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

  it('confirms the selector fields are disabled if future effective is NOT selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)

    await radioIsImmediate.trigger('click')

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
    wrapper.vm.dateText = new Date().toISOString().split('T')[0]

    Vue.nextTick(() => {
      expect(wrapper.find('#date-text-field').attributes('disabled')).toBe(undefined)
      expect(wrapper.find('#hour-selector').attributes('disabled')).toBe(undefined)
      expect(wrapper.find('#minute-selector').attributes('disabled')).toBe(undefined)
      expect(wrapper.find('#am-pm-selector').attributes('disabled')).toBe(undefined)
    })
  })

  it('confirms the selector fields are toggled to disabled if Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')
    wrapper.vm.dateText = new Date().toISOString().split('T')[0]

    Vue.nextTick(async () => {
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
  })

  it('emits a valid state when the Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    await radioIsImmediate.trigger('click')

    const validEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is true
    expect(validEvent).toEqual(true)
  })

  it('emits an invalid state when the Future Effective is selected and no date is selected', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // Verify the Valid emit event is true
    expect(wrapper.emitted().valid).toEqual([[false]])
  })

  it('emits a valid state when the Future Effective is selected and DateTime is valid', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeValid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const validEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(validEvent).toEqual(true)
  })

  it('emits a invalid state when the Future Effective is selected and DateTime is invalid', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeInvalid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const invalidEvent = getLastEvent(wrapper, 'valid')

    // Verify the Valid emit event is false at this point
    expect(invalidEvent).toEqual(false)
  })

  it('displays an invalid Date Alert when the Date is invalid', async () => {
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeInvalid })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const minDate = wrapper.vm.toReadableDate(wrapper.vm.minDate)
    const maxDate = wrapper.vm.toReadableDate((wrapper.vm.maxDate))

    Vue.nextTick(() => {
      expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
        .toContain(`Date must be between ${minDate} and ${maxDate}`)

      const invalidEvent = getLastEvent(wrapper, 'valid')

      // Verify the Valid emit event is false at this point
      expect(invalidEvent).toEqual(false)
    })
  })

  it('displays an invalid Time Alert when the time selected is not AT LEAST 2 minutes ahead', async () => {
    dateTimeDefault.effectiveDate = new Date()
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const minTime = wrapper.vm.minTime()

    Vue.nextTick(() => {
      expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
        .toContain(`The time must be at least ${minTime} for the selected date`)

      const invalidEvent = getLastEvent(wrapper, 'valid')

      // Verify the Valid emit event is false at this point
      expect(invalidEvent).toEqual(false)
    })
  })

  it('displays an invalid Time Alert when time selected is past current time on the 10th day', async () => {
    dateTimeDefault.effectiveDate = new Date(today.setDate(today.getDate() + 10))
    const wrapper = wrapperFactory({ incorporationDateTime: dateTimeDefault })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    const maxTime = wrapper.vm.maxTime()

    Vue.nextTick(() => {
      expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
        .toContain(`Time The time can't be greater than ${maxTime} for the selected date`)

      const invalidEvent = getLastEvent(wrapper, 'valid')

      // Verify the Valid emit event is false at this point
      expect(invalidEvent).toEqual(false)
    })
  })
})
