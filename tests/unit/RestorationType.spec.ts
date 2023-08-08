import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import RestorationType from '@/components/Restoration/RestorationType.vue'
import { RestorationTypes } from '@/enums'
import { RestorationStateIF } from '@/interfaces'
import { vi } from 'vitest'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = vi.fn()

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Restoration Type component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.restoration = {
      type: RestorationTypes.FULL,
      expiry: null,
      relationships: [],
      restorationTypeValid: true
    } as RestorationStateIF
    wrapperFactory = () => mount(RestorationType, {
      vuetify
    })
  })

  it('renders the component properly', () => {
    // verify the component is rendered
    const wrapper = wrapperFactory()
    expect(wrapper.find('#restoration-type').exists()).toBe(true)
  })

  it('selects the full restoration button if draft was a full restoration.', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('fullRestoration')
  })

  it('selects the limited restoration button if draft was a limited restoration.', () => {
    store.stateModel.restoration.type = RestorationTypes.LIMITED
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
  })

  it('changes the restoration type from full to limited when the corresponding button is pressed.', async () => {
    const wrapper = wrapperFactory()
    const input = wrapper.find('#limited-radio-button')
    input.setChecked()
    await Vue.nextTick()

    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
    expect(store.stateModel.restoration.type).toEqual('limitedRestoration')
    expect(store.stateModel.restoration.relationships).toEqual([])
  })

  it('changes the restoration type from limited to full when the corresponding button is pressed.', async () => {
    store.stateModel.restoration.type = RestorationTypes.LIMITED
    const wrapper = wrapperFactory()
    const input = wrapper.find('#full-radio-button')
    input.setChecked()
    await Vue.nextTick()

    expect(wrapper.vm.$data.selectRestorationType).toEqual('fullRestoration')
    expect(store.stateModel.restoration.type).toEqual('fullRestoration')
    expect(store.stateModel.restoration.expiry).toEqual(null)
  })
})
