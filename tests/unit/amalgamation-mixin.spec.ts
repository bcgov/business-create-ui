/* eslint-disable max-len */
import { wrapperFactory } from '../vitest-wrapper-factory'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AmalgamationTypes, AmlRoles, AmlStatuses, AmlTypes, AuthorizationRoles, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AuthServices, LegalServices } from '@/services'
import { setAuthRole } from '../set-auth-role'

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
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // verify rule
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.LEAR, addresses: null })).toBe(AmlStatuses.ERROR_NOT_AFFILIATED)

    // verify staff only
    setAuthRole(store, AuthorizationRoles.STAFF)
    expect(wrapper.vm.notAffiliated({ type: AmlTypes.LEAR, addresses: null })).toBeNull()
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

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
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // verify rule
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: true })).toBe(AmlStatuses.ERROR_NOT_IN_GOOD_STANDING)

    // verify staff only
    setAuthRole(store, AuthorizationRoles.STAFF)
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: null })).toBeNull()
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // verify not LEAR only
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.FOREIGN, isNotInGoodStanding: true })).toBeNull()

    // verify not good standing only
    expect(wrapper.vm.notInGoodStanding({ type: AmlTypes.LEAR, isNotInGoodStanding: false })).toBeNull()
  })

  it('correctly evaluates "limitedRestoration" rule', () => {
    // init
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // verify rule
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.LEAR, isLimitedRestoration: true })).toBe(AmlStatuses.ERROR_LIMITED_RESTORATION)

    // verify staff only
    setAuthRole(store, AuthorizationRoles.STAFF)
    expect(wrapper.vm.limitedRestoration({ type: AmlTypes.LEAR, isLimitedRestoration: null })).toBeNull()
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

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
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // verify rule
    expect(wrapper.vm.foreign({ type: AmlTypes.FOREIGN })).toBe(AmlStatuses.ERROR_FOREIGN)

    // verify staff only
    setAuthRole(store, AuthorizationRoles.STAFF)
    expect(wrapper.vm.foreign({ type: AmlTypes.FOREIGN })).toBeNull()
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

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

