import Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { wrapperFactory } from '../vitest-wrapper-factory'
import { ExistingBusinessInfoIF } from '@/interfaces'
import ManualBusinessInfo from '@/components/ContinuationIn/ManualBusinessInfo.vue'

setActivePinia(createPinia())
const store = useStore()

describe('Manual Business Info component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    // verify component main exists
    expect(wrapper.findComponent(ManualBusinessInfo).exists()).toBe(true)
    expect(wrapper.find('#manual-business-info').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays initial jurisdiction (Federal) value correctly', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {
      previousJurisdiction: {
        country: 'CA',
        region: 'FEDERAL'
      },
      mode: 'MANUAL'
    } as ExistingBusinessInfoIF

    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    // verify component main exists
    expect(wrapper.find('.previous-jurisdiction label').text()).toBe('Previous Jurisdiction')
    expect(wrapper.find('.previous-jurisdiction .v-select__selection').text()).toBe('Federal')

    wrapper.destroy()
  })
})
