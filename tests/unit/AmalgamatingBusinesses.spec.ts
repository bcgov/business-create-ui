/* eslint-disable max-len */
import Vue from 'vue'
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount, shallowMount } from '@vue/test-utils'
import AmalgamatingBusinesses from '@/components/Amalgamation/AmalgamatingBusinesses.vue'
import BusinessTable from '@/components/Amalgamation/BusinessTable.vue'
import { AmlRoles, AmlTypes, FilingStatus } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AmalgamationTypes, EntityStates, FilingTypes, RestorationTypes } from '@bcrs-shared-components/enums'
import { AuthServices, LegalServices } from '@/services'
import { AmalgamatingBusinessIF } from '@/interfaces'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Amalgamating Businesses - components and validity', () => {
  let wrapper: any

  beforeEach(() => {
    // initial state
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION

    wrapper = mount(AmalgamatingBusinesses, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders as staff', async () => {
    // set state
    store.setKeycloakRoles(['staff'])
    await Vue.nextTick()

    // verify components
    expect(wrapper.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-foreign-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)
    expect(wrapper.findComponent(BusinessTable).exists()).toBe(true)
    expect(wrapper.find('.v-snack').exists()).toBe(true)
  })

  it('renders as non-staff', async () => {
    // set state
    store.setKeycloakRoles([])
    await Vue.nextTick()

    // verify components
    expect(wrapper.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-foreign-business-button').exists()).toBe(false)
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)
    expect(wrapper.findComponent(BusinessTable).exists()).toBe(true)
    expect(wrapper.find('.v-snack').exists()).toBe(true)
  })

  it('computes haveHoldingBusiness correctly', () => {
    // verify with no holding businesses
    store.stateModel.amalgamation.amalgamatingBusinesses = []
    expect(wrapper.vm.haveHoldingBusiness).toBe(false)

    // verify with a holding business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      { role: AmlRoles.HOLDING } as AmalgamatingBusinessIF
    ]
    expect(wrapper.vm.haveHoldingBusiness).toBe(true)
  })

  it('computes havePrimaryBusiness correctly', () => {
    // verify with no holding businesses
    store.stateModel.amalgamation.amalgamatingBusinesses = []
    expect(wrapper.vm.havePrimaryBusiness).toBe(false)

    // verify with a holding business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      { role: AmlRoles.PRIMARY } as AmalgamatingBusinessIF
    ]
    expect(wrapper.vm.havePrimaryBusiness).toBe(true)
  })

  it('computes haveAmalgamatingBusinesses correctly - regular amalgamation', () => {
    store.stateModel.amalgamation.type = AmalgamationTypes.REGULAR

    // verify amalgamation with less than 2 amalgamating businesses
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      { role: AmlRoles.AMALGAMATING } as AmalgamatingBusinessIF
    ]
    expect(wrapper.vm.haveAmalgamatingBusinesses).toBe(false)

    // verify amalgamation with 2 amalgamating businesses
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      { role: AmlRoles.AMALGAMATING } as AmalgamatingBusinessIF,
      { role: AmlRoles.AMALGAMATING } as AmalgamatingBusinessIF
    ]
    expect(wrapper.vm.haveAmalgamatingBusinesses).toBe(true)
  })

  it('computes haveAmalgamatingBusinesses correctly - short-form amalgamation', () => {
    store.stateModel.amalgamation.type = AmalgamationTypes.HORIZONTAL

    // verify with less than 1 amalgamating business
    store.stateModel.amalgamation.amalgamatingBusinesses = []
    expect(wrapper.vm.haveAmalgamatingBusinesses).toBe(false)

    // verify with 1 amalgamating business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      { role: AmlRoles.AMALGAMATING } as AmalgamatingBusinessIF
    ]
    expect(wrapper.vm.haveAmalgamatingBusinesses).toBe(true)
  })
})

