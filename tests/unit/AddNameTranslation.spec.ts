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
const addTranslationInput = '#name-translation-input'
const doneBtn = '#name-translation-btn-done'
const removeBtn = '#name-translation-btn-remove'
const cancelBtn = '#name-translation-btn-cancel'

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

  it('Displays the input field and buttons', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Verify Action btns and their default states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('Enables the Done button when the input is valid', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const validText = 'Valid Name Translation'
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = validText
    await wrapper.find(addTranslationInput).setValue(validText)
    await wrapper.find(addTranslationInput).trigger('change')

    expect(wrapper.find(addTranslationInput).text()).toEqual(validText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('Enables the Done button when the input is valid - French characters', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const validText = 'Nom Commercial Simulé'
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = validText
    await wrapper.find(addTranslationInput).setValue(validText)
    await wrapper.find(addTranslationInput).trigger('change')

    expect(wrapper.find(addTranslationInput).text()).toEqual(validText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('Disables the Done button, shows the validation message when the input has an invalid character', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const invalidText = 'Invalid Name Translation 123'
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = invalidText
    await wrapper.find(addTranslationInput).setValue(invalidText)
    await wrapper.find(addTranslationInput).trigger('change')

    expect(wrapper.find(addTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Invalid character')

    wrapper.destroy()
  })

  it('Shows the validation message, disables the Done button when the input is too long', async () => {
    const wrapper = await wrapperFactory()

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()

    // Set Input field value
    const invalidText = 'a'.repeat(51)
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = invalidText
    await wrapper.find(addTranslationInput).setValue(invalidText)
    await wrapper.find(addTranslationInput).trigger('change')

    expect(wrapper.find(addTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Cannot exceed 50 characters')

    wrapper.destroy()
  })

  it('Displays the correct name when editing a Name Translation', async () => {
    const wrapper = await wrapperFactory({ editNameTranslation: 'Mock Name Edit' })

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    wrapper.destroy()
  })

  it('Shows the validaton message, disables the Done button when editing an invalid Name Translation', async () => {
    const wrapper = await wrapperFactory({ editNameTranslation: 'Mock Name Edit' })

    // Verify input field
    expect(wrapper.find(addTranslationInput).exists()).toBeTruthy()
    expect(wrapper.find(addTranslationInput).element.value).toContain('Mock Name Edit')

    // Edit the name
    const invalidText = 'Invalid Name Translation 123'
    wrapper.vm.$el.querySelector(addTranslationInput).textContent = invalidText
    await wrapper.find(addTranslationInput).setValue(invalidText)
    await wrapper.find(addTranslationInput).trigger('change')

    expect(wrapper.find(addTranslationInput).text()).toEqual(invalidText)

    // Verify Action btns and their states
    expect(wrapper.find(doneBtn).exists()).toBeTruthy()
    expect(wrapper.find(doneBtn).attributes('disabled')).toBe('disabled')

    expect(wrapper.find(removeBtn).exists()).toBeTruthy()
    expect(wrapper.find(removeBtn).attributes('disabled')).toBeUndefined() // enabled

    expect(wrapper.find(cancelBtn).exists()).toBeTruthy()
    expect(wrapper.find(cancelBtn).attributes('disabled')).toBeUndefined() // enabled

    // verify the error message
    expect(wrapper.findAll('.v-messages__message').length).toBe(1)
    expect(wrapper.find('.v-messages__message').text()).toContain('Invalid character')

    wrapper.destroy()
  })

  it('Inputed text is capitalized', async () => {
    const wrapper = await wrapperFactory()
    const translationInput = wrapper.find(addTranslationInput)
    await translationInput.setValue('Lower case will be capitalized')

    expect(wrapper.find(addTranslationInput).element.value).toBe('LOWER CASE WILL BE CAPITALIZED')
  })
})
