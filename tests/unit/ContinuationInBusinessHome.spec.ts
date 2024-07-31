import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInBusinessHome from '@/views/ContinuationIn/ContinuationInBusinessHome.vue'

describe('Continuation In Business Home component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ContinuationInBusinessHome)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationInBusinessHome).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-business-home').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header').exists()).toBe(true)
    expect(firstSection.find('header h2').text()).toBe('Existing Business Information')
    expect(firstSection.find('header p').text()).toContain('Enter information about')
    expect(firstSection.find('.v-card').exists()).toBe(true)
    expect(firstSection.find('.v-card #extrapro-registration').exists()).toBe(true)

    const secondSection = wrapper.findAll('section').at(1)
    expect(secondSection.find('header').exists()).toBe(true)
    expect(secondSection.find('header h2').text()).toBe('Continuation Authorization')
    expect(secondSection.find('header p').text()).toContain('You must provide proof')
    expect(secondSection.find('#continuation-authorization').exists()).toBe(true)

    wrapper.destroy()
  })
})
