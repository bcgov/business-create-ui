// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

// Store
import { getVuexStore } from '@/store'

// Components
import { mount } from '@vue/test-utils'
import { EntityInfo, NameRequestInfo } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

describe('Entity Info component with an NR', () => {
  let wrapper: any
  let store: any

  beforeEach(() => {
    store = getVuexStore()

    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BC'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNumber = 'NR 1234567'
    store.state.stateModel.nameRequest.details.approvedName = 'Xyz Ltd.'

    wrapper = mount(EntityInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the Name Request header when the EntityType(BC) is present', async () => {
    expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
      .toContain('BC Benefit Company Incorporation Application')

    expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
      .toContain('Xyz Ltd.')

    expect(wrapper.vm.$el.querySelector('#entity-nr-number').textContent)
      .toContain('NR 1234567')
  })
})

describe('Entity Info component without an NR', () => {
  let wrapper: any
  let store: any

  beforeEach(() => {
    store = getVuexStore()

    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BC'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNumber = null
    store.state.stateModel.nameRequest.details.approvedName = null

    wrapper = mount(EntityInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the Numbered Company header when the EntityType(BC) is present with no NR', async () => {
    expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
      .toContain('BC Benefit Company Incorporation Application')

    expect(wrapper.vm.$el.querySelector('#entity-legal-name').textContent)
      .toContain('Numbered Benefit Company')

    expect(wrapper.vm.$el.querySelector('#entity-numbered-label').textContent)
      .toContain('Numbered Benefit Company')
  })
})
