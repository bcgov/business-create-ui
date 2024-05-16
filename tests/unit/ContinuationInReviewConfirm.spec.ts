/* eslint-disable max-len */
import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInReviewConfirm from '@/views/ContinuationIn/ContinuationInReviewConfirm.vue'
import SummaryBusinessHomeJurisdiction from '@/components/ContinuationIn/SummaryBusinessHomeJurisdiction.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import StaffPayment from '@/components/common/StaffPayment.vue'

describe('Continuation In Review Confirm component', () => {
  it('renders the component correctly - first section', async () => {
    const wrapper = wrapperFactory(ContinuationInReviewConfirm)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header h2').text()).toBe('Review and Confirm')
    expect(firstSection.find('header p').text()).toContain('Review the information in your application.')
    expect(firstSection.find('#your-business-in-home-jurisdiction-vcard').exists()).toBe(true)
    expect(firstSection.find('#your-business-in-home-jurisdiction-vcard label').text()).toContain('Your Business in Home Jurisdiction')
    expect(firstSection.findComponent(SummaryBusinessHomeJurisdiction).exists()).toBe(true)
    expect(firstSection.find('#your-business-in-bc-vcard').exists()).toBe(true)
    expect(firstSection.find('#your-business-in-bc-vcard label').text()).toContain('Your Business in BC')
    expect(firstSection.findComponent(SummaryDefineCompany).exists()).toBe(true)
    expect(firstSection.find('#people-and-roles-vcard').exists()).toBe(true)
    expect(firstSection.find('#people-and-roles-vcard label').text()).toContain('People and Roles')
    expect(firstSection.findComponent(ListPeopleAndRoles).exists()).toBe(true)
    expect(firstSection.find('#share-structure-vcard').exists()).toBe(true)
    expect(firstSection.find('#share-structure-vcard label').text()).toContain('Share Structure')
    expect(firstSection.findComponent(ListShareClass).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - second section', async () => {
    const wrapper = wrapperFactory(ContinuationInReviewConfirm)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const secondSection = wrapper.findAll('#continuation-in-review-confirm > section').at(1)
    expect(secondSection.find('header h2').text()).toBe('Continuation Effective Date and Time')
    expect(secondSection.find('header p').text()).toContain('Select the Date and Time of incorporation for')
    expect(secondSection.findComponent(EffectiveDateTime).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - third section', async () => {
    const wrapper = wrapperFactory(ContinuationInReviewConfirm)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const thirdSection = wrapper.findAll('#continuation-in-review-confirm > section').at(2)
    expect(thirdSection.find('header h2').text()).toBe('Document Delivery')
    expect(thirdSection.find('header p').text()).toContain('Copies of the incorporation documents will')
    expect(thirdSection.findComponent(DocumentDelivery).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - fourth section', async () => {
    const wrapper = wrapperFactory(ContinuationInReviewConfirm)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const fourthSection = wrapper.findAll('#continuation-in-review-confirm > section').at(3)
    expect(fourthSection.find('header h2').text()).toBe('Certify')
    expect(fourthSection.find('header p').text()).toContain('Confirm the legal name of the person authorized')
    expect(fourthSection.findComponent(Certify).exists()).toBe(true)

    wrapper.destroy()
  })

  it.skip('renders the component correctly - fifth section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        isRoleStaff: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const fifthSection = wrapper.findAll('#continuation-in-review-confirm > section').at(4)
    expect(fifthSection.find('header h2').text()).toBe('Court Order and Plan of Arrangement')
    expect(fifthSection.find('header p').text()).toContain('If this filing is pursuant to a court order')
    expect(fifthSection.findComponent(CourtOrderPoa).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - sixth section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        isRoleStaff: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const sixthSection = wrapper.findAll('#continuation-in-review-confirm > section').at(5)
    expect(sixthSection.find('header h2').text()).toBe('Staff Payment')
    expect(sixthSection.find('header p').text()).toBe('')
    expect(sixthSection.findComponent(StaffPayment).exists()).toBe(true)

    wrapper.destroy()
  })
})
