import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { NameRequestInvalidErrorDialog } from '@/components/dialogs'
import { NameRequestStates } from '@/enums/nameRequestStates'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

describe('NameRequestInvalidErrorDialog - Displays Error/Warning messages', () => {
  it('displays name request not found message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: NameRequestStates.NOTFOUND
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.genErr').text()).toBe('The specified name request number could not be found.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays name request expired message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: NameRequestStates.EXPIRED
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Invalid')
    expect(wrapper.find('.genErr').text()).toBe('The specified name request has expired.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })

  it('displays name request consumed message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: NameRequestStates.CONSUMED
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Invalid')
    expect(wrapper.find('.genErr').text()).toBe('The specified name request has already been consumed.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays name request not approved message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: NameRequestStates.NOTAPPROVED
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Invalid')
    expect(wrapper.find('.genErr').text()).toBe('The specified name request has not been approved.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })
  it('displays name request unexpected error message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: ''
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Name Request Invalid')
    expect(wrapper.find('.genErr').text()).toBe('An unexpected error has occurred.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })
})
