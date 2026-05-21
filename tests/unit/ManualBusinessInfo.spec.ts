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

  it('displays identifying number length error immediately', async () => {
    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    await wrapper.find('.incorporation-number input').setValue('A'.repeat(51))
    await Vue.nextTick()

    expect(wrapper.find('.incorporation-number .v-messages__message').text())
      .toContain('Cannot exceed 50 characters')

    wrapper.destroy()
  })

  it('displays business name length error immediately', async () => {
    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    await wrapper.find('.business-name input').setValue('A'.repeat(1001))
    await Vue.nextTick()

    expect(wrapper.find('.business-name .v-messages__message').text())
      .toContain('Cannot exceed 1000 characters')

    wrapper.destroy()
  })
})