describe('Amalgamation Mixin - COLIN business rules', () => {
  let wrapper: any

  const XPRO_COLIN = { type: AmlTypes.COLIN, legalType: CorpTypeCd.EXTRA_PRO_A }
  const BC_COLIN = { type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_COMPANY }

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
    vi.restoreAllMocks()
  })

  it('correctly evaluates helpers "isForeignOrXproColin" and "isLearOrBcColin"', () => {
    expect(wrapper.vm.isForeignOrXproColin({ type: AmlTypes.FOREIGN })).toBe(true)
    expect(wrapper.vm.isForeignOrXproColin(XPRO_COLIN)).toBe(true)
    expect(wrapper.vm.isForeignOrXproColin(BC_COLIN)).toBe(false)
    expect(wrapper.vm.isForeignOrXproColin({ type: AmlTypes.LEAR })).toBe(false)

    expect(wrapper.vm.isLearOrBcColin({ type: AmlTypes.LEAR })).toBe(true)
    expect(wrapper.vm.isLearOrBcColin(BC_COLIN)).toBe(true)
    expect(wrapper.vm.isLearOrBcColin(XPRO_COLIN)).toBe(false)
    expect(wrapper.vm.isLearOrBcColin({ type: AmlTypes.FOREIGN })).toBe(false)
  })

  it('applies the BC-company rules to COLIN businesses but not extrapro COLIN', () => {
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    expect(wrapper.vm.notAffiliated({ ...BC_COLIN, addresses: null })).toBe(AmlStatuses.ERROR_NOT_AFFILIATED)
    expect(wrapper.vm.notAffiliated({ ...BC_COLIN, addresses: {} })).toBeNull()
    expect(wrapper.vm.notAffiliated({ ...XPRO_COLIN, addresses: null })).toBeNull()

    expect(wrapper.vm.notHistorical({ ...BC_COLIN, isHistorical: true })).toBe(AmlStatuses.ERROR_HISTORICAL)
    expect(wrapper.vm.notHistorical({ ...XPRO_COLIN, isHistorical: true })).toBeNull()

    expect(wrapper.vm.notFrozen({ ...BC_COLIN, isFrozen: true })).toBe(AmlStatuses.ERROR_FROZEN)
    expect(wrapper.vm.notFrozen({ ...XPRO_COLIN, isFrozen: true })).toBeNull()

    // NB - the flag itself is computed as (goodStanding !== true) at row build time
    expect(wrapper.vm.notInGoodStanding({ ...BC_COLIN, isNotInGoodStanding: true })).toBe(AmlStatuses.ERROR_NOT_IN_GOOD_STANDING)
    expect(wrapper.vm.notInGoodStanding({ ...XPRO_COLIN, isNotInGoodStanding: true })).toBeNull()

    expect(wrapper.vm.futureEffectiveFiling({ ...BC_COLIN, isFutureEffective: true })).toBe(AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING)
    expect(wrapper.vm.futureEffectiveFiling({ ...XPRO_COLIN, isFutureEffective: true })).toBeNull()
  })

  it('keeps the LEAR-only rules off COLIN businesses', () => {
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    expect(wrapper.vm.limitedRestoration({ ...BC_COLIN, isLimitedRestoration: true })).toBeNull()
    expect(wrapper.vm.draftTask({ ...BC_COLIN, isDraftTask: true })).toBeNull()
    expect(wrapper.vm.pendingFiling({ ...BC_COLIN, isPendingFiling: true })).toBeNull()
  })

  it('applies the foreign rules to extrapro COLIN businesses', () => {
    // "foreign" rule (staff-only)
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)
    expect(wrapper.vm.foreign(XPRO_COLIN)).toBe(AmlStatuses.ERROR_FOREIGN)
    expect(wrapper.vm.foreign(BC_COLIN)).toBeNull()
    setAuthRole(store, AuthorizationRoles.STAFF)
    expect(wrapper.vm.foreign(XPRO_COLIN)).toBeNull()
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)

    // "foreignUnlimited" rule
    vi.spyOn(wrapper.vm, 'isAnyBcCompany', 'get').mockReturnValue(true)
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)
    expect(wrapper.vm.foreignUnlimited(XPRO_COLIN)).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED)
    expect(wrapper.vm.foreignUnlimited(BC_COLIN)).toBeNull()

    // "xproUlcCcc" rule
    expect(wrapper.vm.xproUlcCcc(XPRO_COLIN)).toBe(AmlStatuses.ERROR_XPRO_ULC_CCC)
    expect(wrapper.vm.xproUlcCcc(BC_COLIN)).toBeNull()
    store.setEntityType(null)

    // "foreignHorizontal" rule
    store.setFilingType(FilingTypes.AMALGAMATION_APPLICATION)
    store.setAmalgamationType(AmalgamationTypes.HORIZONTAL)
    expect(wrapper.vm.foreignHorizontal(XPRO_COLIN)).toBe(AmlStatuses.ERROR_FOREIGN_HORIZONTAL)
    expect(wrapper.vm.foreignHorizontal(BC_COLIN)).toBeNull()
    store.setAmalgamationType(null)
  })

  it('applies the mix rules to non-extrapro COLIN businesses', () => {
    // "cccMismatch" rule
    store.setEntityType(null)
    expect(wrapper.vm.cccMismatch({ type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_CCC })).toBe(AmlStatuses.ERROR_CCC_MISMATCH)

    // "foreignUnlimited2" rule
    vi.spyOn(wrapper.vm, 'isAnyForeign', 'get').mockReturnValue(true)
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)
    expect(wrapper.vm.foreignUnlimited2(BC_COLIN)).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED2)

    // "foreignUnlimited3" rule
    expect(wrapper.vm.foreignUnlimited3({ type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_ULC_COMPANY })).toBe(AmlStatuses.ERROR_FOREIGN_UNLIMITED3)
    store.setEntityType(null)
  })

  it('counts COLIN businesses in the isAny helpers', () => {
    store.setAmalgamatingBusinesses([BC_COLIN as any])
    expect(wrapper.vm.isAnyLimited).toBe(true)
    expect(wrapper.vm.isAnyBcCompany).toBe(true)
    expect(wrapper.vm.isAnyForeign).toBe(false)

    store.setAmalgamatingBusinesses([{ type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_ULC_COMPANY } as any])
    expect(wrapper.vm.isAnyUnlimited).toBe(true)

    store.setAmalgamatingBusinesses([{ type: AmlTypes.COLIN, legalType: CorpTypeCd.BC_CCC } as any])
    expect(wrapper.vm.isAnyCcc).toBe(true)

    // an extrapro COLIN business counts as a foreign, not a BC company
    store.setAmalgamatingBusinesses([XPRO_COLIN as any])
    expect(wrapper.vm.isAnyBcCompany).toBe(false)
    expect(wrapper.vm.isAnyForeign).toBe(true)

    store.setAmalgamatingBusinesses([])
  })
})

