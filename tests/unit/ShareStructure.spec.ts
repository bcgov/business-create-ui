import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import ShareStructure from '@/components/Incorporation/ShareStructure.vue'
import { ShareClassIF } from '@/interfaces'
import { waitForUpdate } from '../wait-for-update'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Events
const addEditShareClassEvent = 'addEditClass'
const addEditShareSeriesEvent = 'addEditSeries'
const removeClassEvent = 'removeClass'
const removeSeriesEvent = 'removeSeries'
const formResetEvent = 'resetEvent'

// Input field selectors to test changes to the DOM elements.
const nameSelector = '#txt-name'
const txtMaxShares = '#txt-max-shares'
const classParValue = '#class-par-value'
const seriesParValue = '#series-par-value'
const seriesCurrency = '#series-currency'
const noParValueSelector = '#radio-no-par'
const parValueSelector = '#radio-par-value'
const specialRightsChkBoxSelector = '#special-rights-check-box'
const doneButtonSelector = '#btn-done'
const removeButtonSelector = '#btn-remove'
const cancelButtonSelector = '#btn-cancel'
const formSelector = '.share-structure-form'

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @returns a Wrapper<ShareStructure> object with the given parameters.
 */
function createComponent (
  shareClass: ShareClassIF,
  activeIndex = -1,
  shareId = '',
  parentIndex = -1,
  shareClasses = [] as ShareClassIF[]
): Wrapper<ShareStructure> {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  document.body.setAttribute('data-app', 'true')
  return mount(ShareStructure, {
    localVue,
    propsData: {
      initialValue: shareClass,
      activeIndex,
      shareId,
      parentIndex,
      shareClasses
    },
    vuetify
  })
}

function createShareStructure (
  id = null,
  priority = null,
  type,
  name,
  hasMaximumShares = true,
  maxNumberOfShares = null as number,
  hasParValue = true,
  parValue = null as number,
  currency = null,
  hasRightsOrRestrictions = false
): ShareClassIF {
  const shareStructure: ShareClassIF = {
    id,
    priority,
    type,
    name,
    hasMaximumShares,
    maxNumberOfShares,
    hasParValue,
    parValue,
    currency,
    hasRightsOrRestrictions
  }
  if (type === 'Class') {
    shareStructure.series = []
  }
  return shareStructure
}

store.stateModel.nameRequest.legalType = CorpTypeCd.BENEFIT_COMPANY
store.stateModel.currentDate = '2020-03-30'

