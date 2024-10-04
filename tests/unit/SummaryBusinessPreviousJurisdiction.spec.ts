import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import SummaryBusinessPreviousJurisdiction from '@/components/ContinuationIn/SummaryBusinessPreviousJurisdiction.vue'

describe('Summary Business Home Jurisdiction component', () => {
  it('renders the component correctly - first summary', async () => {
    const wrapper = wrapperFactory(SummaryBusinessPreviousJurisdiction)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryBusinessPreviousJurisdiction).exists()).toBe(true)
    expect(wrapper.find('#summary-business-previous-jurisdiction').exists()).toBe(true)

    // spot check some content (structure / text)
    // expect(wrapper.find('.business-home-step-error-message').exists()).toBe(true)
    // expect(wrapper.find('.business-home-step-error-message span').text()).toBe('This step is unfinished.')
    // expect(wrapper.find('.business-home-step-error-message a span').text()).toBe('Return to this step to finish it')

    expect(wrapper.find('#existing-business-information-summary').exists()).toBe(true)
    const articles = wrapper.findAll('#existing-business-information-summary article')

    expect(articles.at(0).find('label').text()).toBe('Previous Jurisdiction')
    expect(articles.at(1).find('label').text()).toBe('Incorporation Number')
    expect(articles.at(2).find('label').text()).toBe('Registered Name')
    expect(articles.at(3).find('label').text()).toBe('Business Number in Previous Jurisdiction')
    expect(articles.at(4).find('label').text()).toContain('Date of Incorporation')

    wrapper.destroy()
  })

  it('renders the component correctly - second summary', async () => {
    const wrapper = wrapperFactory(SummaryBusinessPreviousJurisdiction)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryBusinessPreviousJurisdiction).exists()).toBe(true)
    expect(wrapper.find('#summary-business-previous-jurisdiction').exists()).toBe(true)

    // spot check some content (structure / text)
    // expect(wrapper.find('.business-home-step-error-message').exists()).toBe(true)
    // expect(wrapper.find('.business-home-step-error-message span').text()).toBe('This step is unfinished.')
    // expect(wrapper.find('.business-home-step-error-message a span').text()).toBe('Return to this step to finish it')

    expect(wrapper.find('#proof-of-authorization-summary').exists()).toBe(true)

    const article = wrapper.find('#proof-of-authorization-summary article')
    expect(article.find('label').text()).toBe('Proof of Authorization')

    wrapper.destroy()
  })
})
