import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationBusinessInformation } from '@/views'
import { RestorationResources } from '@/resources/'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'

// Test Case Data
const restorationBusinessInfo = [
  {
    entityType: 'CP'
  },
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

    it('renders components correctly', () => {
      wrapper = shallowWrapperFactory(RestorationBusinessInformation, null, { entityType: test.entityType })

      expect(wrapper.find('h2').text()).toBe('Registered and Records Office Addresses')

      expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
      expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    })

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
    })
  })
}