describe('Amalgamating Businesses - computes businessTableValid correctly', () => {
  const businessTableValidTests = [
    // NB: for regular, haveHoldingBusiness isn't used
    { type: AmalgamationTypes.REGULAR, haveAmalgamatingBusinesses: false, allOk: false, expected: false },
    { type: AmalgamationTypes.REGULAR, haveAmalgamatingBusinesses: false, allOk: true, expected: false },
    { type: AmalgamationTypes.REGULAR, haveAmalgamatingBusinesses: true, allOk: false, expected: false },
    { type: AmalgamationTypes.REGULAR, haveAmalgamatingBusinesses: true, allOk: true, expected: true },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: false, haveAmalgamatingBusinesses: false, allOk: false, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: false, haveAmalgamatingBusinesses: false, allOk: true, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: false, haveAmalgamatingBusinesses: true, allOk: false, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: false, haveAmalgamatingBusinesses: true, allOk: true, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: true, haveAmalgamatingBusinesses: false, allOk: false, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: true, haveAmalgamatingBusinesses: false, allOk: true, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: true, haveAmalgamatingBusinesses: true, allOk: false, expected: false },
    { type: AmalgamationTypes.VERTICAL, haveHoldingBusiness: true, haveAmalgamatingBusinesses: true, allOk: true, expected: true }
  ]

  for (let i = 0; i < businessTableValidTests.length; i++) {
    it(`test ${i}`, () => {
      store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
      store.stateModel.amalgamation.type = businessTableValidTests[i].type

      // NB: use shallowMount so BusinessTable doesn't affect data
      const wrapper = shallowMount(AmalgamatingBusinesses, {
        computed: {
          haveAmalgamatingBusinesses: {
            get (): boolean { return businessTableValidTests[i].haveAmalgamatingBusinesses }
          },
          haveHoldingBusiness: {
            get (): boolean { return businessTableValidTests[i].haveHoldingBusiness }
          }
        },
        data: () => ({ allOk: businessTableValidTests[i].allOk }),
        vuetify
      }) as any

      // verify store getter
      expect(wrapper.vm.businessTableValid).toBe(businessTableValidTests[i].expected)

      wrapper.destroy()
    })
  }
})

describe('Amalgamating Businesses - validates component correctly', () => {
  const amalgamatingBusinessesValidTests = [
    { businessTableValid: false, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: false, expected: true },
    { businessTableValid: true, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: true, expected: false }
  ]

  for (let i = 0; i < amalgamatingBusinessesValidTests.length; i++) {
    it(`test ${i}`, () => {
      // NB: use shallowMount so BusinessTable doesn't affect data
      const wrapper = shallowMount(AmalgamatingBusinesses, {
        computed: {
          businessTableValid: {
            get (): boolean { return amalgamatingBusinessesValidTests[i].businessTableValid }
          }
        },
        data: () => ({
          isAddingAmalgamatingBusiness: amalgamatingBusinessesValidTests[i].isAddingAmalgamatingBusiness,
          isAddingAmalgamatingForeignBusiness: amalgamatingBusinessesValidTests[i].isAddingAmalgamatingForeignBusiness
        }),
        vuetify
      }) as any

      // call function and verify store getter
      wrapper.vm.onBusinessTableValid()
      expect(store.getAmalgamatingBusinessesValid).toBe(amalgamatingBusinessesValidTests[i].expected)

      wrapper.destroy()
    })
  }
})

