import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import SummaryRestoreBusiness from '@/components/Restoration/SummaryRestoreBusiness.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Summary Restore Business component', () => {
  let wrapper: any

  function expectSummaryBusinessRestoreExists (): void {
    expect(wrapper.findComponent(SummaryRestoreBusiness).exists()).toBe(true)
  }

  function expectSectionValid (valid = true): void {
    expect(wrapper.find('section').classes('invalid-section')).toBe(!valid)
  }

  function expectErrorMessage (exists = true): void {
    expect(wrapper.find('div.restoreBusinessStepErrorMessage').exists()).toBe(exists)
  }

  beforeEach(() => {
    // all valid initial data
    store.state.stateModel.businessId = 'BC1234567'
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.business.legalName = 'My Business Name' // not used in this component
    store.state.stateModel.tombstone.filingType = 'restoration'
    store.state.stateModel.correctNameOption = 'correct-new-nr'
    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'
    store.state.stateModel.restoration = {
      applicationDate: null,
      approvalType: 'courtOrder',
      approvalTypeValid: true,
      businessNameValid: true,
      courtOrder: { fileNumber: '12345' },
      expiry: '2099-12-31',
      noticeDate: null,
      relationships: [],
      restorationTypeValid: true,
      type: 'limitedRestoration'
    }
    store.state.stateModel.nameTranslationsValid = true
    store.state.stateModel.nameTranslations = [
      { name: 'AAA' },
      { name: 'BBB' },
      { name: 'CCC' }
    ]
    store.state.stateModel.showErrors = false

    wrapper = mount(SummaryRestoreBusiness, { store, vuetify, stubs: ['router-link'] })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not show errors if step is valid', () => {
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
  })

  it('shows "step is unfinished" message if Business Name is invalid', async () => {
    store.state.stateModel.restoration.businessNameValid = false
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid(false)
    expectErrorMessage()
  })

  it('shows "step is unfinished" message if Name Translations is invalid', async () => {
    store.state.stateModel.nameTranslationsValid = false
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid(false)
    expectErrorMessage()
  })

  it('shows "step is unfinished" message if Restoration Type is invalid', async () => {
    store.state.stateModel.restoration.restorationTypeValid = false
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid(false)
    expectErrorMessage()
  })

  it('shows "step is unfinished" message if Approval Type is invalid', async () => {
    store.state.stateModel.restoration.approvalTypeValid = false
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid(false)
    expectErrorMessage()
  })

  it('shows NR company name and description', () => {
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.findAll('article:nth-of-type(1) label').at(0).text()).toBe('Name')
    expect(wrapper.find('#company-name').text()).toBe('NR Approved Name')
    expect(wrapper.find('#company-description').text()).toBe('BC Limited Company')
  })

  it('shows numbered company name', async () => {
    store.state.stateModel.correctNameOption = 'correct-name-to-number'
    store.state.stateModel.nameRequestApprovedName = '1234567 B.C. LTD.'
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#company-name').text()).toBe('1234567 B.C. LTD.')
  })

  it('shows unknown company name', async () => {
    store.state.stateModel.correctNameOption = null
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#company-name').text()).toBe('[Unknown]')
  })

  it('shows name translations', () => {
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.findAll('article:nth-of-type(1) label').at(1).text()).toBe('Name Translation')
    const items = wrapper.findAll('.name-translation')
    expect(items.length).toBe(3)
    expect(items.at(0).text()).toBe('AAA')
    expect(items.at(1).text()).toBe('BBB')
    expect(items.at(2).text()).toBe('CCC')
  })

  it('shows limited restoration type', () => {
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.findAll('article:nth-of-type(2) label').at(0).text()).toBe('Restoration Type')
    expect(wrapper.find('#limited-restoration').text()).toBe('Limited Restoration')
    expect(wrapper.find('#expires-on').text()).toBe('Expires on Dec 31, 2099')
  })

  it('shows full restoration type with relationships', async () => {
    store.state.stateModel.restoration.type = 'fullRestoration'
    store.state.stateModel.restoration.relationships = ['Director', 'Officer', 'Shareholder']
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#full-restoration').text()).toBe('Full Restoration')
    expect(wrapper.find('#applicants-relationships').text()).toContain('Applicant\'s relationship(s):')
    expect(wrapper.find('#applicants-relationships').text()).toContain('Director, Officer, Shareholder')
  })

  it('shows full restoration type with unknown relationships', async () => {
    store.state.stateModel.restoration.type = 'fullRestoration'
    store.state.stateModel.restoration.relationships = []
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#applicants-relationships').text()).toBe('Applicant\'s relationship(s): [Unknown]')
  })

  it('shows unknown restoration type', async () => {
    store.state.stateModel.restoration.type = null
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#unknown-restoration-type').text()).toBe('[Unknown]')
  })

  it('shows court order approval type', () => {
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.findAll('article:nth-of-type(2) label').at(1).text()).toBe('Approval Type')
    expect(wrapper.findAll('article:nth-of-type(2) label').at(2).text()).toBe('Approved by Court Order')
    expect(wrapper.find('#court-order-number').text()).toBe('Court Order Number: 12345')
  })

  it('shows registrar approval type', async () => {
    store.state.stateModel.restoration.approvalType = 'registrar'
    store.state.stateModel.restoration.noticeDate = '2023-01-01'
    store.state.stateModel.restoration.applicationDate = '2023-02-01'
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.findAll('article:nth-of-type(2) label').at(2).text()).toBe('Approved by Registrar')
    expect(wrapper.find('#notice-date').text()).toBe('BC Gazette publish date: Jan 1, 2023')
    expect(wrapper.find('#application-date').text()).toBe('Application for Restoration mailed date: Feb 1, 2023')
  })

  it('shows unknown approval type', async () => {
    store.state.stateModel.restoration.approvalType = null
    await Vue.nextTick()
    expectSummaryBusinessRestoreExists()
    expectSectionValid()
    expectErrorMessage(false)
    expect(wrapper.find('#unknown-approval-type').text()).toBe('[Unknown]')
  })
})