import { shallowWrapperFactory, wrapperFactory } from '../vitest-wrapper-factory'
import IncorporationReviewConfirm from '@/views/Incorporation/IncorporationReviewConfirm.vue'
import { IncorporationResources } from '@/resources/'
import SummaryDefineCompany from '@/components/common/SummaryDefineCompany.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import Certify from '@/components/common/Certify.vue'
import ConfirmCompletion from '@/components/common/ConfirmCompletion.vue'
import { AuthorizationRoles } from '@/enums'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { setAuthRole } from '../set-auth-role'
import * as FeatureFlags from '@/utils/feature-flag-utils'

setActivePinia(createPinia())
const store = useStore()
store.stateModel.tombstone.userFirstname = 'Test'
store.stateModel.tombstone.userLastname = 'User'

vi.mock('@/utils/feature-flags', () => {
  // we just care about this one function
  return { GetFeatureFlag: vi.fn() }
})

// Test Case Data
const reviewConfirmTestCases = [
  {
    entityType: 'CP',
    isStaff: true
  },
  {
    entityType: 'CP',
    isStaff: false
  },
  {
    entityType: 'BEN',
    isStaff: true
  },
  {
    entityType: 'BEN',
    isStaff: false
  },
  {
    entityType: 'ULC',
    isStaff: true
  },
  {
    entityType: 'ULC',
    isStaff: false
  },
  {
    entityType: 'BC',
    isStaff: true
  },
  {
    entityType: 'BC',
    isStaff: false
  },
  {
    entityType: 'CC',
    isStaff: true
  },
  {
    entityType: 'CC',
    isStaff: false
  }
]

for (const test of reviewConfirmTestCases) {
  describe(`Review Confirm view for a ${test.entityType}`, () => {
    let wrapper: any
    vi.spyOn(FeatureFlags, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-new-feature') return 'incorporationApplication-completingParty'
      return null
    })

    beforeEach(() => {
      // reset completedBy
      store.stateModel.confirmCompletionState.completedBy = ''
    })

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(IncorporationReviewConfirm, null, { entityType: test.entityType })

      // verify page content
      expect(wrapper.find('h2').text()).toBe('Review and Confirm')

      // verify Define company component displayed
      expect(wrapper.findComponent(SummaryDefineCompany).exists()).toBe(true)

      // verify People and roles component displayed
      expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(true)

      if (test.entityType !== 'CP') {
        // verify Confirm Completion component displayed
        expect(wrapper.findComponent(ConfirmCompletion).exists()).toBe(true)
      } else {
        // verify Confirm Completion component is not displayed
        expect(wrapper.findComponent(ConfirmCompletion).exists()).toBe(false)
      }

      // verify Certify component displayed
      expect(wrapper.findComponent(Certify).exists()).toBe(true)
    })

    it('displays Confirm Completion section', () => {
      setAuthRole(store, test.isStaff ? AuthorizationRoles.STAFF : null)
      wrapper = wrapperFactory(
        IncorporationReviewConfirm,
        null,
        { entityType: test.entityType },
        null,
        IncorporationResources
      )

      const confirmCompletion = wrapper.find('#confirm-completion-section')
      if (test.entityType === 'CP') {
        expect(confirmCompletion.exists()).toBe(false)
      } else {
        expect(confirmCompletion.exists()).toBe(true)
        expect(confirmCompletion.find('header h2').text()).toBe('Completing Party Statement')
        expect(confirmCompletion.find('p').text()).toBe(
          'The following information must be completed and confirmed before submitting this filing.')
        const compPartyTextField = confirmCompletion.find('#completing-party-textfield')
        const stmnts = confirmCompletion.findAll('p.stmt-text')
        expect(stmnts.length).toBe(1)
        if (test.isStaff) {
          expect(compPartyTextField.exists()).toBe(true)
          expect(stmnts.at(0).text()).toContain(
            'I, [Legal name of completing party], the completing party, have examined the ' +
            'incorporation agreement and articles applicable to the company being ' +
            'incorporated and confirm the following:')
        } else {
          expect(compPartyTextField.exists()).toBe(false)
          expect(stmnts.at(0).text()).toContain(
            'I, Test User, the completing party, have examined the ' +
            'incorporation agreement and articles applicable to the company being ' +
            'incorporated and confirm the following:')
        }
        expect(stmnts.at(0).text()).toContain(
          '(a) a signature line exists for each incorporator,  ' +
          '(b) each signature line contains an original signature, and  ' +
          '(c) I have no reason to believe any signature is not that of the identified incorporator.'
        )
      }
    })

    it('displays Certify section', () => {
      setAuthRole(store, test.isStaff ? AuthorizationRoles.STAFF : null)
      wrapper = wrapperFactory(
        IncorporationReviewConfirm,
        null,
        { entityType: test.entityType },
        null,
        IncorporationResources
      )

      const certifySection = wrapper.find('#certify-section')
      expect(certifySection.exists()).toBe(true)

      if (test.entityType !== 'CP') {
        expect(certifySection.find('header h2').text()).toBe('Certify')
        expect(certifySection.find('p').text()).toContain(
          'Certify your authorization to complete and submit this filing.')

        if (test.isStaff) {
          expect(certifySection.find('.certify-stmt').text()).toContain(
            '[Completing Party] certifies that the information provided is correct')
        } else {
          expect(certifySection.find('.certify-stmt').text()).toContain(
            'I certify that the information provided is correct')
        }

        const clauses = certifySection.findAll('.certify-clause')
        expect(clauses.length).toBe(2)
        expect(clauses.at(0).text()).toBe('Date:')
        expect(clauses.at(1).text()).toBe(
          'Note: It is an offence to make a false or misleading statement ' +
          'in respect of a material fact in a record submitted to the ' +
          'Corporate Registry for filing. See section 427 of the Business Corporations Act.')
      }
    })

    it('displays Court Order and POA only for BEN, ULC, CC, BC; and only for staff', () => {
      setAuthRole(store, test.isStaff ? AuthorizationRoles.STAFF : null)
      wrapper = shallowWrapperFactory(
        IncorporationReviewConfirm,
        null,
        { entityType: test.entityType },
        null,
        IncorporationResources
      )

      const shouldBeVisible = ['BEN', 'ULC', 'CC', 'BC'].includes(test.entityType) && test.isStaff
      expect(wrapper.find('#court-order-poa-section').exists()).toBe(shouldBeVisible)
    })

    it('displays Staff Payment section only for staff', () => {
      setAuthRole(store, test.isStaff ? AuthorizationRoles.STAFF : null)
      wrapper = shallowWrapperFactory(
        IncorporationReviewConfirm,
        null,
        { entityType: test.entityType },
        null,
        IncorporationResources
      )
    })
    // FUTURE: Expand unit testing for validation on step 5. Include routing to appropriate steps from error links.
  })
}
