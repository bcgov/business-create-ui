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
const store = getVuexStore()

describe('Entity Info component', () => {
  it('renders initial header when EntityType has not yet been determined', () => {
    store.state.stateModel.entityType = ''
    const wrapper = mount(EntityInfo, { vuetify, store })

    expect(wrapper.find('#no-nr-header').text()).toContain('Register a BC Business')
    expect(wrapper.find('#nr-header').isVisible()).toBe(false)
  })

  it('renders the Name Request header when the EntityType(BC) is present and not the initial header', async () => {
    store.state.stateModel.entityType = 'BC'
    const wrapper = mount(EntityInfo, { vuetify, store })

    expect(wrapper.vm.$el.querySelector('#nr-header').textContent).toContain('Incorporate a BC Benefit Company')
    expect(wrapper.find('#no-nr-header').isVisible()).toBe(false)
  })

  it('renders the Name Request header when the EntityType(CP) is present and not the initial header', async () => {
    store.state.stateModel.entityType = 'CP'
    const wrapper = mount(EntityInfo, { vuetify, store })

    expect(wrapper.vm.$el.querySelector('#nr-header').textContent).toContain('Incorporate a BC Cooperative')
    expect(wrapper.find('#no-nr-header').isVisible()).toBe(false)
  })
})
