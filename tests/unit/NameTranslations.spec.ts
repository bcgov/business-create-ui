import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import NameTranslations from '@/components/common/NameTranslations.vue'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'
import { CorpTypeCd } from '@bcrs-shared-components/enums'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('Name Translations component', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    // Temp Id will always be set with or without an NR
    store.stateModel.tempId = 'T1234567'
    store.stateModel.nameRequest.nrNum = null

    wrapper = mount(NameTranslations, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders with checkbox unchecked', () => {
    expect(wrapper.find('#name-translations').exists()).toBe(true)
    expect(wrapper.vm.checkbox).toBe(false)

    // both sub-components should be hidden
    expect(wrapper.findComponent(AddNameTranslation).exists()).toBe(false)
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBe(false)
  })

  it('renders with checkbox checked', async () => {
    expect(wrapper.find('#name-translations').exists()).toBe(true)
    expect(wrapper.vm.checkbox).toBe(false)

    // click the checkbox
    await wrapper.find('#name-translation-checkbox').trigger('click')
    expect(wrapper.vm.checkbox).toBe(true)

    // Add button should be visible
    expect(wrapper.find('.v-btn').exists()).toBe(true)
    expect(wrapper.find('.v-btn').text()).toBe('Add a Name Translation')

    // both sub-components should be hidden
    expect(wrapper.findComponent(AddNameTranslation).exists()).toBe(false)
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBe(false)
  })

  it('renders the Add Name Translation component', async () => {
    expect(wrapper.find('#name-translations').exists()).toBe(true)
    expect(wrapper.vm.checkbox).toBe(false)

    // first click the checkbox
    await wrapper.find('#name-translation-checkbox').trigger('click')
    expect(wrapper.vm.checkbox).toBe(true)

    // now click the Add button
    await wrapper.find('.v-btn').trigger('click')
    expect(wrapper.vm.isAddingNameTranslation).toBe(true)

    // only Add sub-component should be visible
    expect(wrapper.findComponent(AddNameTranslation).exists()).toBe(true)
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBe(false)
  })

  it('renders the List Name Translation component', async () => {
    expect(wrapper.find('#name-translations').exists()).toBe(true)
    expect(wrapper.vm.checkbox).toBe(false)

    // set some name translations in the store
    store.setNameTranslations([
      { name: 'Mock Name Translation' },
      { name: 'Another Mock Name Translation' }
    ])

    await Vue.nextTick()

    // the checkbox should automatically be checked
    expect(wrapper.vm.checkbox).toBe(true)

    // verify count
    expect(wrapper.vm.getNameTranslations.length).toBe(2)

    // only List sub-component should be visible
    expect(wrapper.findComponent(AddNameTranslation).exists()).toBe(false)
    expect(wrapper.findComponent(ListNameTranslations).exists()).toBe(true)
  })
})
