import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ExtraproBusinessLookup from '@/components/ContinuationIn/ExtraproBusinessLookup.vue'

describe('Extrapro Business Lookup component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ExtraproBusinessLookup)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ExtraproBusinessLookup).exists()).toBe(true)
    expect(wrapper.find('#extrapro-business-lookup').exists()).toBe(true)

    // spot check some content (structure / text)
    expect(wrapper.find('.v-input').exists()).toBe(true)
    expect(wrapper.find('.v-input label').text()).toContain('Extraprovincial registration number')

    wrapper.destroy()
  })
})
