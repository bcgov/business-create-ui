import Vue from 'vue'
import { wrapperFactory } from '../jest-wrapper-factory'
import CareAndCustodySelect from '@/components/Dissolution/CareAndCustodySelect.vue'
import { DissolutionResources } from '@/resources'
import { RoleTypes } from '@/enums'

// Test Case Data
const custodianTestCases = [
  {
    entityType: 'CP'
  },
  {
    entityType: 'BEN'
  },
  {
    entityType: 'BC'
  }
]

for (const mock of custodianTestCases) {
  describe(`Care and Custody Select component for a ${mock.entityType}`, () => {
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(
        CareAndCustodySelect,
        null,
        { entityType: mock.entityType },
        null,
        DissolutionResources
      )
    })

    it('renders the component properly', () => {
      expect(wrapper.find('#care-and-custody-select').exists()).toBe(true)
    })

    it('displays the radio buttons', () => {
      expect(wrapper.find('.care-and-custody-option-list').exists()).toBe(true)
    })

    it('changes the role type selection to Liquidator when the radio button is selected', async () => {
      // Verify default model state
      expect(wrapper.vm.liquidatorOrCustodian).toBeNull()

      const custodianRadioBtn = wrapper.find('#liquidator-radio-btn')
      custodianRadioBtn.trigger('click')
      await Vue.nextTick()

      // Verify new model state
      expect(wrapper.vm.liquidatorOrCustodian).toBe(RoleTypes.LIQUIDATOR)
    })

    it('changes the role type selection to Custodian when the radio button is selected', async () => {
      // Verify default model state
      expect(wrapper.vm.liquidatorOrCustodian).toBeNull()

      const custodianRadioBtn = wrapper.find('#custodian-radio-btn')
      custodianRadioBtn.trigger('click')
      await Vue.nextTick()

      // Verify new model state
      expect(wrapper.vm.liquidatorOrCustodian).toBe(RoleTypes.CUSTODIAN)
    })
  })
}
