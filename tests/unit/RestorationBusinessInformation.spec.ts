import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationBusinessInformation } from '@/views'
import { RestorationResources } from '@/resources/'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'

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
  describe(`Restoration business information for a ${test.entityType}`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      const wrapper = shallowWrapperFactory(
        RestorationBusinessInformation,
        null,
        { entityType: test.entityType },
        null,
        RestorationResources
      )

      // verify page is rendered
      expect(wrapper.find('#restoration-business-information').exists()).toBe(true)

      // verify headers
      expect(wrapper.findAll('h2').length).toBe(2)
      expect(wrapper.findAll('h2').at(0).text()).toContain('Registered and Records Office Addresses')
      expect(wrapper.findAll('h2').at(1).text()).toContain('Registered Office Contact Information')

      // verify components on page are rendered
      expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
      expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    })
  })
}
