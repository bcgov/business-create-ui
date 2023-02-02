import { shallowWrapperFactory } from '../jest-wrapper-factory'
import { RestorationApplicantInformation } from '@/views'
import { RestorationResources } from '@/resources/'

describe('Restoration Review Confirm view', () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
      RestorationApplicantInformation,
      null,
      null,
      null,
      RestorationResources
    )

    // verify page is rendered
    expect(wrapper.find('#restoration-applicant-information').exists()).toBe(true)
  })
})
