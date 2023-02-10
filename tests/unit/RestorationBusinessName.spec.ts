import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationBusinessName } from '@/views'
import { RestorationResources } from '@/resources/'
import BusinessName from '@/components/Restoration/BusinessName.vue'

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
  describe(`Restoration Business Name for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationBusinessName,
        null,
        { entityType: test.entityType },
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
    })

    it('displays Restoration Type section', () => {
      const section = wrapper.find('#restoration-type-section')
      expect(section.find('header h2').text()).toBe('Restoration Type')
    })
  })
}
