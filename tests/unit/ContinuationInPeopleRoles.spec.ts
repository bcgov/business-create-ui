import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationInPeopleRoles from '@/views/ContinuationIn/ContinuationInPeopleRoles.vue'
import PeopleAndRoles from '@/components/common/PeopleAndRoles.vue'
import { ContinuationInResources } from '@/resources'

describe('Continuation In People Roles component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(
      ContinuationInPeopleRoles,
      null,
      { entityType: 'C' },
      null,
      ContinuationInResources

    )
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationInPeopleRoles).exists()).toBe(true)
    expect(wrapper.find('#continuation-in-people-roles').exists()).toBe(true)

    // spot check some content (structure / text)
    expect(wrapper.find('section header h2').text()).toBe('1. Add People to your Application')
    expect(wrapper.findComponent(PeopleAndRoles).exists()).toBe(true)

    wrapper.destroy()
  })
})
