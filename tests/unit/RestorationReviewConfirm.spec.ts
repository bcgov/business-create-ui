import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationReviewConfirm } from '@/views'
import { RestorationResources } from '@/resources/'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import SummaryDefineCompany from '@/components/Incorporation/SummaryDefineCompany.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import Certify from '@/components/common/Certify.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'

// Test Case Data
const restorationBusinessInfo = [
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

for (const test of restorationBusinessInfo) {
  describe(`Restoration Review Confirm for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationReviewConfirm,
        null,
        {
          entityType: test.entityType,
          tombstone: { authRoles: ['staff'] }
        },
        null,
        RestorationResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#restoration-review-confirm').exists()).toBe(true)
    })

    it('displays Review and Confirm section', () => {
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Review and Confirm')
      expect(section.findComponent(ListPeopleAndRoles).exists()).toBe(true)
      expect(section.findComponent(SummaryDefineCompany).exists()).toBe(true)
    })

    it('displays Document Delivery section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Document Delivery')
      expect(section.findComponent(DocumentDelivery).exists()).toBe(true)
    })

    it('displays Certify section', () => {
      const section = wrapper.findAll('section').at(2)
      expect(section.find('header h2').text()).toBe('Certify')
      expect(section.findComponent(Certify).exists()).toBe(true)
    })

    it('displays Staff Payment section', () => {
      const section = wrapper.findAll('section').at(3)
      expect(section.find('header h2').text()).toBe('Staff Payment')
      expect(section.findComponent(StaffPayment).exists()).toBe(true)
    })
  })
}