describe('Amalgamating Businesses - add amalgamating business', () => {
  let wrapper: any

  beforeEach(() => {
    // initial state
    store.stateModel.tombstone.keycloakRoles = []
    store.stateModel.amalgamation.amalgamatingBusinesses = []

    wrapper = mount(AmalgamatingBusinesses, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('conditionally renders the amalgamating business panel', async () => {
    // verify panel not yet rendered
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)

    // verify Add button is enabled
    const addAmalgamatingButton = wrapper.find('#add-amalgamating-business-button')
    expect(addAmalgamatingButton.classes()).not.toContain('v-btn--disabled')

    // verify Add button and click it
    expect(addAmalgamatingButton.text()).toBe('Add an Amalgamating Business')
    await addAmalgamatingButton.trigger('click')

    // verify Add button is now disabled
    expect(addAmalgamatingButton.classes()).toContain('v-btn--disabled')

    // verify panel is now rendered
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(true)

    // verify Cancel button and click it
    const cancelButton = wrapper.find('#app-cancel-btn')
    expect(cancelButton.text()).toBe('Cancel')
    await cancelButton.trigger('click')

    // verify panel is no longer rendered
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)
  })

  it('saves an amalgamating business - Extra Pro', async () => {
    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // simulate saving an extra pro business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.EXTRA_PRO_A,
      name: 'Extra Pro Business',
      identifier: 'A1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)
    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.FOREIGN)
    expect(business.role).toBe(AmlRoles.AMALGAMATING)
    expect(business.foreignJurisdiction).toEqual({ country: 'CA', region: 'British Columbia' })
    expect(business.legalName).toBe('Extra Pro Business')
    expect(business.identifier).toBe('A1234567')

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingBusiness).toBe(false)
  })

  it('saves an amalgamating business - BC - unaffiliated - non-staff', async () => {
    // set state
    store.setKeycloakRoles([])
    await Vue.nextTick()

    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => null)

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)
    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.LEAR)
    expect(business.role).toBe(AmlRoles.AMALGAMATING)
    expect(business.identifier).toBe('BC1234567')
    expect(business.name).toBe('My BC Business')

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingBusiness).toBe(false)

    vi.resetAllMocks()
  })

  it('doesn\'t save an amalgamating business - BC - unaffiliated - staff', async () => {
    // set state
    store.setKeycloakRoles(['staff'])
    await Vue.nextTick()

    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => null)

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(0)

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Business doesn\'t exist in LEAR.')

    vi.resetAllMocks()
  })

  it('doesn\'t save an amalgamating business - BC - missing business info', async () => {
    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => ({}))

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(0)

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Unable to add that business.')

    vi.resetAllMocks()
  })

  it('doesn\'t save an amalgamating business - BC - missing addresses', async () => {
    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => null)
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => ({}))

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(0)

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Unable to add that business.')

    vi.resetAllMocks()
  })

  it('doesn\'t save an amalgamating business - BC - missing first filing', async () => {
    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => ({}))
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => null)

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(0)

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Unable to add that business.')

    vi.resetAllMocks()
  })

  it('doesn\'t save a duplicate amalgamating business - Extra Pro', async () => {
    // pre-populate an extra pro business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      {
        type: AmlTypes.FOREIGN,
        role: AmlRoles.AMALGAMATING,
        foreignJurisdiction: { country: 'CA', region: 'British Columbia' },
        legalName: 'Extra Pro Business',
        identifier: 'A1234567'
      }
    ]
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // verify snackbar is not displayed
    expect(wrapper.vm.snackbar).toBe(false)

    // try to save a duplicate extra pro business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.EXTRA_PRO_A,
      name: 'Extra Pro Business',
      identifier: 'A1234567'
    })

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Business is already in table.')

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingBusiness).toBe(false)
  })

  it('save an amalgamating business - BC', async () => {
    // set state
    store.setCurrentDate('2023-01-01')
    await Vue.nextTick()

    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => ({
      contacts: [{ email: 'email@example.com' }]
    }))
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => ({
      identifier: 'BC1234567',
      legalName: 'My BC Business',
      legalType: CorpTypeCd.BC_COMPANY,
      goodStanding: true,
      adminFreeze: false,
      state: EntityStates.ACTIVE,
      stateFiling: 'mock_url',
      restorationExpiryDate: '2023-01-18'
    }))
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => ({
      registeredOffice: { mailingAddress: { streetAddress: '123 Main St' } }
    }))
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => ({
      isFutureEffective: false,
      status: FilingStatus.COMPLETED
    }))
    // in this case, return a promise so that ".catch()" is defined on the implementation
    vi.spyOn((LegalServices as any), 'fetchFiling').mockImplementation(() =>
      Promise.resolve({
        restoration: { type: RestorationTypes.FULL }
      })
    )

    // simulate saving a BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)
    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.LEAR)
    expect(business.role).toBe(AmlRoles.AMALGAMATING)
    expect(business.identifier).toBe('BC1234567')
    expect(business.name).toBe('My BC Business')
    expect(business.authInfo.contacts[0].email).toBe('email@example.com')
    expect(business.legalType).toBe(CorpTypeCd.BC_COMPANY)
    expect(business.addresses.registeredOffice.mailingAddress.streetAddress).toBe('123 Main St')
    expect(business.isNotInGoodStanding).toBe(false)
    expect(business.isFrozen).toBe(false)
    expect(business.isFutureEffective).toBe(false)
    expect(business.isPendingFiling).toBe(false)
    expect(business.isLimitedRestoration).toBe(false)
    expect(business.isHistorical).toBe(false)

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingBusiness).toBe(false)

    vi.resetAllMocks()
  })

  it('doesn\'t save a duplicate amalgamating business - BC', async () => {
    // pre-populate a BC business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      {
        // this is the minimum data needed
        type: AmlTypes.LEAR,
        role: AmlRoles.AMALGAMATING,
        identifier: 'BC1234567'
      }
    ]
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // open panel
    await wrapper.setData({ isAddingAmalgamatingBusiness: true })

    // verify snackbar is not displayed
    expect(wrapper.vm.snackbar).toBe(false)

    // mock services functions
    vi.spyOn((AuthServices as any), 'fetchAuthInfo').mockImplementation(() => ({
      contacts: [{ email: 'email@example.com' }]
    }))
    vi.spyOn((LegalServices as any), 'fetchBusinessInfo').mockImplementation(() => ({
      identifier: 'BC1234567',
      legalName: 'My BC Business',
      legalType: CorpTypeCd.BC_COMPANY,
      goodStanding: true,
      adminFreeze: false,
      state: EntityStates.ACTIVE,
      stateFiling: 'mock_url',
      restorationExpiryDate: '2023-01-18'
    }))
    vi.spyOn((LegalServices as any), 'fetchAddresses').mockImplementation(() => ({
      registeredOffice: { mailingAddress: { streetAddress: '123 Main St' } }
    }))
    vi.spyOn((LegalServices as any), 'fetchFirstOrOnlyFiling').mockImplementation(() => ({
      isFutureEffective: false,
      status: FilingStatus.COMPLETED
    }))
    // in this case, return a promise so that ".catch()" is defined on the implementation
    vi.spyOn((LegalServices as any), 'fetchFiling').mockImplementation(() =>
      Promise.resolve({
        restoration: { type: RestorationTypes.FULL }
      })
    )

    // try to save a duplicate BC business
    await wrapper.vm.saveAmalgamatingBusiness({
      legalType: CorpTypeCd.BC_COMPANY,
      name: 'My BC Business',
      identifier: 'BC1234567'
    })

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Business is already in table.')

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingBusiness).toBe(false)
  })
})

