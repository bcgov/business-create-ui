import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { getVuexStore } from '@/store'
import DissolutionFirm from '@/views/DissolutionFirm/DissolutionFirm.vue'

import { DissolutionResources } from '@/resources/'

const store = getVuexStore()
store.state.stateModel.business.foundingDate = '2022-06-07T00:00:00.000+00:00'

// Test Case Data
// GP will come soon
const dissolutionFirmTestCases = [
  {
    entityType: 'SP',
    isPremium: false,
    isStaff: false
  },
  {
    entityType: 'GP',
    isPremium: true,
    isStaff: false
  }

]

for (const test of dissolutionFirmTestCases) {
  const type = test.isPremium ? 'premium' : test.isStaff ? 'staff' : 'regular'

  describe(`Dissolution Firm view for a ${test.entityType} as a ${type} user`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      // verify page content
      expect(wrapper.find('h2').text()).toBe('Business Dissolution Date')
    })

    it('displays Effective Date Time section for corp', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        {
          entityType: test.entityType
        },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#date-picker').exists()).toBe(true)
    })

    it('displays Documents Delivery section', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#document-delivery-section').exists()).toBe(true)
    })

    it('displays Folio Number section only for premium', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        {
          entityType: test.entityType,
          accountInformation: { accountType: test.isPremium ? 'PREMIUM' : 'BASIC' }
        },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#folio-number-section').exists()).toBe(test.isPremium)
    })

    it('displays Certify section', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#certify-section').exists()).toBe(true)
    })
  })
}
