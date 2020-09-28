// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { mount } from '@vue/test-utils'
import { EntityInfo } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

describe('Entity Info component with an NR', () => {
  let wrapper: any
  let store: any

  beforeEach(() => {
    store = getVuexStore()

    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BEN'
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

  it('displays the breadcrumb correctly as a named benefit company', async () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1)// Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toStrictEqual('Manage Businesses Dashboard')
    expect(divider.text()).toStrictEqual('>')
    expect(crumb2.text()).toStrictEqual('Xyz Ltd.')
    expect(crumb3.text()).toStrictEqual('BC Benefit Company Incorporation Application')
  })
})

describe('Entity Info component without an NR', () => {
  let wrapper: any
  let store: any

  beforeEach(() => {
    store = getVuexStore()

    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BEN'
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

  it('displays the breadcrumb correctly as a numbered benefit company', async () => {
    const breadcrumbs = wrapper.findAll('.v-breadcrumbs li')

    const crumb1 = breadcrumbs.at(0)
    const divider = breadcrumbs.at(1)// Divider is present every odd index
    const crumb2 = breadcrumbs.at(2)
    const crumb3 = breadcrumbs.at(4)

    expect(crumb1.text()).toStrictEqual('Manage Businesses Dashboard')
    expect(divider.text()).toStrictEqual('>')
    expect(crumb2.text()).toStrictEqual('Numbered Benefit Company')
    expect(crumb3.text()).toStrictEqual('BC Benefit Company Incorporation Application')
  })
})
