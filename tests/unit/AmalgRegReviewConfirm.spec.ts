import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgRegReviewConfirm } from '@/views'
import { AmalgamationRegResources } from '@/resources/'
import BusinessTableSummary from '@/components/Amalgamation/BusinessTableSummary.vue'
import CardHeader from '@/components/common/CardHeader.vue'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import EffectiveDateTime from '@/components/common/EffectiveDateTime.vue'
import ListShareClass from '@/components/common/ListShareClass.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import Certify from '@/components/common/Certify.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'

// Test Case Data
const amalgamationRegularBusinessInfo = [
  {
    entityType: 'BEN'
  },
  {
    entityType: 'BC'
  },
  {
    entityType: 'ULC'
  },
  {
    entityType: 'CC'
  }
]

for (const test of amalgamationRegularBusinessInfo) {
  describe(`Restoration Review Confirm for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgRegReviewConfirm,
        null,
        {
          entityType: test.entityType,
          tombstone: { keycloakRoles: ['staff'] }
        },
        null,
        AmalgamationRegResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-regular-review-confirm').exists()).toBe(true)
    })

    it('displays Review and Confirm section', async () => {
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Review and Confirm')
      expect(section.find('p').text()).toContain('Review the information in your application.')
      expect(section.find('p').text()).toContain('If you need to change or complete anything, return to the step')

      // verify amalgamation application vcard
      let vcard = section.find('#company-summary-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Amalgamation Information')
      expect(vcard.findComponent(SummaryDefineCompany).exists()).toBe(true)

      // verify amalgamating businesses information vcard
      vcard = section.find('#amalgamating-businesses-information-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Amalgamating Businesses Information')
      expect(vcard.findComponent(BusinessTableSummary).exists()).toBe(true)

      // verify people and roles vcard
      vcard = section.find('#people-and-roles-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('People and Roles')
      expect(vcard.findComponent(ListPeopleAndRoles).exists()).toBe(true)

      // verify share structure vcard
      vcard = section.find('#share-structure-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Share Structure')
      expect(vcard.findComponent(ListShareClass).exists()).toBe(true)
    })

    it('displays Amalgamation Date and Time section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Amalgamation Date and Time')
      expect(section.find('p').text()).toContain('Select the Date and Time of amalgamation for your business.')
      expect(section.findComponent(EffectiveDateTime).exists()).toBe(true)
    })

    it('displays Document Delivery section', () => {
      const section = wrapper.findAll('section').at(2)
      expect(section.find('header h2').text()).toBe('Document Delivery')
      expect(section.find('p').text()).toContain('Copies of the amalgamation documents will be sent')
      expect(section.find('p').text()).toContain('to the email addresses listed below.')
      expect(section.findComponent(DocumentDelivery).exists()).toBe(true)
    })

    // TODO
    it.skip('displays Amalgamation Statement section', () => {
      const section = wrapper.findAll('section').at(3)
      expect(section.find('header h2').text()).toBe('Amalgamation Statement')
    })

    it('displays Court Order and Plan of Arrangement section', () => {
      const section = wrapper.findAll('section').at(4)
      expect(section.find('header h2').text()).toBe('Court Order and Plan of Arrangement')
      expect(section.find('p').text()).toContain('If this filing is pursuant to a court order,')
      expect(section.find('p').text()).toContain('enter the court order number.')
      expect(section.findComponent(CourtOrderPoa).exists()).toBe(true)
    })

    it('displays Certify section', () => {
      const section = wrapper.findAll('section').at(5)
      expect(section.find('header h2').text()).toBe('Certify')
      expect(section.find('p').text()).toContain('Confirm the legal name of the person authorized')
      expect(section.find('p').text()).toContain('to complete and submit this application.')
      expect(section.findComponent(Certify).exists()).toBe(true)
    })

    it('displays Staff Payment section', () => {
      const section = wrapper.findAll('section').at(6)
      expect(section.find('header h2').text()).toBe('Staff Payment')
      expect(section.findComponent(StaffPayment).exists()).toBe(true)
    })
  })
}
