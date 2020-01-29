// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { store } from '@/store'

// Components
import { mount } from '@vue/test-utils'
import { EntityInfo } from '@/components/common'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Entity Info component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(EntityInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders initial header when EntityType has not yet been determined', () => {
    expect(wrapper.vm.$el.querySelector('#no-nr-header').textContent)
      .toContain('Register a BC Business')
    expect(wrapper.vm.$el.querySelector('#nr-header').style.display).toBe('none')
  })

  it('renders the Name Request header when the EntityType(BC) is present and not the initial header', () => {
    wrapper.vm.$store.state.stateModel.nameRequest.entityType = 'BC'
    expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
      .toContain('Incorporate a BC Benefit Company')
    expect(wrapper.vm.$el.querySelector('#no-nr-header').style.display).toBe('none')
  })

  it('renders the Name Request header when the EntityType(CP) is present and not the initial header', () => {
    wrapper.vm.$store.state.stateModel.nameRequest.entityType = 'CP'
    expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
      .toContain('Incorporate a BC Cooperative')
    expect(wrapper.vm.$el.querySelector('#no-nr-header').style.display).toBe('none')
  })
})
