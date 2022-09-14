import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'
import { getLastEvent } from '../get-last-event'
import { wrapperFactory } from '../jest-wrapper-factory'
import BusinessTypeConfirm from '@/components/Registration/BusinessTypeConfirm.vue'

const validEvent = 'valid'

describe('Business Type Confirm component', () => {
  let wrapper: any

  it('works as expected when there initial business type confirm is false', async () => {
    wrapper = wrapperFactory(
      BusinessTypeConfirm,
      {
        businessTypeConfirm: false,
        showErrors: false
      }
    )

    await Vue.nextTick()

    // verify no error message
    // verify events to be false
    expect(wrapper.find('.certify-stmt.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    wrapper.destroy()
  })

  it('works as expected when the business type checkbox is checked', async () => {
    wrapper = wrapperFactory(
      BusinessTypeConfirm,
      {
        businessTypeConfirm: true,
        showErrors: false
      }
    )
    await Vue.nextTick()

    // verify no error message
    // verify events to be true
    expect(wrapper.find('.certify-stmt.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    // check the business type checkbox
    // verify no error message
    // verify events
    const checkboxElement: Wrapper<Vue> = wrapper.find('input[type=checkbox]')
    checkboxElement.setChecked()
    expect(wrapper.find('.certify-stmt.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, 'update:businessTypeConfirm')).toBe(true)
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    wrapper.destroy()
  })

  it('works as expected when the business type checkbox is not checked', async () => {
    wrapper = wrapperFactory(
      BusinessTypeConfirm,
      {
        businessTypeConfirm: false,
        showErrors: true
      }
    )
    await Vue.nextTick()

    // verify error message
    // verify events to be false
    expect(wrapper.find('.certify-stmt.error--text').exists()).toBe(true)
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    // the business type checkbox is not checked
    // verify no error message
    // verify events
    const checkboxElement: Wrapper<Vue> = wrapper.find('input[type=checkbox]')
    checkboxElement.setChecked(false)
    expect(wrapper.find('.certify-stmt.error--text').exists()).toBe(true)
    expect(getLastEvent(wrapper, 'update:businessTypeConfirm')).toBe(undefined)
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    wrapper.destroy()
  })
})
