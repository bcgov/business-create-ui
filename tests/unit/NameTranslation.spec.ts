import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import NameTranslation from '@/components/common/NameTranslation.vue'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

describe('Name Translation component', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BEN'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNum = null
    wrapper = mount(NameTranslation, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the option for name translation', async () => {
    expect(wrapper.find('.section-container').exists()).toBeTruthy()
    expect(wrapper.vm.hasNameTranslation).toBe(false)

    expect(wrapper.findComponent(AddNameTranslation).exists()).toBeFalsy()
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBeFalsy()
  })

  it('renders the Add Name Translation component', async () => {
    expect(wrapper.find('.section-container').exists()).toBeTruthy()
    expect(wrapper.vm.hasNameTranslation).toBe(false)

    await wrapper.find('#name-translation-checkbox').trigger('click')

    expect(wrapper.findComponent(AddNameTranslation).exists()).toBeTruthy()
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBeFalsy()
  })

  it('renders the List Name Translation component', async () => {
    await wrapper.vm.$store.commit('mutateNameTranslation', [
      'Mock Name Translation',
      'Another Mock Name Translation'
    ])

    expect(wrapper.find('.section-container').exists()).toBeTruthy()
    expect(wrapper.vm.hasNameTranslation).toBe(true)

    expect(wrapper.findComponent(AddNameTranslation).exists()).toBeFalsy()
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBeTruthy()
  })
})
