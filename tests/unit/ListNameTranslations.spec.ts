import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'
import { getVuexStore } from '@/store'
import { createLocalVue, mount } from '@vue/test-utils'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

// Local references
const nameTranslationsUi = '#list-name-translations'
const nameTranslationsList = [
  { name: 'First mock name translation ltd.' },
  { name: 'Second mock name translation inc' },
  { name: 'Third mock name translation ltd.' },
  { name: 'Quatrième nom simulé' }
]

describe('List Name Translation component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    // Init Store
    store.state.stateModel.nameTranslations = []

    wrapperFactory = async (propsData) => {
      const wrapper = mount(ListNameTranslations, {
        localVue,
        router,
        store,
        vuetify,
        propsData: { ...propsData }
      })
      await Vue.nextTick()
      return wrapper
    }
  })

  it('displays the list of name translations and action btns', async () => {
    const wrapper = await wrapperFactory({ translationsList: nameTranslationsList })

    // Verify list exists
    expect(wrapper.find(nameTranslationsUi).exists()).toBeTruthy()

    // Verify list title
    expect(wrapper.find('.name-translation-title').text()).toContain('Name Translations:')

    // Verify list items
    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    // Verify edit btn and default state
    expect(wrapper.find('.edit-action .v-btn').exists()).toBeTruthy()
    expect(wrapper.find('.edit-action .v-btn').attributes('disabled')).toBeUndefined()

    // Verify more actions drop down
    expect(wrapper.find('.more-actions-btn').exists()).toBeTruthy()
    await wrapper.find('.more-actions-btn').trigger('click')

    // Verify 'Remove' btn
    expect(wrapper.find('.more-actions-btn').exists()).toBeTruthy()

    wrapper.destroy()
  })

  it('disables the edit and drop down btns when editing a name translation', async () => {
    const wrapper = await wrapperFactory({ translationsList: nameTranslationsList, isAddingNameTranslation: true })

    // Verify edit btn and default state
    expect(wrapper.find('.edit-action .v-btn').exists()).toBeTruthy()
    expect(wrapper.find('.edit-action .v-btn').attributes('disabled')).toBeTruthy()

    // Verify more actions drop down
    expect(wrapper.find('.more-actions-btn').exists()).toBeTruthy()
    expect(wrapper.find('.more-actions-btn').attributes('disabled')).toBeTruthy()

    await wrapper.find('.more-actions-btn').trigger('click')

    // Verify 'Remove' btn
    expect(wrapper.find('.more-actions-list').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('emits the correct name index when selected for edit', async () => {
    const wrapper = await wrapperFactory({ translationsList: nameTranslationsList })

    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    const editBtns = wrapper.findAll('.edit-action .v-btn')

    // Select the first name to edit
    await editBtns.at(0).trigger('click')
    expect(wrapper.emitted('editTranslation').pop()).toEqual([0])

    // Select the third name to edit
    await editBtns.at(2).trigger('click')
    expect(wrapper.emitted('editTranslation').pop()).toEqual([2])

    wrapper.destroy()
  })

  it('emits the correct name index when selected for removal', async () => {
    const wrapper = await wrapperFactory({ translationsList: nameTranslationsList })

    const namesList = wrapper.vm.$el.querySelectorAll('.names-translation-content')
    expect(namesList[0].textContent).toContain(nameTranslationsList[0].name)
    expect(namesList[1].textContent).toContain(nameTranslationsList[1].name)
    expect(namesList[2].textContent).toContain(nameTranslationsList[2].name)
    expect(namesList[3].textContent).toContain(nameTranslationsList[3].name)

    // Open the first list item dropdown
    const actionsDropdown = wrapper.findAll('.more-actions-btn')
    await actionsDropdown.at(0).trigger('click')

    // Select the first item for removal
    const removeBtns = wrapper.findAll('.more-actions-list .v-list-item')
    expect(removeBtns.at(0).exists()).toBeTruthy()
    expect(removeBtns.at(0).attributes('disabled')).toBeUndefined()
    await removeBtns.at(0).trigger('click')

    expect(wrapper.emitted('removeTranslation').pop()).toEqual([0])

    wrapper.destroy()
  })
})
