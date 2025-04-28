import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { RestorationApplicantInformation } from '@/views'
import { RestorationResources } from '@/resources/'
import RegPeopleAndRoles from '@/components/common/RegPeopleAndRoles.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AuthorizationRoles } from '@/enums'

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
  describe(`Restoration Applicant Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationApplicantInformation,
        null,
        {
          entityType: test.entityType,
          tombstone: { authRoles: [AuthorizationRoles.STAFF] }
        },
        null,
        RestorationResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#restoration-applicant-information').exists()).toBe(true)
    })

    it('displays Add Applicant Information section', () => {
      const section = wrapper.find('#add-applicant-info-section')
      expect(section.find('header h2').text()).toBe('Add Applicant Information')
      expect(section.findComponent(RegPeopleAndRoles).exists()).toBe(true)
    })
  })
}
