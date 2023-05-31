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
      expect(wrapper.find('#restoration-business-information').exists()).toBe(true)
    })

    it('displays Registered and Records Office Addresses section', () => {
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Registered and Records Office Addresses')
      expect(section.findComponent(OfficeAddresses).exists()).toBe(true)
    })

    it('displays Registered Office Contact Information section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Registered Office Contact Information')
      expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
    })
  })
}
