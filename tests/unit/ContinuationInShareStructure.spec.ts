import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInShareStructure from '@/views/ContinuationIn/ContinuationInShareStructure.vue'

describe('Continuation In Share Structure component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ContinuationInShareStructure)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationInShareStructure).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-share-structure').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header h2').text()).toBe('1. Create Your Authorized Share Structure')
    expect(firstSection.find('p').text()).toContain('Add at least one class of shares. A share')

    expect(wrapper.find('.help-btn').exists()).toBe(true)
    expect(wrapper.find('.help-btn span').text()).toBe('Help with Share Structure')

    const secondSection = wrapper.findAll('section').at(1)
    expect(secondSection.isVisible()).toBe(false)
    expect(secondSection.find('header h2').text()).toBe('Share Structure Help')
    // FUTURE: verify some help content

    // NB: third section is in the help block

    const fourthSection = wrapper.findAll('section').at(3)
    expect(fourthSection.find('div').text()).toBe('Your application must include the following:')

    expect(wrapper.find('#btn-start-add-cp').exists()).toBe(true)
    wrapper.destroy()
  })

  // FUTURE: exercise this page by adding/deleting/listing share classes and series
})
