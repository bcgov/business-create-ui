import Vue from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { wrapperFactory } from '../vitest-wrapper-factory'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import UnlimitedLiabilityCorporationInformation
  from '@/components/ContinuationIn/UnlimitedLiabilityCorporationInformation.vue'

setActivePinia(createPinia())
const store = useStore()

describe('Unlimited Liability Corporation Information component', () => {
  it('renders the component correctly with no file', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {} as ExistingBusinessInfoIF
    store.stateModel.entityType = CorpTypeCd.ULC_CONTINUE_IN

    const wrapper = wrapperFactory(UnlimitedLiabilityCorporationInformation)
    await Vue.nextTick()

    // verify component exists
    expect(wrapper.findComponent(UnlimitedLiabilityCorporationInformation).exists()).toBe(true)
    expect(wrapper.find('#unlimited-liability-corporation-information').exists()).toBe(true)

    // verify initial validity
    const valid = wrapper.emitted().valid
    expect(valid[0][0]).toBe(false)

    // verify misc content
    expect(wrapper.find('label').text()).toBe('Upload File')
    expect(wrapper.find('p').text()).toContain('You are required to provide')
    expect(wrapper.find('ul').text()).toContain('Use a white background')
    expect(wrapper.find('ul').text()).toContain('PDF file type')
    expect(wrapper.find('#add-affidavit-button').text()).toBe('Add a Document')
    expect(wrapper.find('#add-affidavit-button').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.document-details').exists()).toBe(false)
    expect(wrapper.find('.remove-document-button').exists()).toBe(false)

    wrapper.destroy()
  })

  it('renders the component correctly with existing file', async () => {
    // set some store values
    store.stateModel.continuationIn.existingBusinessInfo = {
      affidavitFile: { name: 'test.pdf', size: 123456 } as File,
      affidavitFileKey: 'abc-123',
      affidavitFileName: 'test.pdf'
    } as ExistingBusinessInfoIF
    store.stateModel.entityType = CorpTypeCd.ULC_CONTINUE_IN

    const wrapper = wrapperFactory(UnlimitedLiabilityCorporationInformation)
    await Vue.nextTick()

    // verify component exists
    expect(wrapper.findComponent(UnlimitedLiabilityCorporationInformation).exists()).toBe(true)
    expect(wrapper.find('#unlimited-liability-corporation-information').exists()).toBe(true)

    // verify initial validity
    const valid = wrapper.emitted().valid
    expect(valid[0][0]).toBe(true)

    // verify misc content
    expect(wrapper.find('#add-affidavit-button').attributes('disabled')).toBe('disabled')
    expect(wrapper.find('.document-details').exists()).toBe(true)
    expect(wrapper.find('.document-details').text()).toBe('test.pdf (121 KB)')
    expect(wrapper.find('.remove-document-button').exists()).toBe(true)
    expect(wrapper.find('.remove-document-button').text()).toBe('Remove')

    wrapper.destroy()
  })
})
