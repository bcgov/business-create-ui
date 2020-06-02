import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

import { AgreementType } from '@/components/IncorporationAgreement'

// Store
import { getVuexStore } from '@/store'

Vue.use(Vuetify)

let vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const sampleTypeSelector: string = '#agreement-type-sample'
const customTypeSelector: string = '#agreement-type-custom'
const summaryErrorMessageSelector: string = '.agreement-invalid-message'
const summaryTextSelector: string = '.summary-desc'

/**
 * Utility method to get around with the timing issues
 */
async function waitForUpdate (wrapper: Wrapper<Vue>) {
  await wrapper.vm.$nextTick()
  await flushPromises()
  await wrapper.vm.$nextTick()
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @returns a Wrapper<AgreementType> object with the given parameters.
 */
function createComponent (showErrorSummary:boolean = false, isSummary:boolean = false): Wrapper<AgreementType> {
  const localVue = createLocalVue()
  localVue.use(VueRouter)
  const router = mockRouter.mock()
  localVue.use(Vuetify)
  document.body.setAttribute('data-app', 'true')
  return mount(AgreementType, {
    localVue,
    propsData: {
      showErrorSummary: showErrorSummary,
      isSummary: isSummary
    },
    router,
    store,
    vuetify
  })
}

store.state.stateModel.nameRequest.entityType = 'BC'
store.state.stateModel.currentDate = '2020-03-30'

describe('Share Structure component', () => {
  it('Loads the component in edit mode and both agreement types are not selected', async () => {
    const wrapper: Wrapper<AgreementType> = createComponent()
    expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('false')
    expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
    wrapper.destroy()
  })

  it('Selects the radio button if the value is set in the store', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
    const wrapper: Wrapper<AgreementType> = createComponent()
    await waitForUpdate(wrapper)
    expect(wrapper.find(sampleTypeSelector).attributes('aria-checked')).toBe('true')
    expect(wrapper.find(customTypeSelector).attributes('aria-checked')).toBe('false')
    store.state.stateModel.incorporationAgreementStep.agreementType = null
    wrapper.destroy()
  })

  it('Displays the summary text for sample agreement type', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'sample'
    const wrapper: Wrapper<AgreementType> = createComponent(false, true)
    await waitForUpdate(wrapper)
    expect(wrapper.find(summaryTextSelector).text()).toContain(
      'The sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
      'provision have been completed and a copy added to the company\'s record book.')
    wrapper.destroy()
  })

  it('Displays the summary text for custom agreement type', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'custom'
    const wrapper: Wrapper<AgreementType> = createComponent(false, true)
    await waitForUpdate(wrapper)
    expect(wrapper.find(summaryTextSelector).text()).toContain(
      'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
      'a benefit provision have been completed and a copy added to the company\'s record book.')
    wrapper.destroy()
  })

  it('Displays the error message in summary view if no agreement type is selected', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'null'
    const wrapper: Wrapper<AgreementType> = createComponent(true, true)
    await waitForUpdate(wrapper)
    expect(wrapper.find(summaryErrorMessageSelector).text()).toContain('This step is not complete.')
    wrapper.destroy()
  })

  it('Updates the store correctly if an agreement type is selected', async () => {
    store.state.stateModel.incorporationAgreementStep.agreementType = 'null'
    const wrapper: Wrapper<AgreementType> = createComponent(false, false)
    const radio = wrapper.find(sampleTypeSelector)
    radio.trigger('click')
    await waitForUpdate(wrapper)
    expect(store.state.stateModel.incorporationAgreementStep.agreementType).toBe('sample')
    expect(store.state.stateModel.incorporationAgreementStep.valid).toBeTruthy()
    wrapper.destroy()
  })
})
