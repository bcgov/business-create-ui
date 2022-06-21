import { shallowWrapperFactory, wrapperFactory } from '../jest-wrapper-factory'
import { getVuexStore } from '@/store'
import { RegistrationReviewConfirm } from '@/views'
import { RegistrationResources } from '@/resources'

const store = getVuexStore()

// Test Case Data
const reviewConfirmTestCases = [
  {
    entityType: 'SP',
    isPremium: false,
    isStaff: false
  },
  {
    entityType: 'SP',
    isPremium: true,
    isStaff: false
  },
  {
    entityType: 'SP',
    isPremium: false,
    isStaff: true
  },
  {
    entityType: 'GP',
    isPremium: false,
    isStaff: false
  },
  {
    entityType: 'GP',
    isPremium: true,
    isStaff: false
  },
  {
    entityType: 'GP',
    isPremium: false,
    isStaff: true
  }
]

for (const test of reviewConfirmTestCases) {
  const type = test.isPremium ? 'premium' : test.isStaff ? 'staff' : 'regular'

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

    it('displays Folio number section for premium users', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType,
          accountInformation: { accountType: test.isPremium ? 'PREMIUM' : 'BASIC' }
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('#folio-section').exists()).toBe(test.isPremium)
    })

    it('displays Staff Payment section only for staff', () => {
      wrapper = shallowWrapperFactory(
        RegistrationReviewConfirm,
        null,
        {
          entityType: test.entityType,
          tombstone: { authRoles: test.isStaff ? ['staff'] : [] }
        },
        null,
        RegistrationResources
      )

      expect(wrapper.find('#staff-payment-section').exists()).toBe(test.isStaff)
    })
  })
}
