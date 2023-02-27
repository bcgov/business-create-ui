import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationApplicantInformation } from '@/views'
import { RestorationResources } from '@/resources/'
import RegPeopleAndRoles from '@/components/common/RegPeopleAndRoles.vue'

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
  describe(`Restoration Applicant Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationApplicantInformation,
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
      expect(wrapper.find('#restoration-applicant-information').exists()).toBe(true)
    })

    it('displays Add Applicant Information section', () => {
      const section = wrapper.find('#add-applicant-info-section')
      expect(section.find('header h2').text()).toBe('Add Applicant Information')
      expect(section.findComponent(RegPeopleAndRoles).exists()).toBe(true)
    })
  })
}
