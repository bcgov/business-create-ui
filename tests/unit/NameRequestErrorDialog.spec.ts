import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount, mount } from '@vue/test-utils'
import NameRequestErrorDialog from '@/dialogs/NameRequestErrorDialog.vue'

const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Name Request error Dialog', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(NameRequestErrorDialog,
      {
        vuetify,
        propsData: { dialog: true, error: 'sample error text' }
      })
    expect(wrapper.attributes('contentclass')).toBe('name-request-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Error')
    expect(wrapper.find('#dialog-text').text()).toBe('sample error text')
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when OK button is clicked', async () => {
    const wrapper = mount(NameRequestErrorDialog,
      {
        vuetify,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('exit')).toBeUndefined()

    // verify and click OK  button
    const okayButton = wrapper.find('#dialog-okay-button')
    expect(okayButton.text()).toBe('OK')
    okayButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('okay').length).toBe(1)

    wrapper.destroy()
  })
})
