import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgRegPeopleRoles } from '@/views'
import { AmalgamationRegResources } from '@/resources/'
import PeopleAndRoles from '@/components/common/PeopleAndRoles.vue'

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
        AmalgRegPeopleRoles,
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
      expect(wrapper.find('#amalgamation-regular-people-roles').exists()).toBe(true)
    })

    it('displays the header and renders the People and Roles component correctly', () => {
      expect(wrapper.find('header h2').text()).toBe('1. Add People to your Application')
      expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)
    })
  })
}
