import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { RegistrationReviewConfirm } from '@/views'
import { RegistrationResources } from '@/resources'
import { AuthorizationRoles } from '@/enums'

// Test Case Data
const reviewConfirmTestCases = [
  {
    entityType: 'SP',
    isStaff: false
  },
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
    isStaff: false
  },
  {
    entityType: 'GP',
    isStaff: true
  }
]

for (const test of reviewConfirmTestCases) {
  const type = test.isStaff ? 'staff' : 'regular'

  describe(`Registration Review and Confirm view for a ${test.entityType} as a ${type} user`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('h2').text()).toBe('Review and Confirm')
    })

    it('displays Documents Delivery section', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('#document-delivery-section').exists()).toBe(true)
    })

    it('displays Folio number section', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType,
          accountInformation: { accountType: 'PREMIUM' }
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('#folio-section').exists()).toBe(true)
    })

    it('displays Staff Payment section only for staff', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType,
          tombstone: { authRoles: test.isStaff ? [AuthorizationRoles.STAFF] : [] }
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('#staff-payment-section').exists()).toBe(test.isStaff)
    })
  })
}
