import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount } from '@vue/test-utils'
import { AmlTypes, FilingTypes } from '@/enums'
import { AmalgamationTypes, CorrectNameOptions, NrRequestActionCodes } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { LegalServices } from '@/services/'
import ResultingBusinessName from '@/components/Amalgamation/ResultingBusinessName.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

const vuetify = new Vuetify({})

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
// console.warn = vi.fn()

setActivePinia(createPinia())
const store = useStore()

describe('Resulting Business Name component', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowMount(ResultingBusinessName)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders the component properly', () => {
    expect(wrapper.find('#resulting-business-name').exists()).toBe(true)
  })

  const FOREIGN = { type: AmlTypes.FOREIGN }
  const COLIN_BC = { type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_COMPANY }
  const XPRO_COLIN = { type: AmlTypes.COLIN, legalType: CorpTypeCd.EXTRA_PRO_A }
  const BC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_COMPANY }
  const BEN = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BENEFIT_COMPANY }
  const C = { type: AmlTypes.LEAR, legalType: CorpTypeCd.CONTINUE_IN }
  const CBEN = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BEN_CONTINUE_IN }
  const CC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_CCC }
  const CCC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.CCC_CONTINUE_IN }
  const CUL = { type: AmlTypes.LEAR, legalType: CorpTypeCd.ULC_CONTINUE_IN }
  const ULC = { type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_ULC_COMPANY }

  const tests = [
    { // variation 0
      amalgamatingBusinesses: [ FOREIGN ],
      computed: []
    },
    { // variation 1
      entityType: CorpTypeCd.BC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 2
      entityType: CorpTypeCd.BENEFIT_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 3
      entityType: CorpTypeCd.CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 4
      entityType: CorpTypeCd.BEN_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ BC, BEN, C, CBEN ]
    },
    { // variation 5
      entityType: CorpTypeCd.BC_CCC,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CC, CCC ]
    },
    { // variation 6
      entityType: CorpTypeCd.CCC_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CC, CCC ]
    },
    { // variation 7
      entityType: CorpTypeCd.ULC_CONTINUE_IN,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CUL, ULC ]
    },
    { // variation 8
      entityType: CorpTypeCd.BC_ULC_COMPANY,
      amalgamatingBusinesses: [ BC, BEN, C, CBEN, CC, CCC, CUL, ULC ],
      computed: [ CUL, ULC ]
    },
    { // variation 9 - COLIN businesses are candidates; extrapro COLIN and foreign are not
      entityType: CorpTypeCd.BC_COMPANY,
      amalgamatingBusinesses: [ COLIN_BC, XPRO_COLIN, FOREIGN, BC ],
      computed: [ COLIN_BC, BC ]
    }
  ]

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    it(`correctly filters the list of amalgamating businesses - variation #${i}`, () => {
      // set the entity type
      store.setEntityType(test.entityType || null)
      // set the amalgamating businesses
      store.setAmalgamatingBusinesses(test.amalgamatingBusinesses as any[])
      // verify the computed value
      expect(wrapper.vm.amalgamatingBusinesses).toEqual(test.computed)
    })
  }
})

