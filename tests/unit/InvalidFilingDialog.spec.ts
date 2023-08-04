import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount, mount } from '@vue/test-utils'
import InvalidIncorporationApplicationDialog from '@/dialogs/InvalidFilingDialog.vue'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Invalid Filing Dialog', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(InvalidIncorporationApplicationDialog,
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
    const wrapper = mount(InvalidIncorporationApplicationDialog,
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
