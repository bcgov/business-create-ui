import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'
import InvalidFilingDialog from '@/dialogs/InvalidFilingDialog.vue'

const vuetify = new Vuetify({})

describe('Invalid Filing Dialog', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })
    expect(wrapper.attributes('contentclass')).toBe('invalid-filing-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Filing Does Not Exist')
    expect(wrapper.findAll('p').length).toBe(1)
    expect(wrapper.findAll('p').at(0).text())
      .toContain('The filing you are attempting to open does not exist')
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when Exit button is clicked', async () => {
    const wrapper = mount(InvalidFilingDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('exit')).toBeUndefined()

    // verify and click Exit button
    const exitButton = wrapper.find('#dialog-exit-button')
    expect(exitButton.text()).toBe('Go to Dashboard')
    exitButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('exit').length).toBe(1)

    wrapper.destroy()
  })
})