describe('Amalgamating Businesses - add amalgamating foreign business', () => {
  let wrapper: any

  beforeEach(() => {
    // initial state
    store.stateModel.tombstone.keycloakRoles = ['staff']
    store.stateModel.amalgamation.amalgamatingBusinesses = []

    wrapper = mount(AmalgamatingBusinesses, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('conditionally renders the foreign business panel', async () => {
    // verify panel not yet rendered
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)

    // verify Add buttons
    const addAmalgamatingButton = wrapper.find('#add-amalgamating-business-button')
    const addForeignButton = wrapper.find('#add-foreign-business-button')
    expect(addAmalgamatingButton.classes()).not.toContain('v-btn--disabled')
    expect(addForeignButton.classes()).not.toContain('v-btn--disabled')

    // verify Add Foreign button and click it
    expect(addForeignButton.text()).toBe('Add an Amalgamating Foreign Business')
    await addForeignButton.trigger('click')

    // verify Add buttons are now disabled
    expect(addAmalgamatingButton.classes()).toContain('v-btn--disabled')
    expect(addForeignButton.classes()).toContain('v-btn--disabled')

    // verify panel is now rendered
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(true)

    // verify Save button
    const saveButton = wrapper.find('#save-foreign-business-button')
    expect(saveButton.text()).toBe('Add')

    // verify Cancel button and click it
    const cancelButton = wrapper.find('#cancel-foreign-business-button')
    expect(cancelButton.text()).toBe('Cancel')
    await cancelButton.trigger('click')

    // verify panel is no longer rendered
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)
  })

  it('saves a foreign business', async () => {
    // open panel
    await wrapper.setData({ isAddingAmalgamatingForeignBusiness: true })

    // simulate form data
    await wrapper.setData({
      isCan: true,
      jurisdiction: { text: 'BC', value: 'CA' },
      legalName: 'Foreign Business',
      identifier: 'ABC-123'
    })

    // simulate Save button action
    wrapper.vm.saveAmalgamatingForeignBusiness()

    // verify validation
    expect(wrapper.vm.isForeignBusinessValid).toBe(true)

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)
    const business = store.getAmalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.FOREIGN)
    expect(business.role).toBe(AmlRoles.AMALGAMATING)
    expect(business.foreignJurisdiction).toEqual({ country: 'CA', region: 'BC' })
    expect(business.legalName).toBe('Foreign Business')
    expect(business.identifier).toBe('ABC-123')

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingForeignBusiness).toBe(false)
  })

  it('doesn\'t save a duplicate foreign business', async () => {
    // pre-populate a foreign business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      {
        type: AmlTypes.FOREIGN,
        role: AmlRoles.AMALGAMATING,
        foreignJurisdiction: { country: 'CA', region: 'British Columbia' },
        legalName: 'Foreign Business',
        identifier: 'ABC-123'
      }
    ]
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // open panel
    await wrapper.setData({ isAddingAmalgamatingForeignBusiness: true })

    // simulate form data
    await wrapper.setData({
      isCan: true,
      jurisdiction: { text: 'British Columbia', value: 'CA' },
      legalName: 'Foreign Business',
      identifier: 'ABC-123'
    })

    // verify snackbar is not displayed
    expect(wrapper.vm.snackbar).toBe(false)

    // try to save a duplicate foreign business
    wrapper.vm.saveAmalgamatingForeignBusiness()

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)
    expect(wrapper.vm.snackbarText).toBe('Business is already in table.')

    // verify data
    expect(store.getAmalgamatingBusinesses.length).toBe(1)

    // verify panel is still open
    expect(wrapper.vm.isAddingAmalgamatingForeignBusiness).toBe(true)
  })

  it('applies foreign business business legal name rules', async () => {
    // open panel
    await wrapper.find('#add-foreign-business-button').trigger('click')

    const legalName = wrapper.find('#foreign-business-legal-name')

    // verify empty legal name
    await legalName.setValue('')
    await legalName.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Full legal name is required')

    // verify legal name too short
    await legalName.setValue('xx')
    await legalName.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Must be at least 3 characters')

    // verify legal name too long
    await legalName.setValue('x'.repeat(151))
    await legalName.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Cannot exceed 150 characters')

    // verify valid legal name (max length)
    await legalName.setValue('x'.repeat(150))
    await legalName.trigger('change')
    expect(wrapper.find('.v-messages__message').exists()).toBe(false)
  })

  it('applies foreign business business corp number rules', async () => {
    // open panel
    await wrapper.find('#add-foreign-business-button').trigger('click')

    const identifier = wrapper.find('#foreign-business-corp-number')

    // verify empty legal name - MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: true })
    await identifier.setValue('')
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify empty legal name - non-MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: false })
    await identifier.setValue('')
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify invalid legal name - MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: true })
    await identifier.setValue('+++')
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify legal name too short
    await identifier.setValue('xx')
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Must be at least 3 characters')

    // verify legal name too long
    await identifier.setValue('x'.repeat(41))
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Cannot exceed 40 characters')

    // verify valid legal name (max length)
    await identifier.setValue('x'.repeat(40))
    await identifier.trigger('change')
    expect(wrapper.find('.v-messages__message').exists()).toBe(false)
  })

  it('handles foreign business business jurisdiction changes', async () => {
    // open panel
    await wrapper.find('#add-foreign-business-button').trigger('click')

    // simulate change action with null jurisdiction
    wrapper.vm.onJurisdictionChange(null)
    expect(wrapper.vm.jurisdictionErrorMessage).toBe('Home jurisdiction is required')

    // simulate change action with Canadian MRAS jurisdiction
    wrapper.vm.onJurisdictionChange({ group: 0, text: 'Alberta', value: 'AB' })
    expect(wrapper.vm.jurisdictionErrorMessage).toBe('')
    expect(wrapper.vm.isCan).toBe(true)
    expect(wrapper.vm.isMrasJurisdiction).toBe(true)

    // simulate change action with Canadian non-MRAS jurisdiction
    wrapper.vm.onJurisdictionChange({ group: 0, text: 'Nunavut', value: 'NU' })
    expect(wrapper.vm.jurisdictionErrorMessage).toBe('')
    expect(wrapper.vm.isCan).toBe(true)
    expect(wrapper.vm.isMrasJurisdiction).toBe(false)

    // simulate change action with international jurisdiction
    wrapper.vm.onJurisdictionChange({ group: 1, text: 'United States', value: 'US' })
    expect(wrapper.vm.jurisdictionErrorMessage).toBe('')
    expect(wrapper.vm.isCan).toBe(false)
    expect(wrapper.vm.isMrasJurisdiction).toBe(false)
  })
})
