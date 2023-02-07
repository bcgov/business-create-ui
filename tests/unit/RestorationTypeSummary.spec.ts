import { shallowWrapperFactory } from '../jest-wrapper-factory'
import RestorationTypeSummary from '@/components/Restoration/RestorationTypeSummary.vue'

describe(`Initialize Restoration Type Component`, () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
        RestorationTypeSummary
    )

    // verify the component is rendered
    expect(wrapper.find('#restoration-type-summary').exists()).toBe(true)
  })
})
