import Vuetify from 'vuetify'
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import DissolutionFirm from '@/views/DissolutionFirm/DissolutionFirm.vue'
import { DissolutionResources } from '@/resources/'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()
store.stateModel.business.foundingDate = '2022-06-07T00:00:00.000+00:00'
store.stateModel.tombstone.keycloakRoles = ['staff']
store.stateModel.completingParty = {
  firstName: 'Wira',
  middleName: 'Rosmunda',
  lastName: 'Conrad',
  mailingAddress: null
}

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

    it('displays Completing Party section', async () => {
      wrapper = mount(
        DissolutionFirm,
        { vuetify }
      )
      expect(wrapper.find('#completing-party-section').exists()).toBe(true)
      expect(wrapper.find('#completing-party').exists()).toBe(true)
      const input1 = wrapper.find('#person__first-name')
      const input2 = wrapper.find('#person__middle-name')
      const input3 = wrapper.find('#person__last-name')
      expect(input1.exists()).toBe(true)
      expect(input2.exists()).toBe(true)
      expect(input3.exists()).toBe(true)

      // verify name lengths are valid
      await input1.setValue('Name length is okay')
      await input2.setValue('Name length is okay')
      await input3.setValue('Name length is okay')
      expect(input1.element.value).toBe('Name length is okay')
      expect(input2.element.value).toBe('Name length is okay')
      expect(input3.element.value).toBe('Name length is okay')
      const validMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(validMessages.length).toBe(0)

      // verify name lengths are invalid
      await input1.setValue('Name length is over 20')
      await input2.setValue('Name length is over 20')
      await input3.setValue('Name length is over 30 with many characters')
      const errorMessages = wrapper.findAll('#completing-party .v-messages__message')
      expect(errorMessages.length).toBe(2) // length should be 3 theoretically
      expect(errorMessages.at(0).text()).toBe('Cannot exceed 20 characters')
      expect(errorMessages.at(1).text()).toBe('Cannot exceed 20 characters')
    })
  })
}
