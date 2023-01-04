import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationBusinessInformation } from '@/views'
import { RestorationResources } from '@/resources/'

describe('Restoration Review Confirm view', () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
      RestorationBusinessInformation,
      null,
      null,
      null,
      RestorationResources
    )

    // verify page is rendered
    expect(wrapper.find('#restoration-business-information').exists()).toBe(true)
  })
})