const COLIN_SNAPSHOT = {
  business: {
    identifier: 'BC7654321',
    legalName: 'Colin Business Ltd',
    legalType: 'BC',
    state: 'ACTIVE',
    goodStanding: true,
    adminFreeze: false,
    hasFutureEffectiveFiling: false
  },
  parties: [
    {
      officer: { firstName: 'JOE', middleInitial: 'MICHAEL', lastName: 'SMITH', partyType: 'person', email: null as any },
      deliveryAddress: { streetAddress: 'delivery street' },
      mailingAddress: { streetAddress: 'mailing street' },
      roles: [{ roleType: 'Director', appointmentDate: null as any, cessationDate: null as any }]
    },
    {
      officer: { organizationName: 'NOT A DIRECTOR INC', partyType: 'organization' },
      roles: [{ roleType: 'Incorporator', appointmentDate: '2000-01-01', cessationDate: null as any }]
    }
  ],
  offices: {
    registeredOffice: {
      mailingAddress: { streetAddress: '123 Colin St', addressCity: 'Victoria', addressCountry: 'CA' },
      deliveryAddress: { streetAddress: '123 Colin St', addressCity: 'Victoria', addressCountry: 'CA' }
    }
  },
  shareClasses: [
    { name: 'Class A Shares', series: [{ name: 'Series A1 Shares' }] }
  ],
  resolutions: [{ date: '2020-05-13' }]
}

describe('Amalgamation Mixin - COLIN snapshot helpers', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
    vi.restoreAllMocks()
  })

  it('maps snapshot parties to org-persons (directors only, middleName rename)', () => {
    const orgPersons = wrapper.vm.colinOrgPersons(COLIN_SNAPSHOT)

    expect(orgPersons.length).toBe(1)
    expect(orgPersons[0].officer.firstName).toBe('JOE')
    expect(orgPersons[0].officer.middleName).toBe('MICHAEL')
    expect(orgPersons[0].officer.middleInitial).toBeUndefined()
    expect(orgPersons[0].officer.lastName).toBe('SMITH')
    expect(orgPersons[0].deliveryAddress).toEqual({ streetAddress: 'delivery street' })
    expect(orgPersons[0].mailingAddress).toEqual({ streetAddress: 'mailing street' })
    expect(orgPersons[0].roles).toEqual([{ roleType: 'Director', appointmentDate: null, cessationDate: null }])
  })

  it('maps snapshot share classes with type stamps', () => {
    const shareClasses = wrapper.vm.colinShareClasses(COLIN_SNAPSHOT)

    expect(shareClasses.length).toBe(1)
    expect(shareClasses[0].type).toBe('Class')
    expect(shareClasses[0].series[0].type).toBe('Series')
  })

  it('passes through snapshot resolutions', () => {
    expect(wrapper.vm.colinResolutions(COLIN_SNAPSHOT)).toEqual([{ date: '2020-05-13' }])
    expect(wrapper.vm.colinResolutions({ ...COLIN_SNAPSHOT, resolutions: undefined })).toEqual([])
  })

  it('fetches COLIN business info - success', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue({ contacts: [] })
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue(COLIN_SNAPSHOT)

    const result = await wrapper.vm.fetchColinBusinessInfo('BC7654321')

    expect(result.authInfo).toEqual({ contacts: [] })
    expect(result.snapshot).toEqual(COLIN_SNAPSHOT)
    expect(result.snapshotStatus).toBe(200)
  })

  it('fetches COLIN business info - HTTP failure, no auth info', async () => {
    const authSpy = vi.spyOn((AuthServices as any), 'fetchAuthInfo')
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockRejectedValue({ response: { status: 401 } })

    const result = await wrapper.vm.fetchColinBusinessInfo('BC7654321', false)

    expect(authSpy).not.toHaveBeenCalled()
    expect(result.authInfo).toBeNull()
    expect(result.snapshot).toBeNull()
    expect(result.snapshotStatus).toBe(401)
  })

  it('fetches COLIN business info - non-HTTP failure', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockRejectedValue(new Error('Invalid API response'))

    const result = await wrapper.vm.fetchColinBusinessInfo('BC7654321')

    expect(result.snapshot).toBeNull()
    expect(result.snapshotStatus).toBeNull()
  })
})

