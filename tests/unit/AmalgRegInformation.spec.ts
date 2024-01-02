import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgRegInformation } from '@/views'
import { AmalgamationRegResources } from '@/resources/'
import AmalgamatingBusinesses from '@/components/Amalgamation/AmalgamatingBusinesses.vue'
import { ExpandableHelp } from '@bcrs-shared-components/expandable-help'
import ResultingBusinessName from '@/components/Amalgamation/ResultingBusinessName.vue'
import BusinessTypeHelp from '@/components/Amalgamation/BusinessTypeHelp.vue'

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
        AmalgRegInformation,
        null,
        {
          entityType: test.entityType,
          tombstone: { keycloakRoles: ['staff'] }
        },
        null,
        AmalgamationRegResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-regular-information').exists()).toBe(true)
    })

    it('displays the Amalgamation Businesses section', () => {
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Amalgamating Businesses')
      expect(section.find('p').text()).toContain('Add the amalgamating businesses to the list.')
      expect(section.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    })

    it('displays the Resulting Business Name and Type section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Resulting Business Name and Type')
      expect(section.findComponent(ExpandableHelp).exists()).toBe(true)
      expect(section.findComponent(BusinessTypeHelp).exists()).toBe(true)
      expect(section.findComponent(ResultingBusinessName).exists()).toBe(true)
    })
  })
}
