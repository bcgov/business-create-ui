import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationReviewConfirm } from '@/views'
import { RestorationResources } from '@/resources/'

describe('Restoration Review Confirm view', () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
      RestorationReviewConfirm,
      null,
      null,
      null,
      RestorationResources
    )

    // verify page is rendered
    expect(wrapper.find('#restoration-review-confirm').exists()).toBe(true)
  })
})
