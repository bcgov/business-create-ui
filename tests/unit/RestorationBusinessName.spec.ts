import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationBusinessName } from '@/views'
import { RestorationResources } from '@/resources/'

describe('Restoration Review Confirm view', () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
      RestorationBusinessName,
      null,
      null,
      null,
      RestorationResources
    )

    // verify page is rendered
    expect(wrapper.find('#restoration-business-name').exists()).toBe(true)
  })
})
