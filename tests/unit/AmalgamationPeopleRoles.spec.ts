import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgamationPeopleRoles } from '@/views'
import { AmalgamationRegResources, AmalgamationShortResources } from '@/resources/'
import PeopleAndRoles from '@/components/common/PeopleAndRoles.vue'
import { AmalgamationTypes, FilingTypes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// Test Case Data
const amalgamationBusinessInfo = [
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

for (const test of amalgamationBusinessInfo) {
  describe(`Amalgamation-Regular People and Roles for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationPeopleRoles,
        null,
        {
          amalgamation: { type: AmalgamationTypes.REGULAR },
          entityType: test.entityType,
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: ['staff'] }
        },
        null,
        AmalgamationRegResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-people-roles').exists()).toBe(true)
    })

    it('displays the header and renders the People and Roles component correctly', () => {
      expect(wrapper.find('header h2').text()).toBe('1. Add People to your Application')
      expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)
    })
  })

  /**
   * Unit tests for Vertical will be similar to the test below
   */
  describe(`Amalgamation-Short People and Roles for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationPeopleRoles,
        null,
        {
          amalgamation: { type: AmalgamationTypes.HORIZONTAL },
          entityType: test.entityType,
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: ['staff'] }
        },
        null,
        AmalgamationShortResources
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-people-roles').exists()).toBe(true)
    })

    it('displays the header and renders the People and Roles component correctly', () => {
      expect(wrapper.find('header h2').text()).toBe('1. Add People to your Application')
      expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)
    })
  })
}
