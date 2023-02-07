import { shallowWrapperFactory } from '../jest-wrapper-factory'
import RestorationType from '@/components/Restoration/RestorationType.vue'
import { RelationshipsPanel } from '@bcrs-shared-components/relationships-panel'
import { LimitedRestorationPanel } from '@bcrs-shared-components/limited-restoration-panel'

describe(`Initialize Restoration Type Component`, () => {
  it('renders the component properly', () => {
    const wrapper = shallowWrapperFactory(
      RestorationType
    )

    // verify the component is rendered
    expect(wrapper.find('#restoration-type').exists()).toBe(true)

    // verify sub-components on page are rendered
    // expect(wrapper.findComponent(RelationshipsPanel).exists()).toBe(true)
    // expect(wrapper.findComponent(LimitedRestorationPanel).exists()).toBe(true)
  })
})
