import Vue from 'vue'
import { shallowWrapperFactory, wrapperFactory } from '../jest-wrapper-factory'
import { CooperativeType } from '@/components/DefineCompany'

// Test Case Data
const cooperativeTypeCases = [
  {
    entityType: 'CP'
  },
  {
    entityType: 'BEN'
  }
]

// Conditional check for specific test scenarios
const itIf = (condition) => condition ? it : it.skip

for (const mock of cooperativeTypeCases) {
  describe(`Cooperative Type component for a ${mock.entityType}`, () => {
    let wrapper: any

    itIf(['BEN', 'ULC', 'CCC'].includes(mock.entityType))(`does not render the component`,
      () => {
        wrapper = shallowWrapperFactory(CooperativeType, null, { entityType: mock.entityType })
        expect(wrapper.find('#cooperative-type').exists()).toBe(true)
      })

    if (['CP'].includes(mock.entityType)) {
      it('renders the component properly for a Coop', () => {
        wrapper = shallowWrapperFactory(CooperativeType, null, { entityType: mock.entityType })
        expect(wrapper.find('#cooperative-type').exists()).toBe(true)
      })

      it('displays labels', () => {
        wrapper = wrapperFactory(CooperativeType, null, { entityType: mock.entityType })
        expect(wrapper.findAll('label').at(0).text()).toBe('Select Type')
        expect(wrapper.find('#cooperative-type').text()).toContain('Select Type Cooperative Association Type')
      })

      it('displays error message when prompted', async () => {
        wrapper = wrapperFactory(CooperativeType,
          { showErrors: false },
          { entityType: mock.entityType }
        )

        await wrapper.setProps({ showErrors: true })

        await Vue.nextTick()
        expect(wrapper.find('#cooperative-type').text()).toContain('This field is required')
      })
    }

    // it('displays Not Entered text when computed values are absent', () => {
    //   mock.tombstone.userEmail = ''
    //   mock.defineCompanyStep.businessContact.email = ''
    //
    //   wrapper = shallowWrapperFactory(CooperativeType, null, {
    //     entityType: mock.entityType,
    //     tombstone: mock.tombstone,
    //     defineCompanyStep: mock.defineCompanyStep
    //   })
    //   expect(wrapper.find('#completing-party-email').text()).toBe('Not entered')
    //   expect(wrapper.find('#office-email').text()).toBe('Not entered')
    // })
  })
}
