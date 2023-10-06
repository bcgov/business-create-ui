import { wrapperFactory } from '../vitest-wrapper-factory'
import RuleListItem from '@/components/common/RuleListItem.vue'

describe('Rule List Item component', () => {
  it('Displays initial state', () => {
    const wrapper = wrapperFactory(
      RuleListItem,
      {
        valid: false,
        showErrors: false,
        text: 'Initial rule'
      }
    )

    expect(wrapper.findComponent(RuleListItem).exists()).toBe(true)
    expect(wrapper.find('.rule-initial').exists()).toBe(true)
    expect(wrapper.find('.rule-text').text()).toBe('Initial rule')

    wrapper.destroy()
  })

  it('Displays error state', () => {
    const wrapper = wrapperFactory(
      RuleListItem,
      {
        valid: false,
        showErrors: true,
        text: 'Error rule'
      }
    )

    expect(wrapper.findComponent(RuleListItem).exists()).toBe(true)
    expect(wrapper.find('.rule-invalid').exists()).toBe(true)
    expect(wrapper.find('.rule-text').text()).toBe('Error rule')

    wrapper.destroy()
  })

  it('Displays valid state', () => {
    const wrapper = wrapperFactory(
      RuleListItem,
      {
        valid: true,
        showErrors: true,
        text: 'Valid rule'
      }
    )

    expect(wrapper.findComponent(RuleListItem).exists()).toBe(true)
    expect(wrapper.find('.rule-valid').exists()).toBe(true)
    expect(wrapper.find('.rule-text').text()).toBe('Valid rule')

    wrapper.destroy()
  })
})
