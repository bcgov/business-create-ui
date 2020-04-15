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

  it('renders the Name Request header when the EntityType(BC) is present and not the initial header', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest.entityType = 'BC'

    await Vue.nextTick(() => {
      expect(wrapper.vm.$el.querySelector('#nr-header').textContent)
        .toContain('Incorporate a BC Benefit Company')
      expect(wrapper.vm.$el.querySelector('#no-nr-header').style.display).toBe('none')
    })
  })
})
