// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { FolioNumber } from '@/components/DefineCompany'
import { shallowMount } from '@vue/test-utils'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Folio number component', () => {
  it('displays editing view', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
    const wrapper = shallowMount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: true },
      store,
      vuetify
    })

    expect(wrapper.find('#folio-number-editing').exists()).toBe(true)
    expect(wrapper.find('#folio-number-read-only').exists()).toBe(false)
    wrapper.destroy()
  })

  it('displays readonly view', () => {
    store.state.stateModel.nameRequest.entityType = 'BC'
    store.state.stateModel.accountInformation.accountType = 'PREMIUM'
    const wrapper = shallowMount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: false },
      store,
      vuetify
    })

    expect(wrapper.find('#folio-number-editing').exists()).toBe(false)
    expect(wrapper.find('#folio-number-read-only').exists()).toBe(true)
    wrapper.destroy()
  })
})
