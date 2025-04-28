/* eslint-disable max-len */
import { wrapperFactory } from '../vitest-wrapper-factory'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AmalgamationTypes, AmlStatuses, AmlTypes, AuthorizationRoles, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

setActivePinia(createPinia())
const store = useStore()

describe('Amalgamation Mixin - rules', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('has the expected number of rules', () => {
    expect(wrapper.vm.rules.length).toBe(16)
  })

  it('correctly evaluates "notAffiliated" rule', () => {
    // init
    store.setAuthRoles([])

    // verify rule
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.LEAR, addresses: null })).toBe(AmlStatuses.ERROR_NOT_AFFILIATED)

    // verify staff only
    store.setAuthRoles([AuthorizationRoles.STAFF])
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.LEAR, addresses: null })).toBeNull()
    store.setAuthRoles([])

    // verify not LEAR only
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.FOREIGN, addresses: null })).toBeNull()

    // verify address exists only
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.LEAR, addresses: {} })).toBeNull()
  })

  it('correctly evaluates "notHistorical" rule', () => {
    // verify rule
    expect(wrapper.vm.notHistorical({ type: AmlTypes.LEAR, isHistorical: true })).toBe(AmlStatuses.ERROR_HISTORICAL)

    // verify not LEAR only
    expect(wrapper.vm.notHistorical({ type: AmlTypes.FOREIGN, isHistorical: true })).toBeNull()

    // verify not historical only
    expect(wrapper.vm.notHistorical({ type: AmlTypes.LEAR, isHistorical: false })).toBeNull()
  })

  it('correctly evaluates "notFrozen" rule', () => {
    // verify rule
    expect(wrapper.vm.notFrozen({ type: AmlTypes.LEAR, isFrozen: true })).toBe(AmlStatuses.ERROR_FROZEN)

    // verify not LEAR only
    expect(wrapper.vm.notFrozen({ type: AmlTypes.FOREIGN, isFrozen: true })).toBeNull()

    // verify not frozen only
    expect(wrapper.vm.notFrozen({ type: AmlTypes.LEAR, isFrozen: false })).toBeNull()
  })

  it('correctly evaluates "notInGoodStanding" rule', () => {
    // init
    store.setAuthRoles([])

    // verify rule
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: true })).toBe(AmlStatuses.ERROR_NOT_IN_GOOD_STANDING)

    // verify staff only
    store.setAuthRoles([AuthorizationRoles.STAFF])
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: null })).toBeNull()
    store.setAuthRoles([])

    // verify not LEAR only
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.FOREIGN, isNotInGoodStanding: true })).toBeNull()

    // verify not good standing only
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: false })).toBeNull()
  })

  it('correctly evaluates "limitedRestoration" rule', () => {
    // init
    store.setAuthRoles([])

    // verify rule
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.LEAR, isLimitedRestoration: true })).toBe(AmlStatuses.ERROR_LIMITED_RESTORATION)

    // verify staff only
    store.setAuthRoles([AuthorizationRoles.STAFF])
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.LEAR, isLimitedRestoration: null })).toBeNull()
    store.setAuthRoles([])

    // verify not LEAR only
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.FOREIGN, isLimitedRestoration: true })).toBeNull()

    // verify not limited restoration only
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.LEAR, isLimitedRestoration: false })).toBeNull()
  })

  it('correctly evaluates "futureEffectiveFiling" rule', () => {
    // verify rule
    expect(wrapper.vm.futureEffectiveFiling({ type: AmlTypes.LEAR, isFutureEffective: true })).toBe(AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING)

    // verify not LEAR only
    expect(wrapper.vm.futureEffectiveFiling({ type: AmlTypes.FOREIGN, isFutureEffective: true })).toBeNull()

    // verify not future effective only
    expect(wrapper.vm.futureEffectiveFiling({ type: AmlTypes.LEAR, isFutureEffective: false })).toBeNull()
  })

  it('correctly evaluates "draftTask" rule', () => {
    // verify rule
    expect(wrapper.vm.draftTask({ type: AmlTypes.LEAR, isDraftTask: true })).toBe(AmlStatuses.ERROR_DRAFT_TASK)

    // verify not LEAR only
    expect(wrapper.vm.draftTask({ type: AmlTypes.FOREIGN, isDraftTask: true })).toBeNull()

    // verify not draft task only
    expect(wrapper.vm.draftTask({ type: AmlTypes.LEAR, isDraftTask: false })).toBeNull()
  })

  it('correctly evaluates "pendingFiling" rule', () => {
    // verify rule
    expect(wrapper.vm.pendingFiling({ type: AmlTypes.LEAR, isPendingFiling: true })).toBe(AmlStatuses.ERROR_PENDING_FILING)

    // verify not LEAR only
    expect(wrapper.vm.pendingFiling({ type: AmlTypes.FOREIGN, isPendingFiling: true })).toBeNull()

    // verify not pending filing only
    expect(wrapper.vm.pendingFiling({ type: AmlTypes.LEAR, isPendingFiling: false })).toBeNull()
  })

  it('correctly evaluates "foreign" rule', () => {
    // init
    store.setAuthRoles([])

    // verify rule
    expect(wrapper.vm.foreign({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_FOREIGN)

    // verify staff only
    store.setAuthRoles([AuthorizationRoles.STAFF])
    expect(wrapper.vm.foreign({ type: AmlTypes.FOREIGN })).toBeNull()
    store.setAuthRoles([])

    // verify not FOREIGN only
    expect(wrapper.vm.foreign({ type: AmlTypes.LEAR })).toBeNull()
  })

  it('correctly evaluates "foreignUnlimited" rule', () => {
    // init
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(true)
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)

    // verify rule
    expect(wrapper.vm.foreignUnlimited({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED)

    // verify not FOREIGN only
    expect(wrapper.vm.foreignUnlimited({ type: AmlTypes.LEAR })).toBeNull()

    // verify not any BC company only
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(false)
    expect(wrapper.vm.foreignUnlimited({ type: AmlTypes.FOREIGN })).toBeNull()
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(true)

    // verify not ULC only
    store.setEntityType(null)
    expect(wrapper.vm.foreignUnlimited({ type: AmlTypes.FOREIGN })).toBeNull()
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)
  })

  it('correctly evaluates "cccMismatch" rule', () => {
    // init
    store.setEntityType(null)

    // verify rule
    expect(wrapper.vm.cccMismatch({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_CCC })).toBe(AmlStatuses.ERROR_CCC_MISMATCH)

    // verify not LEAR only
    expect(wrapper.vm.cccMismatch({ type: AmlTypes.FOREIGN, legalType: CorpTypeCd.BC_CCC })).toBeNull()

    // verify not legalType only
    expect(wrapper.vm.cccMismatch({ type: AmlTypes.LEAR, legalType: null })).toBeNull()

    // verify not CCC only
    store.setEntityType(CorpTypeCd.BC_CCC)
    expect(wrapper.vm.cccMismatch({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_CCC })).toBeNull()
  })

  it('correctly evaluates "foreignUnlimited2" rule', () => {
    // init
    vi.spyOn(wrapper.vm, 'isAnyForeign', 'get').mockReturnValue(true)
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)

    // verify rule
    expect(wrapper.vm.foreignUnlimited2({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_COMPANY })).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED2)

    // verify not LEAR only
    expect(wrapper.vm.foreignUnlimited2({ type: AmlTypes.FOREIGN, legalType: CorpTypeCd.BC_COMPANY })).toBeNull()

    // verify not legalType only
    expect(wrapper.vm.foreignUnlimited2({ type: AmlTypes.LEAR, legalType: null })).toBeNull()

    // verify not ULC only
    store.setEntityType(null)
    expect(wrapper.vm.foreignUnlimited2({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_COMPANY })).toBeNull()
  })

  it('correctly evaluates "xproUlcCcc" rule - for ULC', () => {
    // init
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)

    // verify rule
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_XPRO_ULC_CCC)

    // verify not FOREIGN only
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.LEAR })).toBeNull()

    // verify not ULC or CCC only
    store.setEntityType(null)
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.FOREIGN })).toBeNull()
  })

  it('correctly evaluates "xproUlcCcc" rule - for CCC', () => {
    // init
    store.setEntityType(CorpTypeCd.BC_CCC)

    // verify rule
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_XPRO_ULC_CCC)

    // verify not FOREIGN only
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.LEAR })).toBeNull()

    // verify not ULC or CCC only
    store.setEntityType(null)
    expect(wrapper.vm.xproUlcCcc({ type: AmlTypes.FOREIGN })).toBeNull()
  })

  it('correctly evaluates "foreignUnlimited3" rule', () => {
    // init
    vi.spyOn(wrapper.vm, 'isAnyForeign', 'get').mockReturnValue(true)

    // verify rule
    expect(wrapper.vm.foreignUnlimited3({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_ULC_COMPANY })).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED3)

    // verify not LEAR only
    expect(wrapper.vm.foreignUnlimited3({ type: AmlTypes.FOREIGN, legalType: CorpTypeCd.BC_ULC_COMPANY })).toBeNull()

    // verify not legalType only
    expect(wrapper.vm.foreignUnlimited3({ type: AmlTypes.LEAR, legalType: null })).toBeNull()

    // verify not foreign only
    vi.spyOn(wrapper.vm, 'isAnyForeign', 'get').mockReturnValue(false)
    expect(wrapper.vm.foreignUnlimited3({ type: AmlTypes.LEAR, legalType: CorpTypeCd.BC_ULC_COMPANY })).toBeNull()
  })

  it('correctly evaluates "needBcCompany" rule', () => {
    // init
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(false)

    // verify rule
    expect(wrapper.vm.needBcCompany()).toBe(AmlStatuses.ERROR_NEED_BC_COMPANY)

    // verify not BC company only
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(true)
    expect(wrapper.vm.needBcCompany()).toBeNull()
  })

  it('correctly evaluates "foreignHorizontal" rule', () => {
    // init
    store.setFilingType(FilingTypes.AMALGAMATION_APPLICATION)
    store.setAmalgamationType(AmalgamationTypes.HORIZONTAL)

    // verify rule
    expect(wrapper.vm.foreignHorizontal({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_FOREIGN_HORIZONTAL)

    // verify not FOREIGN only
    expect(wrapper.vm.foreignHorizontal({ type: AmlTypes.LEAR })).toBeNull()

    // verify not horizontal only
    store.setAmalgamationType(null)
    expect(wrapper.vm.foreignHorizontal({ type: AmlTypes.FOREIGN })).toBeNull()
  })

  it('should set the correct entity type based on the primary company legal type', () => {
    const setEntityTypeSpy = vi.spyOn(wrapper.vm, 'setEntityType')
    const testCases = [
      { input: CorpTypeCd.CONTINUE_IN, expected: CorpTypeCd.BC_COMPANY },
      { input: CorpTypeCd.BEN_CONTINUE_IN, expected: CorpTypeCd.BENEFIT_COMPANY },
      { input: CorpTypeCd.CCC_CONTINUE_IN, expected: CorpTypeCd.BC_CCC },
      { input: CorpTypeCd.ULC_CONTINUE_IN, expected: CorpTypeCd.BC_ULC_COMPANY },
      { input: CorpTypeCd.BC_ULC_COMPANY, expected: CorpTypeCd.BC_ULC_COMPANY },
      { input: CorpTypeCd.BC_COMPANY, expected: CorpTypeCd.BC_COMPANY },
      { input: CorpTypeCd.BENEFIT_COMPANY, expected: CorpTypeCd.BENEFIT_COMPANY },
      { input: CorpTypeCd.BC_CCC, expected: CorpTypeCd.BC_CCC }
    ]
    testCases.forEach(testCase => {
      setEntityTypeSpy.mockClear()
      const legalType = wrapper.vm.getLegalType(testCase.input)
      wrapper.vm.setEntityType(legalType)
      expect(setEntityTypeSpy).toHaveBeenCalledWith(testCase.expected)
    })
    setEntityTypeSpy.mockRestore()
  })
})
