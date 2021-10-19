import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { EffectiveDateTime } from '@/components/common'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

// Store
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<EffectiveDateTime>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  if (eventsList) {
    const events: Array<any> = eventsList[eventsList.length - 1]
    return events[0]
  }
  return null
}

describe('Effective Date Time component', () => {
  let wrapperFactory: any
  const today = new Date()

  // invalid future effective date is more than 10 days from now
  const futureInvalidDate = new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000)

  const dateTimeDefault = {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  }

  const dateTimeValid = {
    valid: false,
    isFutureEffective: true,
    // effective date is 5 days from now
    effectiveDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
  }

  const dateTimeUnder = {
    valid: false,
    isFutureEffective: true,
    // effective date is less than 3 minutes from now
    effectiveDate: new Date(today.getTime()).toISOString()
  }

  const dateTimeOver = {
    valid: false,
    isFutureEffective: true,
    effectiveDate: futureInvalidDate.toISOString()
  }

  beforeAll(() => {
    // init store
    store.state.stateModel.currentJsDate = today
  })

  beforeEach(() => {
    const localVue = createLocalVue()

    wrapperFactory = (propsData) => {
      return mount(EffectiveDateTime, {
        propsData: { ...propsData },
        localVue,
        store,
        vuetify
      })
    }
  })

  afterEach(async () => {
  })

  it('confirms no default Date-Time Selection', () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    // Reference the Radios
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    // Verify radios are false
    expect(radioIsImmediate.attributes('aria-checked')).toBe('false')
    expect(radioIsFutureEffective.attributes('aria-checked')).toBe('false')
  })

  it('confirms the selector fields are disabled if future effective is NOT selected', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)

    await radioIsImmediate.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#period-selector').attributes('disabled')).toBe('disabled')
  })

  it('confirms the selector fields are NOT disabled if future effective is selected', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')
    await Vue.nextTick()

    expect(wrapper.vm.dateText).toBe('') // No need to have a selected date
    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#period-selector').attributes('disabled')).toBeUndefined()
  })

  it('confirms the selector fields are toggled to disabled if Immediate Filing is selected', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    const radioIsFutureEffective = radioInput.at(1)

    await radioIsFutureEffective.trigger('click')

    await Vue.nextTick()

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('#period-selector').attributes('disabled')).toBeUndefined()

    await radioIsImmediate.trigger('click')

    expect(wrapper.find('#date-text-field').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#hour-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#minute-selector').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('#period-selector').attributes('disabled')).toBe('disabled')

    expect(wrapper.find('#date-text-field').text()).toBe('')
  })

  it('emits a valid state when Immediate is selected', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    // select Immediate
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsImmediate = radioInput.at(0)
    await radioIsImmediate.trigger('click')
    await flushPromises()

    // Verify the last Valid event is true
    expect(getLastEvent(wrapper, 'valid')).toEqual(true)
  })

  it('emits an invalid state when Future Effective is selected and no date is entered', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set everything except date
    wrapper.vm.$refs.hourSelector.setValue((today.getHours() % 12).toString())
    wrapper.vm.$refs.minuteSelector.setValue(today.getMinutes().toString())
    await wrapper.find('#period-selector').setValue(today.getHours() >= 12 ? 'pm' : 'am')

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is false
    // Note that it is important to test 'event === false' to check it is not 0 (zero) or other falsy evaluation
    expect(getLastEvent(wrapper, 'valid') === false).toBeTruthy()
  })

  it('emits a invalid state when Future Effective is selected and no hour is entered', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: true
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set everything except hour
    await wrapper.find('#date-text-field').setValue(wrapper.vm.dateToYyyyMmDd(today))
    wrapper.vm.$refs.minuteSelector.setValue(today.getMinutes().toString())
    await wrapper.find('#period-selector').setValue(today.getHours() >= 12 ? 'pm' : 'am')

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is false
    // Note that it is important to test 'event === false' to check it is not 0 (zero) or other falsy evaluation
    expect(getLastEvent(wrapper, 'valid') === false).toBeTruthy()
  })

  it('emits a invalid state when Future Effective is selected and no minute is entered', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set everything except minute
    await wrapper.find('#date-text-field').setValue(wrapper.vm.dateToYyyyMmDd(today))
    wrapper.vm.$refs.hourSelector.setValue((today.getHours() % 12).toString())
    await wrapper.find('#period-selector').setValue(today.getHours() >= 12 ? 'pm' : 'am')

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is false
    // Note that it is important to test 'event === false' to check it is not 0 (zero) or other falsy evaluation
    expect(getLastEvent(wrapper, 'valid') === false).toBeTruthy()
  })

  // FUTURE: this works locally but not in GHA; fix later
  xit('emits a valid state when Future Effective is selected and valid date and time are entered', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeDefault,
      isAppValidate: false
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set everything
    await wrapper.find('#date-text-field').setValue(wrapper.vm.dateToYyyyMmDd(today))
    wrapper.vm.$refs.hourSelector.setValue((today.getHours() % 12).toString())
    wrapper.vm.$refs.minuteSelector.setValue(today.getMinutes().toString())
    await wrapper.find('#period-selector').setValue(today.getHours() >= 12 ? 'pm' : 'am')

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is true
    expect(getLastEvent(wrapper, 'valid')).toEqual(true)
  })

  // FUTURE: It was decided not to load FED from draft for now
  xit('emits a valid state when component mounts with valid Effective Date Time', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeValid,
      isAppValidate: false
    })

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is true
    expect(getLastEvent(wrapper, 'valid')).toEqual(true)
  })

  it('emits a invalid state when component mounts with invalid Effective Date ', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeOver,
      isAppValidate: false
    })

    // wait a bit for validation to complete
    await flushPromises()

    // Verify the last Valid event is false
    expect(getLastEvent(wrapper, 'valid')).toEqual(false)
  })

  // FUTURE: this works locally but not in GHA; fix later
  xit('displays an invalid Date Alert when the date is invalid', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeOver,
      isAppValidate: false
    })

    // wait a bit for validation to complete
    await flushPromises()

    const minDate = wrapper.vm.dateToYyyyMmDd(wrapper.vm.minDate)
    const maxDate = wrapper.vm.dateToYyyyMmDd((wrapper.vm.maxDate))
    expect(wrapper.vm.$el.querySelector('.date-time-selectors').textContent)
      .toContain(`Date must be between ${minDate} and ${maxDate}`)

    // Verify the last Valid event is false
    expect(getLastEvent(wrapper, 'valid')).toEqual(false)
  })

  it('displays a validation error when the effective time is less than 3 minutes from now', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeUnder,
      isAppValidate: true
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set current date and time
    await wrapper.find('#date-text-field').setValue(wrapper.vm.dateToYyyyMmDd(today))
    wrapper.vm.$refs.hourSelector.setValue((today.getHours() % 12).toString())
    wrapper.vm.$refs.minuteSelector.setValue((today.getMinutes()).toString())
    await wrapper.find('#period-selector').setValue(today.getHours() >= 12 ? 'pm' : 'am')
    wrapper.vm.dateText = wrapper.vm.dateToYyyyMmDd(today)

    // wait a bit for validation to complete
    await flushPromises()

    // verify Min Time alert
    const minTime = wrapper.vm.dateToPacificTime(wrapper.vm.minDate)
    expect(wrapper.vm.$el.querySelector('.validation-alert-msg').textContent)
      .toContain(`The time must be at least ${minTime} for the selected date`)

    // Verify the last Valid event is false
    // Note that it is important to test 'event === false' to check it is not 0 (zero) or other falsy evaluation
    expect(getLastEvent(wrapper, 'valid') === false).toBeTruthy()
  })

  it('displays a validation error when the effective time is more than 10 days from now', async () => {
    const wrapper = wrapperFactory({
      currentJsDate: today,
      effectiveDateTime: dateTimeOver,
      isAppValidate: true
    })

    // select Future Effective
    const radioInput = wrapper.findAll('input[type="radio"]')
    const radioIsFutureEffective = radioInput.at(1)
    await radioIsFutureEffective.trigger('click')

    // set current date + 11 days and time
    await wrapper.find('#date-text-field').setValue(wrapper.vm.dateToYyyyMmDd(futureInvalidDate))
    wrapper.vm.$refs.hourSelector.setValue((futureInvalidDate.getHours() % 12).toString())
    wrapper.vm.$refs.minuteSelector.setValue((futureInvalidDate.getMinutes()).toString())
    await wrapper.find('#period-selector').setValue(futureInvalidDate.getHours() >= 12 ? 'pm' : 'am')
    wrapper.vm.dateText = wrapper.vm.dateToYyyyMmDd(futureInvalidDate)

    // wait a bit for validation to complete
    await flushPromises()

    // verify Min Time alert
    const maxTime = wrapper.vm.dateToPacificTime(wrapper.vm.maxDate)

    expect(wrapper.vm.$el.querySelector('.validation-alert-msg').textContent)
      .toContain(`The time must be at most ${maxTime} for the selected date`)

    // Verify the last Valid event is false
    expect(getLastEvent(wrapper, 'valid')).toEqual(false)
  })
})
