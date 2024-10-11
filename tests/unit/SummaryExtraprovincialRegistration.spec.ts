import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import SummaryExtraprovincialRegistration from '@/components/ContinuationIn/SummaryExtraprovincialRegistration.vue'

describe('Summary Business Home Jurisdiction component', () => {
  it('renders the component correctly - first summary', async () => {
    const wrapper = wrapperFactory(
      SummaryExtraprovincialRegistration,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        isExpro: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(SummaryExtraprovincialRegistration).exists()).toBe(true)
    expect(wrapper.find('#summary-extraprovincial-registration').exists()).toBe(true)

    // spot check some content (structure / text)
    // expect(wrapper.find('.business-home-step-error-message').exists()).toBe(true)
    // expect(wrapper.find('.business-home-step-error-message span').text()).toBe('This step is unfinished.')
    // expect(wrapper.find('.business-home-step-error-message a span').text()).toBe('Return to this step to finish it')

    const articles = wrapper.findAll('article')
    expect(articles.length).toBe(4)

    expect(articles.at(0).find('label').text()).toBe('Registration Number in B.C.')
    expect(articles.at(1).find('label').text()).toBe('Registered Name in B.C.')
    expect(articles.at(2).find('label').text()).toBe('Date of Registration in B.C.')
    expect(articles.at(3).find('label').text()).toBe('Confirmation')

    wrapper.destroy()
  })
})