describe('Amalgamation Mixin - refetchAmalgamatingBusinessesInfo', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester)
  })

  afterEach(() => {
    wrapper.destroy()
    vi.restoreAllMocks()
  })

  it('keeps a COLIN business classified as COLIN (affiliated, not in LEAR)', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue({ contacts: [] })
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstTask').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue(COLIN_SNAPSHOT)

    store.setAmalgamatingBusinesses([
      { type: AmlTypes.COLIN, role: AmlRoles.AMALGAMATING, identifier: 'BC7654321' } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.COLIN)
    expect(business.name).toBe('Colin Business Ltd')
    expect(business.legalType).toBe('BC')
    expect(business.addresses).toEqual(COLIN_SNAPSHOT.offices)
    expect(business.isNotInGoodStanding).toBe(false)
    expect(business.isHistorical).toBe(false)
  })

  it('upgrades a COLIN business to LEAR when it is now managed in LEAR', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue({ contacts: [] })
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockResolvedValue({
      identifier: 'BC7654321',
      legalName: 'Migrated Business Ltd',
      legalType: CorpTypeCd.BC_COMPANY,
      state: 'ACTIVE',
      goodStanding: true
    })
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockResolvedValue({})
    vi.spyOn((LegalServices as any), 'fetchFirstTask').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockResolvedValue({ status: 'COMPLETED' })
    const colinSpy = vi.spyOn((LegalServices as any), 'fetchColinSnapshot')

    store.setAmalgamatingBusinesses([
      { type: AmlTypes.COLIN, role: AmlRoles.AMALGAMATING, identifier: 'BC7654321' } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.LEAR)
    expect(business.name).toBe('Migrated Business Ltd')
    expect(colinSpy).not.toHaveBeenCalled()
  })

  it('keeps a minimal COLIN row when affiliation is lost (snapshot unauthorized)', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue({ status: 'FORBIDDEN' })
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstTask').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockRejectedValue({ response: { status: 401 } })

    store.setAmalgamatingBusinesses([
      {
        type: AmlTypes.COLIN,
        role: AmlRoles.AMALGAMATING,
        identifier: 'BC7654321',
        name: 'Colin Business Ltd',
        legalType: CorpTypeCd.BC_COMPANY
      } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.COLIN)
    expect(business.name).toBe('Colin Business Ltd')
    expect(business.addresses).toBeUndefined()
  })

  it('rebuilds a full COLIN row from the snapshot when auth info is unavailable (staff)', async () => {
    // a staff account has no affiliation, so auth info resolves with an error marker,
    // but the snapshot is still available -- the row must keep its addresses
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue({ status: 'FORBIDDEN' })
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstTask').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockRejectedValue({ response: { status: 404 } })
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue(COLIN_SNAPSHOT)

    store.setAmalgamatingBusinesses([
      { type: AmlTypes.COLIN, role: AmlRoles.HOLDING, identifier: 'BC7654321' } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.COLIN)
    expect(business.role).toBe(AmlRoles.HOLDING)
    expect(business.name).toBe('Colin Business Ltd')
    expect(business.addresses).toEqual(COLIN_SNAPSHOT.offices)
    expect(business.authInfo).toBeUndefined()
  })

  it('re-fetches an extrapro COLIN business from the snapshot only', async () => {
    const authSpy = vi.spyOn((AuthServices as any), 'fetchAuthInfo')
    const learSpy = vi.spyOn((LegalServices as any), 'fetchBusinessInfo')
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue({
      business: { identifier: 'A1234567', legalName: 'Extra Pro Business', legalType: 'A', state: 'ACTIVE', jurisdiction: 'ON' }
    })

    store.setAmalgamatingBusinesses([
      { type: AmlTypes.COLIN, role: AmlRoles.AMALGAMATING, identifier: 'A1234567', legalType: CorpTypeCd.EXTRA_PRO_A } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.COLIN)
    expect(business.legalType).toBe(CorpTypeCd.EXTRA_PRO_A)
    expect(business.name).toBe('Extra Pro Business')
    expect(business.jurisdiction).toBe('ON')
    expect(authSpy).not.toHaveBeenCalled()
    expect(learSpy).not.toHaveBeenCalled()
  })

  it('keeps a minimal extrapro COLIN row when the snapshot fails', async () => {
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockRejectedValue({ response: { status: 500 } })

    store.setAmalgamatingBusinesses([
      {
        type: AmlTypes.COLIN,
        role: AmlRoles.AMALGAMATING,
        identifier: 'A1234567',
        name: 'Extra Pro Business',
        legalType: CorpTypeCd.EXTRA_PRO_A,
        jurisdiction: 'ON'
      } as any
    ])
    await wrapper.vm.refetchAmalgamatingBusinessesInfo()

    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.COLIN)
    expect(business.identifier).toBe('A1234567')
    expect(business.name).toBe('Extra Pro Business')
    expect(business.legalType).toBe(CorpTypeCd.EXTRA_PRO_A)
    expect(business.jurisdiction).toBe('ON')
  })
})

