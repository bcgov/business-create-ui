import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInReviewConfirm from '@/views/ContinuationIn/ContinuationInReviewConfirm.vue'
import SummaryExtraprovincialRegistration from '@/components/ContinuationIn/SummaryExtraprovincialRegistration.vue'
import SummaryBusinessPreviousJurisdiction from '@/components/ContinuationIn/SummaryBusinessPreviousJurisdiction.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import Certify from '@/components/common/Certify.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import DocumentId from '@bcrs-shared-components/document-id/DocumentId.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { FilingStatus } from '@/enums'

describe('Continuation In Review Confirm component', () => {
  it('renders the component correctly - Review and Confirm section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed property to override computed property:
      {
        isExpro: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstSection = wrapper.findAll('section').at(0)
    expect(firstSection.find('header h2').text()).toBe('Review and Confirm')
    expect(firstSection.find('header p').text()).toContain('Review the information in your application.')

    expect(firstSection.find('#extraprovincial-registration-bc-vcard').exists()).toBe(true)
    expect(firstSection.find('#extraprovincial-registration-bc-vcard label').text())
      .toContain('Extraprovincial Registration in B.C.')
    expect(firstSection.findComponent(SummaryExtraprovincialRegistration).exists()).toBe(true)

    expect(firstSection.find('#your-business-in-previous-jurisdiction-vcard').exists()).toBe(true)
    expect(firstSection.find('#your-business-in-previous-jurisdiction-vcard label').text())
      .toContain('Your Business in Previous Jurisdiction')
    expect(firstSection.findComponent(SummaryBusinessPreviousJurisdiction).exists()).toBe(true)

    expect(firstSection.find('#your-business-in-bc-vcard').exists()).toBe(true)
    expect(firstSection.find('#your-business-in-bc-vcard label').text()).toContain('Your Business in B.C.')
    expect(firstSection.findComponent(SummaryDefineCompany).exists()).toBe(true)

    expect(firstSection.find('#people-and-roles-vcard').exists()).toBe(true)
    expect(firstSection.find('#people-and-roles-vcard label').text()).toContain('People and Roles')
    expect(firstSection.findComponent(ListPeopleAndRoles).exists()).toBe(true)

    expect(firstSection.find('#share-structure-vcard').exists()).toBe(true)
    expect(firstSection.find('#share-structure-vcard label').text()).toContain('Share Structure')
    expect(firstSection.findComponent(ListShareClass).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - Continuation Effective Date and Time section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed property to override store getter:
      {
        getFilingStatus: () => FilingStatus.DRAFT
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const secondSection = wrapper.findAll('#continuation-in-review-confirm > section').at(1)
    expect(secondSection.find('header h2').text()).toBe('Continuation Effective Date and Time')
    expect(secondSection.find('header p').text()).toContain('Select the effective date and time of')
    expect(secondSection.findComponent(EffectiveDateTime).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - Document Delivery section', async () => {
    const wrapper = wrapperFactory(ContinuationInReviewConfirm)
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const thirdSection = wrapper.findAll('#continuation-in-review-confirm > section').at(2)
    expect(thirdSection.find('header h2').text()).toBe('Document Delivery')
    expect(thirdSection.find('header p').text()).toContain('Copies of the continuation documents will')
    expect(thirdSection.findComponent(DocumentDelivery).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - Certify section', async () => {
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

  it('renders the component correctly - Court Order / POA section', async () => {
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

  it('renders the component correctly - Document ID section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed properties to override store getters:
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
    expect(sixthSection.find('header h2').text()).toBe('Document ID')
    expect(sixthSection.findComponent(DocumentId).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - Staff Payment section', async () => {
    const wrapper = wrapperFactory(
      ContinuationInReviewConfirm,
      null,
      null,
      null,
      null,
      // declare computed properties to override store getters:
      {
        isRoleStaff: () => true
      }
    )
    await Vue.nextTick()

    // verify that component exists
    expect(wrapper.findComponent(ContinuationInReviewConfirm).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-review-confirm').exists()).toBe(true)

    // spot check some content (structure / text)
    const sixthSection = wrapper.findAll('#continuation-in-review-confirm > section').at(6)
    expect(sixthSection.find('header h2').text()).toBe('Staff Payment')
    expect(sixthSection.find('header p').text()).toBe('')
    expect(sixthSection.findComponent(StaffPayment).exists()).toBe(true)

    wrapper.destroy()
  })
})
