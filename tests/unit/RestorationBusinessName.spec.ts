import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { RestorationBusinessName } from '@/views'
import { RestorationResources } from '@/resources/'
import ApprovalType from '@/components/Restoration/ApprovalType.vue'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import BusinessType from '@/components/Restoration/BusinessType.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'
import RestorationType from '@/components/Restoration/RestorationType.vue'
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
  describe(`Restoration Business Name for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationBusinessName,
        null,
        {
          entityType: test.entityType,
          tombstone: { keycloakRoles: ['staff'] }
        },
        null,
        RestorationResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#restoration-business-name').exists()).toBe(true)
    })

    it('displays Name section', () => {
      const section = wrapper.find('#name-section')
      expect(section.find('header h2').text()).toBe('Name')
      expect(section.findComponent(BusinessName).exists()).toBe(true)
      expect(section.findComponent(BusinessType).exists()).toBe(true)
      expect(section.findComponent(NameTranslations).exists()).toBe(true)
    })

    it('displays Restoration Type section', () => {
      const section = wrapper.find('#restoration-type-section')
      expect(section.find('header h2').text()).toBe('Restoration Type')
      expect(section.findComponent(RestorationType).exists()).toBe(true)
      expect(section.findComponent(ApprovalType).exists()).toBe(true)
    })
  })
}
