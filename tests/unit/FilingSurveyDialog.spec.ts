import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import FilingSurveyDialog from '@/dialogs/FilingSurveyDialog.vue'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Filing Survey Dialog', () => {
  it('renders the component properly', () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.find('.v-dialog').classes()).toContain('filing-survey-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.v-card__title').text()).toBe('Tell Us About Your Experience Today')
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('p').at(0).text()).toContain('Do you want to help us improve')
    expect(wrapper.findAll('p').at(1).text()).toContain('Privacy Statement')
    expect(wrapper.find('#dialog-no-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-yes-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when "Do not show" button is clicked', async () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('doNotShow')).toBeUndefined()

    // verify and click checkbox
    const checkbox = wrapper.find('.dialog-checkbox')
    expect(checkbox.text()).toBe('Do not show this message again')
    checkbox.find('input').trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('doNotShow').length).toBe(1)

    wrapper.destroy()
  })

  it('emits an event when "No" button is clicked', async () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('no')).toBeUndefined()

    // verify and click button
    const button = wrapper.find('#dialog-no-button')
    expect(button.text()).toBe('Not Right Now')
    button.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('no').length).toBe(1)

    wrapper.destroy()
  })

  it('emits an event when "Yes" button is clicked', async () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('yes')).toBeUndefined()

    // verify and click button
    const button = wrapper.find('#dialog-yes-button')
    expect(button.text()).toBe('Yes, I\'ll Participate')
    button.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('yes').length).toBe(1)

    wrapper.destroy()
  })
})
