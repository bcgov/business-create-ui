import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInAuthorization from '@/views/ContinuationIn/ContinuationInAuthorization.vue'
import ExtraproRegistration from '@/components/ContinuationIn/ExtraproRegistration.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import AuthorizationProof from '@/components/ContinuationIn/AuthorizationProof.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'

describe('Continuation In Authorization component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ContinuationInAuthorization)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationInAuthorization).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-authorization').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header').exists()).toBe(true)
    expect(firstSection.find('header h2').text()).toBe('Name')
    expect(firstSection.findComponent(NameRequestInfo).exists()).toBe(true)
    expect(firstSection.findComponent(NameTranslations).exists()).toBe(true)

    const secondSection = wrapper.findAll('section').at(1)
    expect(secondSection.find('header').exists()).toBe(true)
    expect(secondSection.find('header h2').text()).toBe('Existing Business Information')
    expect(secondSection.find('header p').text()).toContain('Enter information about')
    expect(secondSection.findComponent(ExtraproRegistration).exists()).toBe(true)

    const thirdSection = wrapper.findAll('section').at(2)
    expect(thirdSection.find('header').exists()).toBe(true)
    expect(thirdSection.find('header h2').text()).toBe('Contact Information')
    expect(thirdSection.find('header p').text()).toContain('Enter the contact information')
    expect(thirdSection.findComponent(BusinessContactInfo).exists()).toBe(true)

    const fourthSection = wrapper.findAll('section').at(3)
    expect(fourthSection.find('header').exists()).toBe(true)
    expect(fourthSection.find('header h2').text()).toBe('Proof of Authorization')
    expect(fourthSection.find('header p').text()).toContain('You must provide proof')
    expect(fourthSection.findComponent(AuthorizationProof).exists()).toBe(true)

    wrapper.destroy()
  })
})
