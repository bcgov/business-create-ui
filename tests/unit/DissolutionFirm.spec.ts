import Vuetify from 'vuetify'
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import DissolutionFirm from '@/views/DissolutionFirm/DissolutionFirm.vue'
import { DissolutionResources } from '@/resources/'
import { AuthorizationRoles, AuthorizedActions } from '@/enums'

const vuetify = new Vuetify({})

setActivePinia(createPinia())
const store = useStore()

// init store
store.stateModel.business.foundingDate = '2022-06-07T00:00:00.000+00:00'
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
    isStaff: false
  },
  {
    entityType: 'SP',
    isStaff: true
  },
  {
    entityType: 'GP',
    isStaff: false
  },
  {
    entityType: 'GP',
    isStaff: true
  }
]

for (const test of dissolutionFirmTestCases) {
  const type = test.isStaff ? 'staff' : 'regular'

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

    it('displays Folio Number section for non-staff only', () => {
      wrapper = shallowWrapperFactory(
        DissolutionFirm,
        null,
        {
          entityType: test.entityType,
          tombstone: { authRoles: test.isStaff ? [AuthorizationRoles.STAFF] : [] }
        },
        null,
        DissolutionResources
      )

      // Folio Number is mutually exclusive with Staff Payment
      expect(wrapper.find('#folio-number-section').exists()).toBe(!test.isStaff)
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
      store.setAuthRoles(test.isStaff ? [AuthorizationRoles.STAFF] : [])

      wrapper = mount(
        DissolutionFirm,
        { vuetify }
      )

      const isFirmEditableCompletingParty: boolean =
        wrapper.vm.IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)

      expect(wrapper.find('#completing-party-section').exists()).toBe(true)
      expect(wrapper.find('#completing-party').exists()).toBe(true)
      const input1 = wrapper.find('#person__first-name')
      const input2 = wrapper.find('#person__middle-name')
      const input3 = wrapper.find('#person__last-name')
      expect(input1.exists()).toBe(isFirmEditableCompletingParty)
      expect(input2.exists()).toBe(isFirmEditableCompletingParty)
      expect(input3.exists()).toBe(isFirmEditableCompletingParty)

      // fields are onlly editable when authorized
      if (isFirmEditableCompletingParty) {
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
      }
    })

    it('display correct date rules', async () => {
      wrapper = mount(
        DissolutionFirm,
        { vuetify }
      )
      const rules = wrapper.vm.startDateRules
      store.stateModel.business.foundingDate = '2022-06-06T23:59:59.000+00:00'
      store.setCurrentJsDate(new Date('2022-06-14T00:00:00.000'))

      expect(rules[0]('')).toBe('Dissolution date is required') // no date is selected
      expect(rules[0]('October 16, 2023')).toBe(true) // date is selected
      // A date before the registration date is selected (invalid)
      expect(rules[1]('June 5, 2022')).toContain('Dissolution Date must be after June 6, 2022 and up to')
      expect(rules[1]('June 5, 2022')).toContain('June 14, 2022')
      // A valid date is selected (on registration date)
      expect(rules[1]('June 6, 2022')).toBe(true)
      // A valid date is selected (after registration date and not in the future)
      expect(rules[1]('June 7, 2022')).toBe(true)
      // An invalid date is selected (in the future)
      expect(rules[1]('September 7, 2022')).toContain('Dissolution Date must be after June 6, 2022 and up to')
      expect(rules[1]('September 7, 2022')).toContain('June 14, 2022')
    })
  })
}
