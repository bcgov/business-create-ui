import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount, mount } from '@vue/test-utils'
import PaymentErrorDialog from '@/dialogs/PaymentErrorDialog.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Payment Error Dialog', () => {
  const padError = [{
    message: `Your account is in the 3 day PAD confirmation period. You will be able to do transactions only after
    the period is over.`,
    payment_error_type: 'ACCOUNT_IN_PAD_CONFIRMATION_PERIOD'
  }]

  it('renders the component properly as a staff user', () => {
    store.state.stateModel.tombstone.authRoles = ['staff', 'edit', 'view']
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
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process your payment')
    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(false)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component properly as a regular user', () => {
    store.state.stateModel.tombstone.authRoles = ['edit', 'view']
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
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process your payment')
    expect(wrapper.findAll('p').at(1).text()).toContain('PayBC is normally available')
    expect(wrapper.findAll('p').at(2).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(3)
    expect(wrapper.findAll('li').at(0).text()).toContain('Monday to Friday')
    expect(wrapper.findAll('li').at(1).text()).toContain('Saturday')
    expect(wrapper.findAll('li').at(2).text()).toContain('Sunday')
    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(true)
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
    expect(exitButton.text()).toBe('Back to My Dashboard')
    exitButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('exit').length).toBe(1)

    wrapper.destroy()
  })

  it('renders PAD error messages correctly when they are present', () => {
    store.state.stateModel.tombstone.authRoles = ['edit', 'view']
    const wrapper = shallowMount(PaymentErrorDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true, errors: padError }
      })

    expect(wrapper.attributes('contentclass')).toBe('payment-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Process Payment')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process your payment')
    expect(wrapper.findAll('p').at(1).text()).toContain(
      'We were unable to process your payment due to the following errors:'
    )
    expect(wrapper.findAll('p').at(2).text()).toContain('If this error persists')
    expect(wrapper.findAll('li').length).toBe(0)
    expect(wrapper.findAll('span').length).toBe(2)
    expect(wrapper.findAll('span').at(1).text()).toContain('Your account is in the 3 day PAD confirmation period.')

    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(true)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders PAD warning messages correctly when they are present', () => {
    store.state.stateModel.tombstone.authRoles = ['edit', 'view']
    const wrapper = shallowMount(PaymentErrorDialog,
      {
        vuetify,
        store,
        propsData: {
          dialog: true,
          warnings: [
            { message: 'Test Warning 1' },
            { message: 'Test Warning 2' }
          ]
        }
      })

    expect(wrapper.attributes('contentclass')).toBe('payment-error-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('#dialog-title').text()).toBe('Unable to Process Payment')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('We are unable to process your payment')
    expect(wrapper.findAll('p').at(1).text()).toContain('Please note the following warnings')

    expect(wrapper.findAll('li').length).toBe(0)
    expect(wrapper.findAll('span').length).toBe(4)
    expect(wrapper.findAll('span').at(1).text()).toContain('Test Warning 1')
    expect(wrapper.findAll('span').at(3).text()).toContain('Test Warning 2')

    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-okay-button').exists()).toBe(false)

    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(true)
    expect(wrapper.find('#dialog-exit-button').exists()).toBe(true)

    wrapper.destroy()
  })
})
