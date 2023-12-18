// Libraries
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import FolioNumber from '@/components/common/FolioNumber.vue'

const vuetify = new Vuetify({})

describe('Folio number component', () => {
  it('displays editing view', () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: true },
      vuetify
    })

    expect(wrapper.find('.folio-number-title').text()).toBe('Folio Number')
    expect(wrapper.find('#folio-number-editing').exists()).toBe(true)
    expect(wrapper.find('#folio-number-read-only').exists()).toBe(false)

    wrapper.destroy()
  })

  it('displays readonly view', () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: false },
      vuetify
    })

    expect(wrapper.find('#folio-number-editing').exists()).toBe(false)
    expect(wrapper.find('#folio-number-read-only').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays correct label', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { folioNumberLabel: true, isEditing: true },
      vuetify
    })

    expect(wrapper.find('.folio-number-title').text()).toBe('Folio or Reference Number')

    wrapper.destroy()
  })

  it('accepts empty folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-text-field')
    input.setValue('')
    input.trigger('change')
    await flushPromises()

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)

    wrapper.destroy()
  })

  it('accepts valid folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-text-field')
    input.setValue('123ABCabc')
    input.trigger('change')
    await flushPromises()

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)
    wrapper.destroy()
  })

  it('rejects folio number that is too long', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-text-field')
    input.setValue('123456789012345678901234567890123456789012345678901')
    input.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Cannot exceed 50 characters')

    wrapper.destroy()
  })
})
