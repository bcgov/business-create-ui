import Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { wrapperFactory } from '../vitest-wrapper-factory'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import ManualBusinessInfo from '@/components/ContinuationIn/ManualBusinessInfo.vue'
import UploadAffidavit from '@/components/ContinuationIn/UploadAffidavit.vue'

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

  it('renders the UploadAffidavit component correctly', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {
      affidavitFile: null,
      affidavitFileKey: null,
      affidavitFileName: null,
      homeJurisdiction: {
        country: 'CA',
        region: 'AB'
      },
      homeIdentifier: '',
      homeIncorporationDate: '',
      homeLegalName: '',
      mode: 'MANUAL'
    } as ExistingBusinessInfoIF
    store.stateModel.entityType = CorpTypeCd.ULC_CONTINUE_IN

    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    // Verify the Upload Affidavit component was rendered
    expect(wrapper.findComponent(UploadAffidavit).exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays initial jurisdiction (Federal) value correctly', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {
      homeJurisdiction: {
        country: 'CA',
        region: 'FEDERAL'
      },
      mode: 'MANUAL'
    } as ExistingBusinessInfoIF

    const wrapper = wrapperFactory(ManualBusinessInfo)
    await Vue.nextTick()

    // verify component main exists
    expect(wrapper.find('.home-jurisdiction label').text()).toBe('Jurisdiction')
    expect(wrapper.find('.home-jurisdiction .v-select__selection').text()).toBe('Federal')

    wrapper.destroy()
  })
})
