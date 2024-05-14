import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInBusinessBc from '@/views/ContinuationIn/ContinuationInBusinessBc.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'

describe('Continuation In Business BC component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(
      ContinuationInBusinessBc,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        isPremiumAccount: () => true
      }
    )
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationInBusinessBc).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-business-bc').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header').exists()).toBe(true)
    expect(firstSection.find('header h2').text()).toBe('Company Name')
    // FUTURE: finish this ^^^

    const secondSection = wrapper.findAll('section').at(1)
    expect(secondSection.find('header').exists()).toBe(true)
    expect(secondSection.find('header h2').text()).toBe('Registered and Records Office Addresses')
    expect(secondSection.find('header p').text()).toContain('Enter the Registered Office and')
    expect(secondSection.findComponent(OfficeAddresses).exists()).toBe(true)

    const thirdSection = wrapper.findAll('section').at(2)
    expect(thirdSection.find('header').exists()).toBe(true)
    expect(thirdSection.find('header h2').text()).toBe('Registered Office Contact Information')
    expect(thirdSection.find('header p').text()).toContain('Enter the contact information for')
    expect(thirdSection.findComponent(BusinessContactInfo).exists()).toBe(true)

    const fourthSection = wrapper.findAll('section').at(3)
    expect(fourthSection.find('header').exists()).toBe(true)
    expect(fourthSection.find('header h2').text()).toBe('Folio / Reference Number (Optional)')
    expect(fourthSection.find('header p').text()).toContain('Add an optional Folio or Reference')
    expect(fourthSection.findComponent(FolioNumber).exists()).toBe(true)

    wrapper.destroy()
  })
})
