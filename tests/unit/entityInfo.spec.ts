// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Components
import { mount } from '@vue/test-utils'
import { EntityInfo } from '@/components/common'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('Entity Info component', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(EntityInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders initial header when Name Request Data is empty and not the name request data sections', () => {
    expect(wrapper.vm.$el.querySelector('#no-nr-header').textContent)
      .toContain('Register a BC Business')
    expect(wrapper.vm.$el.querySelector('#nr-header').style.display).toBe('none')
  })

  it('renders the Name Request header when the NR Data is present and not the initial header', () => {
    wrapper.vm.nameReqData = true
    expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
      .toContain('Incorporate a BC Benefit Company')
    expect(wrapper.vm.$el.querySelector('#no-nr-header').style.display).toBe('none')
  })
})
