import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { ReviewConfirmDissolution } from '@/views/Dissolutions'

// Test Case Data
const reviewConfirmTestCases = [
  {
    entityType: 'CP',
    headerTitle: 'Review and Confirm',
    hasEffectiveDateTime: false
  },
  {
    entityType: 'BEN',
    headerTitle: 'Review and Confirm',
    hasEffectiveDateTime: true
  }
]

for (const test of reviewConfirmTestCases) {
  describe(`Review Confirm view for a ${test.entityType}`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(ReviewConfirmDissolution, null, { entityType: test.entityType })

      // verify page content
      expect(wrapper.find('h2').text()).toContain(test.headerTitle)
    })

    it('displays Effective Date Time section', () => {
      wrapper = shallowWrapperFactory(ReviewConfirmDissolution, null, { entityType: test.entityType })

      if (test.hasEffectiveDateTime) {
        expect(wrapper.find('#effective-date-time').exists()).toBe(true)
      }
    })

    it('displays Affidavit section', () => {
      wrapper = shallowWrapperFactory(ReviewConfirmDissolution, null, { entityType: test.entityType })

      expect(wrapper.find('#affidavit-summary').exists()).toBe(true)
    })

    // FUTURE: Expand unit testing for validation on step 5. Include routing to appropriate steps from error links.
  })
}
