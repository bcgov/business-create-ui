import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import { CooperativeResource } from '@/resources/Incorporations'
import UploadRules from '@/components/Incorporation/UploadRules.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})
const store = getVuexStore()

describe(`Upload Rules view for a COOP`, () => {
  let wrapper: any

  beforeEach(() => {
    store.state.resourceModel.createRules = CooperativeResource.createRules
    wrapper = shallowMount(UploadRules, {
      vuetify,
      store,
      propsData: { helpToggle: true }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders Upload Rules main component', () => {
    expect(wrapper.find('#upload-rules').exists()).toBe(true)
  })

  it('renders each section', () => {
    expect(wrapper.find('#header-rules-section').exists()).toBe(true)
    expect(wrapper.find('#confirm-rules-section').exists()).toBe(true)
    expect(wrapper.find('#upload-rules-section').exists()).toBe(true)
    expect(wrapper.find('#help-rules-section').exists()).toBe(true)
  })

  it('renders the header section and its components', () => {
    const header = wrapper.find('#header-rules-section')
    expect(header.find('h2').text()).toContain('Rules of the Association')
    expect(header.find('p').text()).toContain('Before submitting your incorporation')
  })

  it('renders the confirm section and its components', () => {
    const confirm = wrapper.find('#confirm-rules-section')
    expect(confirm.find('h2').text()).toContain('Confirm Rules Completion')
    expect(confirm.find('p').text()).toContain('The Cooperative name is identified')
  })

  it('renders the upload section and its components', () => {
    const upload = wrapper.find('#upload-rules-section')
    expect(upload.find('h2').text()).toContain('Upload Rules')
    const List = upload.findAll('li')
    expect(List.length).toBe(4)
    expect(List.at(0).text()).toContain('Must be set to fit onto 8.5"')
    expect(List.at(1).text()).toContain('Allow a minimum 1.5" margin')
    expect(List.at(2).text()).toContain('Use a white background and')
    expect(List.at(3).text()).toContain('PDF file type (maximum 30')

    expect(wrapper.find('#upload-rules-note').text()).toContain('Do not upload Housing Cooperative')
    expect(wrapper.find('#upload-rules-card').find('label').text()).toContain('Upload Rules')
  })

  it('renders the help section', () => {
    const helpSection = CooperativeResource.createRules.helpSection
    const help = wrapper.find('#help-rules-section')
    expect(help.find('span span').text()).toContain(helpSection.header)
    expect(help.find('#create-rules-help-header').text()).toContain(helpSection.header)

    const helpTitle = help.findAll('.help-section-title')
    expect(helpTitle.length).toBe(3)
    expect(helpTitle.at(0).text()).toContain(helpSection.helpText.section1.label)
    expect(helpTitle.at(1).text()).toContain(helpSection.helpText.section2.label)
    expect(helpTitle.at(2).text()).toContain(helpSection.helpText.section3.label)

    const bulletList = help.findAll('.bulleted-list')
    expect(bulletList.length).toBe(3)

    const bulletList1 = bulletList.at(0).findAll('li')
    expect(bulletList1.length).toBe(helpSection.helpText.section1.items.length)

    const bulletList2 = bulletList.at(1).findAll('li')
    expect(bulletList2.length).toBe(helpSection.helpText.section2.items.length)

    const bulletList3 = bulletList.at(2).findAll('li')
    expect(bulletList3.length).toBe(helpSection.helpText.section3.items.length)
  })
})
