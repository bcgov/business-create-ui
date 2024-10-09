import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import SummaryBusinessPreviousJurisdiction from '@/components/ContinuationIn/SummaryBusinessPreviousJurisdiction.vue'

describe('Summary Business Home Jurisdiction component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(
      SummaryBusinessPreviousJurisdiction,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        getExistingBusinessInfo: () => ({ affidavitFileName: 'test.pdf' })
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryBusinessPreviousJurisdiction).exists()).toBe(true)
    expect(wrapper.find('#summary-business-previous-jurisdiction').exists()).toBe(true)

    // spot check some content (structure / text)

    // first block
    expect(wrapper.find('#existing-business-information-summary').exists()).toBe(true)
    const articles = wrapper.findAll('#existing-business-information-summary article')
    expect(articles.length).toBe(5)
    expect(articles.at(0).find('label').text()).toBe('Previous Jurisdiction')
    expect(articles.at(1).find('label').text()).toBe('Incorporation Number')
    expect(articles.at(2).find('label').text()).toBe('Registered Name')
    expect(articles.at(3).find('label').text()).toBe('Business Number in Previous Jurisdiction')
    expect(articles.at(4).find('label').text()).toContain('Date of Incorporation')

    // second block
    expect(wrapper.find('#proof-of-authorization-summary').exists()).toBe(true)
    let article = wrapper.find('#proof-of-authorization-summary article')
    expect(article.find('label').text()).toBe('Proof of Authorization')

    // third block
    expect(wrapper.find('#ab-ulc-information-summary').exists()).toBe(true)
    article = wrapper.find('#ab-ulc-information-summary article')
    expect(article.find('label').text()).toBe('Alberta Unlimited Liability Corporation Information')

    wrapper.destroy()
  })
})
