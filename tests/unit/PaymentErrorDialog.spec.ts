import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount, mount } from '@vue/test-utils'
import { PaymentErrorDialog } from '@/components/dialogs'
import ErrorContact from '@/components/common/ErrorContact.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Payment Error Dialog', () => {
  it('renders the component properly as a staff user', () => {
    store.state.stateModel.tombstone.keycloakRoles = ['staff', 'edit', 'view']
    const wrapper = shallowMount(PaymentErrorDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('payment-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Process Payment')
    expect(wrapper.findAll('p').length).toBe(1)
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process payments')
    expect(wrapper.find(ErrorContact).exists()).toBe(false)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly as a regular user', () => {
    store.state.stateModel.tombstone.keycloakRoles = ['edit', 'view']
    const wrapper = shallowMount(PaymentErrorDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.attributes('contentclass')).toBe('payment-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Process Payment')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process payments')
    expect(wrapper.findAll('p').at(1).text()).toContain('PayBC is normally available')
    expect(wrapper.findAll('p').at(2).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(3)
    expect(wrapper.findAll('li').at(0).text()).toContain('Monday to Friday')
    expect(wrapper.findAll('li').at(1).text()).toContain('Saturday')
    expect(wrapper.findAll('li').at(2).text()).toContain('Sunday')
    expect(wrapper.find(ErrorContact).exists()).toBe(true)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when Exit button is clicked', async () => {
    const wrapper = mount(PaymentErrorDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('exit')).toBeUndefined()

    // verify and click Exit button
    const exitButton = wrapper.find('#dialog-exit-button')
    expect(exitButton.text()).toBe('Return to dashboard')
    exitButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('exit').length).toBe(1)

    wrapper.destroy()
  })
})