describe('Share Structure component', () => {
  it('Loads the component and sets data for share structure', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [])
    expect(wrapper.vm.$data.shareStructure).toStrictEqual(shareClass)
    expect(wrapper.vm.$data.hasNoMaximumShares).toBe(false)
    expect(wrapper.vm.$data.hasNoParValue).toBe(false)
    await Vue.nextTick()
    wrapper.destroy()
  })

  it('Displays form data for share class with max shares and par value', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [])
    await Vue.nextTick()
    expect((<HTMLInputElement>wrapper.find(nameSelector).element).value)
      .toEqual(shareClass.name)
    expect((<HTMLInputElement>wrapper.find(txtMaxShares).element).value)
      .toEqual(shareClass.maxNumberOfShares.toString())
    expect((<HTMLInputElement>wrapper.find(classParValue).element).value)
      .toEqual(shareClass.parValue.toString())
    expect(wrapper.find(parValueSelector).attributes('aria-checked')).toBe('true')
    expect(wrapper.find(noParValueSelector).attributes('aria-checked')).toBe('false')
    expect(wrapper.find(specialRightsChkBoxSelector).attributes('aria-checked')).toBe('true')
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(cancelButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBe('disabled')
    wrapper.destroy()
  })

  it('Displays form data for share class with no max shares and no par value', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', false, null, false, null, null, true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [])
    await Vue.nextTick()
    expect((<HTMLInputElement>wrapper.find(nameSelector).element).value)
      .toEqual(shareClass.name)
    expect(wrapper.find(parValueSelector).attributes('aria-checked')).toBe('false')
    expect(wrapper.find(noParValueSelector).attributes('aria-checked')).toBe('true')
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(cancelButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBe('disabled')
    wrapper.destroy()
  })

  it('Emits add edit class event', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [])
    wrapper.find(doneButtonSelector).trigger('click')
    expect(wrapper.emitted().addEditClass).toBeTruthy()
    expect(wrapper.emitted(addEditShareClassEvent).length).toBe(1)
    wrapper.destroy()
  })

  it('Emits remove class event', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, 1, '', null, [])
    wrapper.find(removeButtonSelector).trigger('click')
    expect(wrapper.emitted().removeClass).toBeTruthy()
    expect(wrapper.emitted(removeClassEvent).length).toBe(1)
    expect(wrapper.emitted(removeClassEvent)[0][0]).toStrictEqual(1)
    wrapper.destroy()
  })

  it('Emits add edit series event', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(null, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, -1, '1', 0, [shareClass])
    wrapper.find(doneButtonSelector).trigger('click')
    expect(wrapper.emitted().addEditSeries).toBeTruthy()
    expect(wrapper.emitted(addEditShareSeriesEvent).length).toBe(1)
    wrapper.destroy()
  })

  it('Emits remove series event', async () => {
    const shareClass = createShareStructure(1, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, 0, '', 0, [shareClass])
    wrapper.find(removeButtonSelector).trigger('click')
    expect(wrapper.emitted().removeSeries).toBeTruthy()
    expect(wrapper.emitted(removeSeriesEvent).length).toBe(1)
    expect(wrapper.emitted(removeSeriesEvent)[0][0]).toStrictEqual(0)
    wrapper.destroy()
  })

  it('Emits cancel event', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [])
    wrapper.find(cancelButtonSelector).trigger('click')
    expect(wrapper.emitted().resetEvent).toBeTruthy()
    expect(wrapper.emitted(formResetEvent).length).toBe(1)
    wrapper.destroy()
  })

  it('Shows error message for duplicate share class name', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Class A')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text()).toContain('Class name must be unique')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message for duplicate share series name', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries1 = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries2 = createShareStructure(1, 1, 'Series', 'Series B', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries1)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries2, -1, '1', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Series A')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text()).toContain('Series name must be unique')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if class name contains the word "value"', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Class A value')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('Class name should not contain any of the words share, shares or value')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if series name contains the word "share"', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(null, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, -1, '1', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Series A share')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('Series name should not contain any of the words share or shares')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if par value is less than 0', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(classParValue)
    inputElement.setValue(-2)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('Amount must be greater than 0')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if par value < 1 has incorrect precision', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(classParValue)
    inputElement.setValue(0.1111)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('Amounts less than 1 can be entered with up to 3 decimal place')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if par value > 1 has incorrect precision', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(classParValue)
    inputElement.setValue(1.234)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('Amounts greater than 1 can be entered with up to 2 decimal place')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if maximum shares is not entered', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)

    // before entering anything
    inputElement.setValue(null)
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Number of shares is required')
    expect(wrapper.vm.$data.formValid).toBe(false)

    // after entering and deleting value
    inputElement.setValue('')
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Number of shares is required')
    expect(wrapper.vm.$data.formValid).toBe(false)

    wrapper.destroy()
  })

  it('Shows error message if maximum shares is not a whole number', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)

    // try decimal number
    inputElement.setValue(0.5)
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Must be a whole number')
    expect(wrapper.vm.$data.formValid).toBe(false)

    wrapper.destroy()
  })

  it('Shows error message if maximum shares is not greater than 0', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)

    // try 0
    inputElement.setValue(0)
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Number must be greater than 0')
    expect(wrapper.vm.$data.formValid).toBe(false)

    // try negative number
    inputElement.setValue(-1)
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Number must be greater than 0')
    expect(wrapper.vm.$data.formValid).toBe(false)

    wrapper.destroy()
  })

  it('Shows error message if maximum shares is not less than 16 digits', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)

    // try 16 digits
    inputElement.setValue(1234567890123456)
    inputElement.trigger('change')
    await waitForUpdate()

    expect(wrapper.find(formSelector).text()).toContain('Number must be less than 16 digits')
    expect(wrapper.vm.$data.formValid).toBe(false)

    wrapper.destroy()
  })

  it('Shows error message if series maximum shares is greater than class max shares', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, 0, '', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)
    inputElement.setValue(200)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message if sum of series maximum shares is greater than class max shares', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 200, true, 0.50, 'CAD', true)
    const shareSeries1 = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries2 = createShareStructure(null, 2, 'Series', 'Series B', true, 50, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries1)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries2, -1, '2', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)
    inputElement.setValue(150)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows series par value and currency in read only mode', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, 0, '', 0, [shareClass])
    expect((<HTMLInputElement>wrapper.find(seriesParValue).element).value)
      .toEqual(shareSeries.parValue.toString())
    expect(wrapper.find(seriesParValue).attributes('disabled')).toBe('disabled')
    expect((<HTMLInputElement>wrapper.find(seriesCurrency).element).value)
      .toEqual('Canadian dollar (CAD)')
    expect(wrapper.find(seriesCurrency).attributes('disabled')).toBe('disabled')
    wrapper.destroy()
  })

  it('Do not display series no max share option if class has max share', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, 0, '', 0, [shareClass])
    expect(wrapper.find('#lbl-no-maximum').exists()).toBe(false)
    wrapper.destroy()
  })

  it('Currency dropdown loads and model change is reflected in the drop down selection', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, 0, '', 0, [])
    const items = wrapper.find('.v-select').props('items')
    expect(items.length).toBe(157)
    expect(wrapper.vm.$data.shareStructure.currency).toBe('CAD')
    expect(wrapper.find('.v-select').text()).toContain('Canadian dollar (CAD)')
    shareClass.currency = 'USD'
    wrapper.setData({ shareStructure: shareClass })
    await waitForUpdate()
    expect(wrapper.find('.v-select').text()).toContain('United States dollar (USD)')
  })

  it('Shows error if maximum shares of class is changed to lower value than series max shares', async () => {
    const shareClass = createShareStructure(1, 1, 'Class', 'Class A', true, 200, true, 0.50, 'CAD', true)
    const shareSeries1 = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries2 = createShareStructure(2, 2, 'Series', 'Series B', true, 50, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries1)
    shareClass.series.push(shareSeries2)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, 1, '2', null, [])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)
    inputElement.setValue(50)
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .toContain('The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Does not show error message if series max shares is changed to lower than class max shares', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries, 0, '', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(txtMaxShares)
    inputElement.setValue(20)
    inputElement.trigger('change')
    await waitForUpdate(3)
    expect(wrapper.find(formSelector).text())
      .not.toContain('The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
    wrapper.destroy()
  })

  it('Shows error message for duplicate share class name for edit', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, 1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Class A')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text()).toContain('Class name must be unique')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })

  it('Shows error message for duplicate share series name for edit', async () => {
    const shareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries1 = createShareStructure(1, 1, 'Series', 'Series A', true, 100, true, 0.50, 'CAD', true)
    const shareSeries2 = createShareStructure(1, 1, 'Series', 'Series B', true, 100, true, 0.50, 'CAD', true)
    shareClass.series.push(shareSeries1)
    shareClass.series.push(shareSeries2)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareSeries2, 1, '1', 0, [shareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(nameSelector)
    inputElement.setValue('Series A')
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text()).toContain('Series name must be unique')
    expect(wrapper.vm.$data.formValid).toBe(false)
    wrapper.destroy()
  })
  it('Do not show error if par value < 1 does not have 0 before decimal ', async () => {
    const existingShareClass = createShareStructure(null, 1, 'Class', 'Class A', true, 100, true, 0.50, 'CAD', true)
    const shareClass = createShareStructure(null, 1, 'Class', 'Class B', true, 100, true, 0.50, 'CAD', true)
    const wrapper: Wrapper<ShareStructure> = createComponent(shareClass, -1, '1', null, [existingShareClass])
    const inputElement: Wrapper<Vue> = wrapper.find(classParValue)
    inputElement.setValue(.01) // eslint-disable-line no-floating-decimal
    inputElement.trigger('change')
    await waitForUpdate()
    expect(wrapper.find(formSelector).text())
      .not.toContain('Amounts less than 1 can be entered with up to 3 decimal place')
    expect(wrapper.vm.$data.formValid).toBe(true)
    wrapper.destroy()
  })
})
