// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { AddNameTranslation } from '@/components/DefineCompany/'
import flushPromises from 'flush-promises'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

function resetStore (): void {
  store.state.stateModel.nameTranslations = []
}

// Local references
const addTranslationInput = '#name-translation-input'
const doneBtn = '#btn-done'
const removeBtn = '#btn-remove'
const cancelBtn = '#btn-cancel'

describe('Add Name Translation component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    // Init Store
    store.state.stateModel.nameTranslations = []

    wrapperFactory = (propsData) => {
      return mount(AddNameTranslation, {
        localVue,
        router,
        store,
        vuetify,
        propsData: { ...propsData }
      })
    }
  })

  it('displays the input field and buttons in the Add Name Translation form', () => {
    const wrapper = wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Verify Action btns and there default states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('enables the Done button when the input field meets validation rules', async () => {
    const wrapper = wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field values
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = 'Mock Name Translation'
    wrapper.find(addTranslationInput).setValue('MockNameTranslation')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    wrapper.find(addTranslationInput).trigger('input')
    expect(wrapper.find(addTranslationInput).text()).toEqual('Mock Name Translation')

    // Verify Action btns and there states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('disables the Done button when the input field does NOT meet validation rules', async () => {
    const wrapper = wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field values
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = 'Mock Fail 1212'
    wrapper.find(addTranslationInput).setValue('Mock Fail 1212')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    wrapper.find(addTranslationInput).trigger('input')
    expect(wrapper.find(addTranslationInput).text()).toEqual('Mock Fail 1212')

    // Verify Action btns and there states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('opens the Add Name Translation with the correct Name when Editing a Name Translation', async () => {
    const wrapper = wrapperFactory({ editNameTranslation: 'Mock Name Edit' })
    await flushPromises()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Verify Action btns and there states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('disables the Done btn when editing a name translation that does NOT meet validation', async () => {
    const wrapper = wrapperFactory({ editNameTranslation: 'Mock Name Edit' })
    await flushPromises()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Edit the name
    wrapper.find(addTranslationInput).setValue('Mock edit fail 1212')
    wrapper.find(addTranslationInput).trigger('change')
    await flushPromises()

    // Verify Action btns and there states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeTruthy()

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined()

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })
})
