import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { RestorationReviewConfirm } from '@/views'
import { RestorationResources } from '@/resources/'
import CardHeader from '@/components/common/CardHeader.vue'
import SummaryRestoreBusiness from '@/components/Restoration/SummaryRestoreBusiness.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import Certify from '@/components/common/Certify.vue'
import StaffPayment from '@/components/common/StaffPayment.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// Test Case Data
const restorationBusinessInfo = [
  {
    entityType: CorpTypeCd.BENEFIT_COMPANY
  },
  {
    entityType: CorpTypeCd.BC_COMPANY
  },
  {
    entityType: CorpTypeCd.BC_CCC
  },
  {
    entityType: CorpTypeCd.BC_ULC_COMPANY
  },
  {
    entityType: CorpTypeCd.BEN_CONTINUE_IN
  },
  {
    entityType: CorpTypeCd.CONTINUE_IN
  },
  {
    entityType: CorpTypeCd.CCC_CONTINUE_IN
  },
  {
    entityType: CorpTypeCd.ULC_CONTINUE_IN
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

      // verify business name vcard
      let vcard = section.find('#business-name-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Business Name')
      expect(vcard.findComponent(SummaryRestoreBusiness).exists()).toBe(true)

      // verify applicant information vcard
      vcard = section.find('#applicant-information-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Applicant Information')
      expect(vcard.findComponent(ListPeopleAndRoles).exists()).toBe(true)

      // verify business information vcard
      vcard = section.find('#business-information-vcard')
      expect(vcard.findComponent(CardHeader).attributes('label')).toBe('Business Information')
      expect(vcard.findComponent(SummaryDefineCompany).exists()).toBe(true)
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
