import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgamationBusinessInfo } from '@/views'
// *** FUTURE: add tests for AmalgamationShortResources
import { AmalgamationRegResources } from '@/resources/'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import { AmalgamationTypes, FilingTypes } from '@bcrs-shared-components/enums'

// Test Case Data
const amalgamationRegularBusinessInfo = [
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

for (const test of amalgamationRegularBusinessInfo) {
  describe(`Amalgamation Regular Business Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationBusinessInfo,
        null,
        {
          amalgamation: { type: AmalgamationTypes.REGULAR }, // *** FUTURE: add tests for short-form amalgamations
          entityType: test.entityType,
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: ['staff']
          }
        },
        null,
        AmalgamationRegResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-business-info').exists()).toBe(true)
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
