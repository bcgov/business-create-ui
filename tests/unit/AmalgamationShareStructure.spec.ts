import Vue from 'vue'
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgamationShareStructure } from '@/views'
import ListShareClass from '@/components/common/ListShareClass.vue'
import ShareStructure from '@/components/common/ShareStructure.vue'

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
  describe(`Amalgamation-Regular Share Structure for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = shallowWrapperFactory(
        AmalgamationShareStructure,
        null,
        {
          // *** FUTURE: add tests for regular vs short-form amalgamations
          entityType: test.entityType,
          tombstone: { keycloakRoles: ['staff'] }
        },
        null,
        null
      )
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('renders the page', () => {
      expect(wrapper.find('#amalgamation-share-structure').exists()).toBe(true)
    })

    it('displays the correct headers and text', () => {
      const firstSection = wrapper.findAll('section').at(0)
      expect(firstSection.find('header h2').text()).toBe('1. Create Your Authorized Share Structure')
      expect(firstSection.find('p').text()).toContain('Add at least one class of shares.')
      expect(firstSection.find('p').text()).toContain('A share class consists of the name of the class')

      const helpSection = wrapper.findAll('section').at(1)
      expect(helpSection.find('header h2').text()).toBe('Share Structure Help')
      expect(helpSection.find('p').text()).toContain('An amalgamated business must issue shares.')
      expect(helpSection.find('p').text()).toContain('These shares represent ownership interest in')
    })

    it('displays the ListShareClass and ShareStructure components properly', async () => {
      const vm = wrapper.vm as any

      expect(wrapper.findComponent(ListShareClass).exists()).toBe(true)

      vm.showShareStructureForm = true
      await Vue.nextTick()

      expect(wrapper.findComponent(ShareStructure).exists()).toBe(true)
    })
  })
}
