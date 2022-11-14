import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store'
import { createLocalVue, mount } from '@vue/test-utils'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Local references
const nameTranslationInput = '#name-translation-input'
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

    wrapperFactory = async (propsData: any) => {
      const wrapper = mount(AddNameTranslation, {
        localVue,
        router,
        store,
        vuetify,
        propsData: { ...propsData }
      })
      await Vue.nextTick()
      return wrapper
    }
  })

  it('displays the input field and buttons', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()

    // Verify Action btns and their default states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('enables the Done button when the input is valid', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const validText = 'Valid Name Translation'
    wrapper.vm.$el.querySelector(nameTranslationInput).textContent = validText
    await wrapper.find(nameTranslationInput).setValue(validText)
    await wrapper.find(nameTranslationInput).trigger('change')

    expect(wrapper.find(nameTranslationInput).text()).toEqual(validText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('enables the Done button when the input is valid - French characters', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const validText = 'Nom Commercial Simulé'
    wrapper.vm.$el.querySelector(nameTranslationInput).textContent = validText
    await wrapper.find(nameTranslationInput).setValue(validText)
    await wrapper.find(nameTranslationInput).trigger('change')

    expect(wrapper.find(nameTranslationInput).text()).toEqual(validText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('disables the Done button when the input contains an invalid character', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const invalidText = 'Invalid Name Translation 123'
    wrapper.vm.$el.querySelector(nameTranslationInput).textContent = invalidText
    await wrapper.find(nameTranslationInput).setValue(invalidText)
    await wrapper.find(nameTranslationInput).trigger('change')

    expect(wrapper.find(nameTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('disables the Done button when the input is too long', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const invalidText = 'a'.repeat(51)
    wrapper.vm.$el.querySelector(nameTranslationInput).textContent = invalidText
    await wrapper.find(nameTranslationInput).setValue(invalidText)
    await wrapper.find(nameTranslationInput).trigger('change')

    expect(wrapper.find(nameTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('displays the correct Name when editing a Name Translation', async () => {
    const wrapper = await wrapperFactory({ editNameTranslation: 'Mock Name Edit' })

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(nameTranslationInput).element.value).toContain('Mock Name Edit')

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('disables the Done button when editing an invalid name translation', async () => {
    const wrapper = await wrapperFactory({ editNameTranslation: 'Mock Name Edit' })

    // Verify input field
    expect(wrapper.find(nameTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(nameTranslationInput).element.value).toContain('Mock Name Edit')

    // Edit the name
    const invalidText = 'Invalid Name Translation 123'
    wrapper.vm.$el.querySelector(nameTranslationInput).textContent = invalidText
    await wrapper.find(nameTranslationInput).setValue(invalidText)
    await wrapper.find(nameTranslationInput).trigger('change')

    expect(wrapper.find(nameTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })
})
