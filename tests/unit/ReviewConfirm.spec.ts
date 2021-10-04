import { shallowWrapperFactory } from '../jest-wrapper-factory'
import ReviewConfirm from '@/views/Incorporations/ReviewConfirm.vue'

// Test Case Data
const reviewConfirmTestCases = [
  {
    entityType: 'CP',
    headerTitle: 'Review',
    hasStatement: false,
    statement: ''
  },
  {
    entityType: 'BEN',
    headerTitle: 'Review',
    hasStatement: true,
    statement: 'This company is a benefit company'
  }
]

for (const test of reviewConfirmTestCases) {
  describe(`Review Confirm view for a ${test.entityType}`, () => {
    let wrapper: any

    it('renders the component properly', () => {
      wrapper = shallowWrapperFactory(ReviewConfirm, null, { entityType: test.entityType })

      // verify page content
      expect(wrapper.find('h2').text()).toContain(test.headerTitle)
    })

    it('displays benefit company statement', () => {
      wrapper = shallowWrapperFactory(ReviewConfirm, null, { entityType: test.entityType })

      expect(wrapper.find('.company-statement').exists()).toBe(test.hasStatement)

      if (test.hasStatement) {
        expect(wrapper.find('.company-statement p').text()).toContain(test.statement)
      }
    })
    // FUTURE: Expand unit testing for validation on step 5. Include routing to appropriate steps from error links.
  })
}
