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
  describe(`Restoration Business Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        RestorationBusinessInformation,
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
      expect(wrapper.find('#restoration-business-information').exists()).toBe(true)
    })

    it('displays header', () => {
      expect(wrapper.findAll('h2').length).toBe(2)
      expect(wrapper.findAll('h2').at(0).text()).toContain('Registered and Records Office Addresses')
      expect(wrapper.findAll('h2').at(1).text()).toContain('Registered Office Contact Information')
    })

    it('displays sub-components', () => {
      expect(wrapper.findComponent(OfficeAddresses).exists()).toBe(true)
      expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    })
  })
}
