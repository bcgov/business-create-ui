import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import InvalidFilingDialog from '@/dialogs/InvalidFilingDialog.vue'

const vuetify = new Vuetify({})

describe('Invalid Filing Dialog', () => {
  it('displays Not Found message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'NOT_FOUND'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request could not be found.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays Expired message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'EXPIRED'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request has expired.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })

  it('displays Already Consumed message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'CONSUMED'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request has already been consumed.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays Not Approved message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'NOT_APPROVED'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request has not been approved.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })

  it('displays Unexpected Error message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: null
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toContain('An unexpected error has occurred.')
    expect(wrapper.find('.font-14').text()).toContain('Please try your action again.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays Awaiting Consent message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'NEED_CONSENT'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request is awaiting consent.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(false)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(true)
    wrapper.destroy()
  })

  it('displays Invalid Response message', () => {
    const wrapper = shallowMount(InvalidFilingDialog,
      {
        vuetify,
        propsData: {
          dialog: true,
          type: 'INVALID'
        }
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Filing')
    expect(wrapper.find('.font-14').text()).toBe('The Name Request is invalid.')
    expect(wrapper.find('#dialog-redirect-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-ok-button').exists()).toBe(false)
    wrapper.destroy()
  })
})
