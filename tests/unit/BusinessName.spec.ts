import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import LegalServices from '@/services/legal-services'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// mock services function
const mockFetchNameRequest = jest.spyOn((LegalServices as any), 'updateFiling').mockImplementation()

describe('Business Name component', () => {
  let wrapper: any

  function expectBusinessNameExists (): void {
    expect(wrapper.findComponent(BusinessName).exists()).toBe(true)
  }

  function expectSectionExists (exists = true): void {
    expect(wrapper.find('.section-container').exists()).toBe(exists)
  }

  function expectSectionValid (valid = true): void {
    expect(wrapper.find('.section-container').classes('invalid-section')).toBe(!valid)
  }

  function expectLabelExists (exists = true): void {
    expect(wrapper.find('label').exists()).toBe(exists)
    if (exists) expect(wrapper.find('label').text()).toBe('Business Name')
  }

  function expectCorrectNameExists (exists = true): void {
    expect(wrapper.findComponent(CorrectName).exists()).toBe(exists)
  }

  function expectNameRequestInfoExists (exists = true): void {
    expect(wrapper.findComponent(NameRequestInfo).exists()).toBe(exists)
  }

  function expectUndoButtonExists (exists = true): void {
    expect(wrapper.find('.btn-undo').exists()).toBe(exists)
    if (exists) expect(wrapper.find('.btn-undo span').text()).toBe('Undo')
  }

  beforeEach(() => {
    // tombstone data
    store.state.stateModel.businessId = 'BC1234567'
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.business.legalName = 'My Business Name'
    store.state.stateModel.tombstone.filingType = 'restoration'

    // initial values
    store.state.stateModel.correctNameOption = null
    store.state.stateModel.nameRequestApprovedName = null
    store.state.stateModel.showErrors = false

    wrapper = shallowMount(BusinessName, { store, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component in editing mode initially and with no error styling', () => {
    expectBusinessNameExists()
    expectSectionExists()
    expectSectionValid()
    expectLabelExists()
    expectCorrectNameExists()
    expectNameRequestInfoExists(false)
    expectUndoButtonExists(false)
  })

  it('renders the component with error styling when no option has been selected', async () => {
    store.state.stateModel.showErrors = true
    await Vue.nextTick()

    expectBusinessNameExists()
    expectSectionExists()
    expectSectionValid(false)
    expectLabelExists()
    expectCorrectNameExists()
    expectNameRequestInfoExists(false)
    expectUndoButtonExists(false)
  })

  it('renders the component in display mode when incorp number is used as name', async () => {
    store.state.stateModel.correctNameOption = 'correct-name-to-number'
    store.state.stateModel.nameRequestApprovedName = '1234567 B.C. LTD.'
    await Vue.nextTick()

    expectBusinessNameExists()
    expectSectionExists(false)
    expectLabelExists(false)
    expectCorrectNameExists(false)
    expectNameRequestInfoExists()
    expectUndoButtonExists()
  })

  it('renders the component in display mode when new name request is used', async () => {
    store.state.stateModel.correctNameOption = 'correct-new-nr'
    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expectBusinessNameExists()
    expectSectionExists(false)
    expectLabelExists(false)
    expectCorrectNameExists(false)
    expectNameRequestInfoExists()
    expectUndoButtonExists()
  })

  it('computes companyName correctly', async () => {
    expect(wrapper.vm.companyName).toBe('My Business Name') // initial value

    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expect(wrapper.vm.companyName).toBe('NR Approved Name')
  })

  const tests = [
    { showErrors: false, correctNameOption: null, expected: false },
    { showErrors: false, correctNameOption: 'correct-new-nr', expected: false },
    { showErrors: true, correctNameOption: null, expected: true },
    { showErrors: 'correct-new-nr', correctNameOption: 'correct-new-nr', expected: false }
  ]

  for (const test of tests) {
    const showErrors = test.showErrors
    const correctNameOption = test.correctNameOption
    const expected = test.expected

    // eslint-disable-next-line max-len
    it(`computes invalidSection correctly when showErrors is ${showErrors} and correctNameOptions is ${correctNameOption}`, async () => {
      store.state.stateModel.showErrors = showErrors
      store.state.stateModel.correctNameOption = correctNameOption
      await Vue.nextTick()

      expect(wrapper.vm.invalidSection).toBe(expected)
    })
  }

  it('computes correctionNameChoices correctly', async () => {
    const correctionNameChoices = wrapper.vm.correctionNameChoices
    // verify initial values
    expect(correctionNameChoices.length).toBe(2)
    expect(correctionNameChoices[0]).toBe('correct-name-to-number')
    expect(correctionNameChoices[1]).toBe('correct-new-nr')
  })

  it('computes requestActionCode correctly', async () => {
    // verify initial value
    expect(wrapper.vm.requestActionCode).toBe('REH')
  })

  it('computes isNewName correctly', async () => {
    expect(wrapper.vm.isNewName).toBe(false) // initial value

    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expect(wrapper.vm.isNewName).toBe(true)
  })
})
