import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ExtraproRegistration from '@/components/ContinuationIn/ExtraproRegistration.vue'

describe('Extrapro Registration component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ExtraproRegistration)
    await Vue.nextTick()

    // verify component main exists
    expect(wrapper.findComponent(ExtraproRegistration).exists()).toBe(true)
    expect(wrapper.find('#extrapro-registration').exists()).toBe(true)

    wrapper.destroy()
  })
})
