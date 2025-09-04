import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount } from '@vue/test-utils'
import LegalServices from '@/services/legal-services'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import { AuthorizationRoles, FilingTypes } from '@/enums'
import { CorrectNameOptions } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { setAuthRole } from '../set-auth-role'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = vi.fn()

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// mock services function
vi.spyOn((LegalServices as any), 'updateFiling').mockResolvedValue({})

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
    store.stateModel.business.businessId = 'BC1234567'
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    // business.legalName is always set to be null in the store
    store.stateModel.business.legalName = null
    store.stateModel.tombstone.filingType = FilingTypes.RESTORATION

    // initial values
    store.stateModel.correctNameOption = null
    store.stateModel.nameRequestApprovedName = null
    store.stateModel.showErrors = false

    wrapper = shallowMount(BusinessName, { vuetify })
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
    store.stateModel.showErrors = true
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
    store.stateModel.correctNameOption = CorrectNameOptions.CORRECT_NAME_TO_NUMBER
    store.stateModel.nameRequestApprovedName = '1234567 B.C. LTD.'
    await Vue.nextTick()

    expectBusinessNameExists()
    expectSectionExists(false)
    expectLabelExists(false)
    expectCorrectNameExists(false)
    expectNameRequestInfoExists()
    expectUndoButtonExists()
  })

  it('renders the component in display mode when new name request is used', async () => {
    store.stateModel.correctNameOption = CorrectNameOptions.CORRECT_NEW_NR
    store.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expectBusinessNameExists()
    expectSectionExists(false)
    expectLabelExists(false)
    expectCorrectNameExists(false)
    expectNameRequestInfoExists()
    expectUndoButtonExists()
  })

  it('computes companyName correctly', async () => {
    expect(wrapper.vm.companyName).toBe(null) // initial value

    store.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expect(wrapper.vm.companyName).toBe('NR Approved Name')
  })

  const tests = [
    { showErrors: false, correctNameOption: null, expected: false },
    { showErrors: false, correctNameOption: CorrectNameOptions.CORRECT_NEW_NR, expected: false },
    { showErrors: true, correctNameOption: null, expected: true },
    { showErrors: 'correct-new-nr', correctNameOption: CorrectNameOptions.CORRECT_NEW_NR, expected: false },
    { showErrors: 'correct-new-nr-staff', correctNameOption: CorrectNameOptions.CORRECT_NEW_NR_STAFF, expected: false }

  ]

  for (const test of tests) {
    const showErrors: any = test.showErrors
    const correctNameOption = test.correctNameOption
    const expected = test.expected

    // eslint-disable-next-line max-len
    it(`computes invalidSection correctly when showErrors is ${showErrors} and correctNameOptions is
       ${correctNameOption}`, async () => {
      store.stateModel.showErrors = showErrors
      store.stateModel.correctNameOption = correctNameOption
      await Vue.nextTick()

      expect(wrapper.vm.invalidSection).toBe(expected)
    })
  }

  const correctNameTests = [
    { isStaff: true, correctNameOptions: ['correct-name-to-number', 'correct-new-nr-staff'] },
    { isStaff: false, correctNameOptions: ['correct-name-to-number', 'correct-new-nr'] }
  ]

  for (const test of correctNameTests) {
    it(`computes correctionNameChoices correctly`, async () => {
      setAuthRole(store, test.isStaff ? AuthorizationRoles.STAFF : AuthorizationRoles.PUBLIC_USER)
      await Vue.nextTick()

      expect(wrapper.vm.correctionNameChoices).toEqual(expect.arrayContaining(test.correctNameOptions))
    })
  }

  it('computes isNewName correctly', async () => {
    expect(wrapper.vm.isNewName).toBe(false) // initial value

    store.stateModel.nameRequestApprovedName = 'NR Approved Name'
    await Vue.nextTick()

    expect(wrapper.vm.isNewName).toBe(true)
  })
})