describe('Resulting Business Name component - Edit button and Resulting Business Type', () => {
  let wrapper: any

  /** Mounts the component for a regular amalgamation with the given state. */
  function mountComponent (correctNameOption: CorrectNameOptions, entityType: CorpTypeCd): any {
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    store.stateModel.amalgamation.type = AmalgamationTypes.REGULAR
    store.stateModel.correctNameOption = correctNameOption
    store.stateModel.entityType = entityType
    store.stateModel.nameRequestApprovedName = 'MY COMPANY NAME'
    return shallowMount(ResultingBusinessName, { vuetify })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the Edit button (not Undo) in display mode', () => {
    wrapper = mountComponent(CorrectNameOptions.CORRECT_AML_ADOPT, CorpTypeCd.BC_COMPANY)
    expect(wrapper.find('.btn-undo').exists()).toBe(false)
    expect(wrapper.find('.btn-edit').exists()).toBe(true)
    expect(wrapper.find('.btn-edit span').text()).toBe('Edit')
  })

  it('resets the name values when Edit is clicked', () => {
    wrapper = mountComponent(CorrectNameOptions.CORRECT_AML_ADOPT, CorpTypeCd.BC_COMPANY)
    // NB - v-btn is stubbed so call the click handler directly
    wrapper.vm.resetName()
    expect(store.stateModel.correctNameOption).toBeNull()
    expect(store.stateModel.nameRequestApprovedName).toBeNull()
    // entity type is not reset
    expect(store.stateModel.entityType).toBe(CorpTypeCd.BC_COMPANY)
  })

  const selectorTests = [
    { option: CorrectNameOptions.CORRECT_AML_ADOPT, entityType: CorpTypeCd.BC_COMPANY, expected: true },
    { option: CorrectNameOptions.CORRECT_AML_ADOPT, entityType: CorpTypeCd.BENEFIT_COMPANY, expected: true },
    { option: CorrectNameOptions.CORRECT_NEW_NR, entityType: CorpTypeCd.BC_COMPANY, expected: true },
    { option: CorrectNameOptions.CORRECT_NEW_NR, entityType: CorpTypeCd.BENEFIT_COMPANY, expected: true },
    { option: CorrectNameOptions.CORRECT_AML_ADOPT, entityType: CorpTypeCd.BC_CCC, expected: false },
    { option: CorrectNameOptions.CORRECT_AML_ADOPT, entityType: CorpTypeCd.BC_ULC_COMPANY, expected: false },
    { option: CorrectNameOptions.CORRECT_NEW_NR, entityType: CorpTypeCd.BC_ULC_COMPANY, expected: false },
    { option: CorrectNameOptions.CORRECT_AML_NUMBERED, entityType: CorpTypeCd.BC_COMPANY, expected: false },
    { option: CorrectNameOptions.CORRECT_AML_NUMBERED, entityType: CorpTypeCd.BENEFIT_COMPANY, expected: false }
  ]

  for (const test of selectorTests) {
    it(`${test.expected ? 'displays' : 'hides'} the Resulting Business Type selector for ` +
      `${test.option} / ${test.entityType}`, () => {
      wrapper = mountComponent(test.option, test.entityType)
      expect(wrapper.vm.isResultingBusinessTypeEditable).toBe(test.expected)
      expect(wrapper.find('#resulting-business-type').exists()).toBe(test.expected)
      expect(wrapper.find('#resulting-business-type-select').exists()).toBe(test.expected)
      // the read-only type (in NameRequestInfo) is hidden only when the selector is displayed
      expect(wrapper.findComponent(NameRequestInfo).props('displayResultingBusinessType')).toBe(!test.expected)
    })
  }

  it('offers only BC Limited Company and BC Benefit Company as resulting business types', () => {
    wrapper = mountComponent(CorrectNameOptions.CORRECT_NEW_NR, CorpTypeCd.BC_COMPANY)
    expect(wrapper.vm.resultingBusinessTypeItems).toEqual([
      { text: 'BC Limited Company', value: CorpTypeCd.BC_COMPANY },
      { text: 'BC Benefit Company', value: CorpTypeCd.BENEFIT_COMPANY }
    ])
  })

  it('updates the entity type and resources when the resulting business type is changed', () => {
    wrapper = mountComponent(CorrectNameOptions.CORRECT_NEW_NR, CorpTypeCd.BC_COMPANY)
    expect(store.getEntityType).toBe(CorpTypeCd.BC_COMPANY)

    wrapper.vm.onResultingBusinessTypeChange(CorpTypeCd.BENEFIT_COMPANY)
    expect(store.getEntityType).toBe(CorpTypeCd.BENEFIT_COMPANY)
    expect(store.resourceModel.entityType).toBe(CorpTypeCd.BENEFIT_COMPANY)

    wrapper.vm.onResultingBusinessTypeChange(CorpTypeCd.BC_COMPANY)
    expect(store.getEntityType).toBe(CorpTypeCd.BC_COMPANY)
    expect(store.resourceModel.entityType).toBe(CorpTypeCd.BC_COMPANY)
  })

  it('ignores an empty or unchanged resulting business type', () => {
    wrapper = mountComponent(CorrectNameOptions.CORRECT_NEW_NR, CorpTypeCd.BENEFIT_COMPANY)
    store.setResources(null)

    wrapper.vm.onResultingBusinessTypeChange(null)
    wrapper.vm.onResultingBusinessTypeChange(CorpTypeCd.BENEFIT_COMPANY)
    expect(store.getEntityType).toBe(CorpTypeCd.BENEFIT_COMPANY)
    expect(store.resourceModel).toBeNull()
  })
})

describe('Resulting Business Name component - fetchAndValidateNr', () => {
  let wrapper: any

  const nr = {
    applicants: {},
    consentFlag: null,
    expirationDate: '2099-12-31T07:00:00+00:00',
    names: [{ name: 'MY NR NAME', state: 'APPROVED' }],
    nrNum: 'NR 1234567',
    request_action_cd: NrRequestActionCodes.AMALGAMATE,
    requestTypeCd: 'BC',
    state: 'APPROVED'
  }

  beforeEach(() => {
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    store.stateModel.amalgamation.type = AmalgamationTypes.REGULAR
    wrapper = shallowMount(ResultingBusinessName, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
    vi.restoreAllMocks()
  })

  const nrTests = [
    { entityType: CorpTypeCd.BC_COMPANY, nrLegalType: CorpTypeCd.BC_COMPANY, valid: true },
    { entityType: CorpTypeCd.BC_COMPANY, nrLegalType: CorpTypeCd.BENEFIT_COMPANY, valid: true },
    { entityType: CorpTypeCd.BENEFIT_COMPANY, nrLegalType: CorpTypeCd.BC_COMPANY, valid: true },
    { entityType: CorpTypeCd.BENEFIT_COMPANY, nrLegalType: CorpTypeCd.BENEFIT_COMPANY, valid: true },
    { entityType: CorpTypeCd.BC_COMPANY, nrLegalType: CorpTypeCd.BC_ULC_COMPANY, valid: false },
    { entityType: CorpTypeCd.BENEFIT_COMPANY, nrLegalType: CorpTypeCd.BC_CCC, valid: false },
    { entityType: CorpTypeCd.BC_ULC_COMPANY, nrLegalType: CorpTypeCd.BC_ULC_COMPANY, valid: true },
    { entityType: CorpTypeCd.BC_ULC_COMPANY, nrLegalType: CorpTypeCd.BC_COMPANY, valid: false },
    { entityType: CorpTypeCd.BC_CCC, nrLegalType: CorpTypeCd.BENEFIT_COMPANY, valid: false }
  ]

  for (const test of nrTests) {
    it(`${test.valid ? 'accepts' : 'rejects'} a ${test.nrLegalType} NR for a ${test.entityType}`, async () => {
      store.stateModel.entityType = test.entityType
      const nameRequest = { ...nr, legalType: test.nrLegalType }
      vi.spyOn(LegalServices, 'fetchNameRequest').mockResolvedValue(nameRequest as any)

      const promise = wrapper.vm.fetchAndValidateNr('NR 1234567', '250-555-1234', 'a@b.c')
      if (test.valid) {
        await expect(promise).resolves.toEqual(nameRequest)
      } else {
        await expect(promise).rejects.toThrow('The Name Request is not intended for this business type.')
      }
    })
  }
})