describe('Amalgamation Mixin - updatePrepopulatedData for COLIN', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    store.setAmalgamationType(AmalgamationTypes.VERTICAL)
    wrapper = wrapperFactory(MixinTester)
  })

  afterEach(() => {
    store.setAmalgamationType(null)
    wrapper.destroy()
    vi.restoreAllMocks()
  })

  it('populates offices, directors, shares and resolutions from the COLIN snapshot', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue(COLIN_SNAPSHOT)

    const business = {
      type: AmlTypes.COLIN,
      role: AmlRoles.AMALGAMATING,
      identifier: 'BC7654321',
      name: 'Colin Business Ltd',
      legalType: CorpTypeCd.BC_COMPANY,
      addresses: { registeredOffice: {} }
    } as any
    store.setAmalgamatingBusinesses([business])

    await wrapper.vm.updatePrepopulatedData(business, true)

    // role was assigned (vertical amalgamation)
    expect(business.role).toBe(AmlRoles.HOLDING)

    // addresses were refreshed from the snapshot
    expect(business.addresses).toEqual(COLIN_SNAPSHOT.offices)

    // directors / shares / resolutions were set from the snapshot
    expect(store.getAddPeopleAndRoleStep.orgPeople.length).toBe(1)
    expect(store.getAddPeopleAndRoleStep.orgPeople[0].officer.middleName).toBe('MICHAEL')
    expect(store.getCreateShareStructureStep.shareClasses.length).toBe(1)
    expect(store.getCreateShareStructureStep.shareClasses[0].type).toBe('Class')
    expect(store.getResolutions).toEqual([{ date: '2020-05-13' }])

    // no auth contact - business contact was cleared
    expect(store.getBusinessContact.email).toBe('')

    // resulting name and entity type were set
    expect(store.getNameRequestApprovedName).toBe('Colin Business Ltd')
    expect(store.getEntityType).toBe(CorpTypeCd.BC_COMPANY)
  })

  it('moves a newly selected holding business first and keeps other businesses in order', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockResolvedValue(COLIN_SNAPSHOT)

    const previousHolding = {
      type: AmlTypes.LEAR,
      role: AmlRoles.HOLDING,
      identifier: 'BC1111111'
    } as any
    const otherBusiness = {
      type: AmlTypes.LEAR,
      role: AmlRoles.AMALGAMATING,
      identifier: 'BC2222222'
    } as any
    const newHolding = {
      type: AmlTypes.COLIN,
      role: AmlRoles.AMALGAMATING,
      identifier: 'BC7654321',
      name: 'Colin Business Ltd',
      legalType: CorpTypeCd.BC_COMPANY,
      addresses: { registeredOffice: {} }
    } as any
    store.setAmalgamatingBusinesses([previousHolding, otherBusiness, newHolding])

    await wrapper.vm.updatePrepopulatedData(newHolding, true)

    expect(store.getAmalgamatingBusinesses.map(business => business.identifier)).toEqual([
      'BC7654321',
      'BC1111111',
      'BC2222222'
    ])
    expect(previousHolding.role).toBe(AmlRoles.AMALGAMATING)
    expect(newHolding.role).toBe(AmlRoles.HOLDING)
  })

  it('throws when the snapshot cannot be fetched', async () => {
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockResolvedValue(null)
    vi.spyOn((LegalServices as any), 'fetchColinSnapshot').mockRejectedValue({ response: { status: 500 } })

    const business = {
      type: AmlTypes.COLIN,
      role: AmlRoles.AMALGAMATING,
      identifier: 'BC7654321',
      addresses: { registeredOffice: {} }
    } as any

    await expect(wrapper.vm.updatePrepopulatedData(business)).rejects.toThrow('Unable to fetch COLIN snapshot')
  })
})
