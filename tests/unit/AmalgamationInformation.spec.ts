import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgamationInformation } from '@/views'
// *** FUTURE: add tests for AmalgamationShortResources
import { AmalgamationRegResources, AmalgamationShortResources } from '@/resources/'
import AmalgamatingBusinesses from '@/components/Amalgamation/AmalgamatingBusinesses.vue'
import { ExpandableHelp } from '@bcrs-shared-components/expandable-help'
import ResultingBusinessName from '@/components/Amalgamation/ResultingBusinessName.vue'
import BusinessTypeHelp from '@/components/Amalgamation/BusinessTypeHelp.vue'
import { AmalgamationTypes, FilingTypes } from '@bcrs-shared-components/enums'

// Test Case Data
const amalgamationBusinessInfo = [
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

for (const test of amalgamationBusinessInfo) {
  describe(`Amalgamation-Regular Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationInformation,
        null,
        {
          amalgamation: { type: AmalgamationTypes.REGULAR },
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
      expect(wrapper.find('#amalgamation-information').exists()).toBe(true)
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

for (const test of amalgamationBusinessInfo) {
  describe(`Amalgamation- Short Horizontal Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationInformation,
        null,
        {
          amalgamation: { type: AmalgamationTypes.HORIZONTAL },
          entityType: test.entityType,
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: ['staff']
          }
        },
        null,
        AmalgamationShortResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-information').exists()).toBe(true)
    })

    it('displays the Amalgamation Businesses section', () => {
      console.log(wrapper.html())
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Amalgamating Businesses')
      expect(section.find('p').text()).toContain('Add the primary business and the amalgamating businesses below.')
      expect(section.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    })

    it('displays the Resulting Business Name and Type section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Resulting Business Name and Type')
      expect(section.findComponent(ResultingBusinessName).exists()).toBe(true)
    })
  })
}

for (const test of amalgamationBusinessInfo) {
  describe(`Amalgamation- Short Vertical Information for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationInformation,
        null,
        {
          amalgamation: { type: AmalgamationTypes.VERTICAL },
          entityType: test.entityType,
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: ['staff']
          }
        },
        null,
        AmalgamationShortResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-information').exists()).toBe(true)
    })

    it('displays the Amalgamation Businesses section', () => {
      const section = wrapper.findAll('section').at(0)
      expect(section.find('header h2').text()).toBe('Amalgamating Businesses')
      expect(section.find('p').text()).toContain('Add the holding business and the amalgamating businesses below.')
      expect(section.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    })

    it('displays the Resulting Business Name and Type section', () => {
      const section = wrapper.findAll('section').at(1)
      expect(section.find('header h2').text()).toBe('Resulting Business Name and Type')
      expect(section.findComponent(ResultingBusinessName).exists()).toBe(true)
    })
  })
}
