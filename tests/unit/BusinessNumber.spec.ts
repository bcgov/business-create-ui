import Vue from 'vue'
import flushPromises from 'flush-promises'
import { Wrapper } from '@vue/test-utils'
import { getLastEvent } from '../get-last-event'
import { wrapperFactory } from '../jest-wrapper-factory'
import BusinessNumber from '@/components/Registration/BusinessNumber.vue'

const updateBusinessNumberEvent = 'update:businessNumber'
const validEvent = 'valid'

async function setValue (wrapper: Wrapper<Vue>, id: string, value: string): Promise<void> {
  const element = wrapper.find(id)
  if (element.exists()) {
    element.setValue(value)
    element.trigger('input')
    await flushPromises()
  }
}

describe('Business Number component', () => {
  let wrapper: any

  it('works as expected when there is no initial business number', async () => {
    wrapper = wrapperFactory(
      BusinessNumber,
      { businessNumber: null }
    )
    await Vue.nextTick()

    // verify no error message
    // verify events
    expect(wrapper.find('.v-messages.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    // enter an invalid business number
    // verify no error message before blur
    // verify events
    await setValue(wrapper, 'input', '123')
    expect(wrapper.find('.v-messages.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, updateBusinessNumberEvent)).toBe('123')
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    // trigger blur
    // verify error message
    // verify events
    wrapper.find('input').trigger('blur')
    await Vue.nextTick()
    expect(wrapper.find('.v-messages.error--text').text()).toBe('Invalid business number')
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    wrapper.destroy()
  })

  it('works as expected when there is a valid initial business number', async () => {
    wrapper = wrapperFactory(
      BusinessNumber,
      { businessNumber: '123456789' }
    )
    await Vue.nextTick()

    // verify no error message
    // verify events
    expect(wrapper.find('.v-messages.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    // enter an invalid business number
    // verify error message
    // verify events
    await setValue(wrapper, 'input', '123')
    expect(wrapper.find('.v-messages.error--text').text()).toBe('Invalid business number')
    expect(getLastEvent(wrapper, updateBusinessNumberEvent)).toBe('123')
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    wrapper.destroy()
  })

  it('works as expected when there is an invalid initial business number', async () => {
    wrapper = wrapperFactory(
      BusinessNumber,
      { businessNumber: '123' }
    )
    await Vue.nextTick()

    // verify error message
    // verify events
    expect(wrapper.find('.v-messages.error--text').text()).toBe('Invalid business number')
    expect(getLastEvent(wrapper, validEvent)).toBe(false)

    // enter a valid business number
    // verify no error message
    // verify events
    await setValue(wrapper, 'input', '123456789')
    expect(wrapper.find('.v-messages.error--text').exists()).toBe(false)
    expect(getLastEvent(wrapper, updateBusinessNumberEvent)).toBe('123456789')
    expect(getLastEvent(wrapper, validEvent)).toBe(true)

    wrapper.destroy()
  })

  it('displays Changed chip when the prop is set', async () => {
    wrapper = wrapperFactory(
      BusinessNumber,
      { businessNumber: '123456789', hasBusinessNumberChanged: false }
    )
    await Vue.nextTick()

    // verify no chip initially
    expect(wrapper.find('#changed-chip').exists()).toBe(false)

    // set prop
    await wrapper.setProps({ hasBusinessNumberChanged: true })

    // verify chip
    expect(wrapper.find('#changed-chip').exists()).toBe(true)

    wrapper.destroy()
  })
})
