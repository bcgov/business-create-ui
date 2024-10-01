/* eslint-disable max-len */
import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import SummaryBusinessHomeJurisdiction from '@/components/ContinuationIn/SummaryBusinessHomeJurisdiction.vue'

describe('Summary Business Home Jurisdiction component', () => {
  it('renders the component correctly - first summary', async () => {
    const wrapper = wrapperFactory(
      SummaryBusinessHomeJurisdiction,
      null,
      null,
      null,
      null,
      {
        isLookup: () => true,
        isExpro: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryBusinessHomeJurisdiction).exists()).toBe(true)
    expect(wrapper.find('#summary-business-home-jurisdiction').exists()).toBe(true)

    // spot check some content (structure / text)
    // expect(wrapper.find('.business-home-step-error-message').exists()).toBe(true)
    // expect(wrapper.find('.business-home-step-error-message span').text()).toBe('This step is unfinished.')
    // expect(wrapper.find('.business-home-step-error-message a span').text()).toBe('Return to this step to finish it')

    expect(wrapper.find('#existing-business-information-summary').exists()).toBe(true)
    const articles = wrapper.findAll('#existing-business-information-summary article')

    expect(articles.at(0).find('label').text()).toBe('Home Jurisdiction')
    expect(articles.at(1).find('label').text()).toBe('Registration Number in B.C.')
    expect(articles.at(2).find('label').text()).toBe('Name in B.C.')
    expect(articles.at(3).find('label').text()).toBe('Date of Registration in B.C.')
    expect(articles.at(4).find('label').text()).toBe('Identifying Number in Home Jurisdiction')
    expect(articles.at(5).find('label').text()).toBe('Name in Home Jurisdiction')
    expect(articles.at(6).find('label').text()).toBe('Date of Incorporation')
    expect(articles.at(7).find('label').text()).toBe('Business Number')

    wrapper.destroy()
  })

  it('renders the component correctly - second summary', async () => {
    const wrapper = wrapperFactory(SummaryBusinessHomeJurisdiction)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryBusinessHomeJurisdiction).exists()).toBe(true)
    expect(wrapper.find('#summary-business-home-jurisdiction').exists()).toBe(true)

    // spot check some content (structure / text)
    // expect(wrapper.find('.business-home-step-error-message').exists()).toBe(true)
    // expect(wrapper.find('.business-home-step-error-message span').text()).toBe('This step is unfinished.')
    // expect(wrapper.find('.business-home-step-error-message a span').text()).toBe('Return to this step to finish it')

    expect(wrapper.find('#continuation-authorization-summary').exists()).toBe(true)

    const articles = wrapper.findAll('#continuation-authorization-summary article')
    expect(articles.at(0).find('label').text()).toBe('Continuation Authorization')
    expect(articles.at(1).find('label').text()).toBe('Authorization Date')

    wrapper.destroy()
  })
})
