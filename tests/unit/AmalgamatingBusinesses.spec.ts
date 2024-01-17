/* eslint-disable max-len */
import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import AmalgamatingBusinesses from '@/components/Amalgamation/AmalgamatingBusinesses.vue'
import BusinessTable from '@/components/Amalgamation/BusinessTable.vue'
import { AmlRoles, AmlTypes } from '@/enums/amalgamationEnums'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('Amalgamating Businesses - components and validity', () => {
  it('renders as non-staff', async () => {
    // initial state
    store.stateModel.tombstone.keycloakRoles = []

    const wrapper = mount(AmalgamatingBusinesses, { vuetify })

    // verify components
    expect(wrapper.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-foreign-business-button').exists()).toBe(false)
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)
    expect(wrapper.findComponent(BusinessTable).exists()).toBe(true)
    expect(wrapper.find('.v-snack').exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders as staff', async () => {
    // initial state
    store.stateModel.tombstone.keycloakRoles = ['staff']

    const wrapper = mount(AmalgamatingBusinesses, { vuetify })

    // verify components
    expect(wrapper.findComponent(AmalgamatingBusinesses).exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-foreign-business-button').exists()).toBe(true)
    expect(wrapper.find('#add-amalgamating-business-panel').exists()).toBe(false)
    expect(wrapper.find('#add-foreign-business-panel').exists()).toBe(false)
    expect(wrapper.findComponent(BusinessTable).exists()).toBe(true)
    expect(wrapper.find('.v-snack').exists()).toBe(true)

    wrapper.destroy()
  })

  const tests = [
    { businessTableValid: false, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: false, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: false, expected: true },
    { businessTableValid: true, isAddingAmalgamatingBusiness: false, isAddingAmalgamatingForeignBusiness: true, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: false, expected: false },
    { businessTableValid: true, isAddingAmalgamatingBusiness: true, isAddingAmalgamatingForeignBusiness: true, expected: false }
  ]

  for (let i = 0; i < tests.length; i++) {
    const { businessTableValid, isAddingAmalgamatingBusiness, isAddingAmalgamatingForeignBusiness, expected } = tests[i]
    it(`validates component - test ${i}`, async () => {
      const wrapper = mount(AmalgamatingBusinesses, { vuetify })

      // set data and validate validity
      await wrapper.setData({ businessTableValid, isAddingAmalgamatingBusiness, isAddingAmalgamatingForeignBusiness })
      expect(store.stateModel.amalgamation.amalgamatingBusinessesValid).toBe(expected)

      wrapper.destroy()
    })
  }
})

describe.skip('Amalgamating Businesses - add amalgamating business', () => {
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
  })

  it('saves an amalgamating business', async () => {
  })

  it('saves an amalgamating business', async () => {
  })

  it('doesn\'t add a duplicate amalgamating business', async () => {
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

    // verify Add buttons are enabled
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
    await wrapper.setData({
      isAddingAmalgamatingForeignBusiness: true
    })

    // simulate form data
    await wrapper.setData({
      isCan: true,
      jurisdiction: { text: 'BC', value: 'CA' },
      legalName: 'Foreign Business',
      corpNumber: 'ABC-123'
    })

    // simulate Save button action
    wrapper.vm.saveAmalgamatingForeignBusiness()

    // verify validation
    expect(wrapper.vm.isForeignBusinessValid).toBe(true)

    // verify data
    expect(store.stateModel.amalgamation.amalgamatingBusinesses.length).toBe(1)
    const business = store.stateModel.amalgamation.amalgamatingBusinesses[0] as any
    expect(business.type).toBe(AmlTypes.FOREIGN)
    expect(business.role).toBe(AmlRoles.AMALGAMATING)
    expect(business.foreignJurisdiction).toEqual({ country: 'CA', region: 'BC' })
    expect(business.legalName).toBe('Foreign Business')
    expect(business.corpNumber).toBe('ABC-123')

    // verify panel is now closed
    expect(wrapper.vm.isAddingAmalgamatingForeignBusiness).toBe(false)
  })

  it('doesn\'t add a duplicate foreign business', async () => {
    // pre-populate a foreign business
    store.stateModel.amalgamation.amalgamatingBusinesses = [
      {
        type: AmlTypes.FOREIGN,
        role: AmlRoles.AMALGAMATING,
        foreignJurisdiction: { country: 'CA', region: 'BC' },
        legalName: 'Foreign Business',
        corpNumber: 'ABC-123'
      }
    ]
    expect(store.stateModel.amalgamation.amalgamatingBusinesses.length).toBe(1)

    // open panel
    await wrapper.setData({
      isAddingAmalgamatingForeignBusiness: true
    })

    // simulate form data
    await wrapper.setData({
      isCan: true,
      jurisdiction: { text: 'BC', value: 'CA' },
      legalName: 'Foreign Business',
      corpNumber: 'ABC-123'
    })

    // verify snackbar is not displayed
    expect(wrapper.vm.snackbar).toBe(false)

    // simulate Save button action
    wrapper.vm.saveAmalgamatingForeignBusiness()

    // verify snackbar is displayed
    expect(wrapper.vm.snackbar).toBe(true)

    // verify data
    expect(store.stateModel.amalgamation.amalgamatingBusinesses.length).toBe(1)

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

    const corpNumber = wrapper.find('#foreign-business-corp-number')

    // verify empty legal name - MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: true })
    await corpNumber.setValue('')
    await corpNumber.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify empty legal name - non-MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: false })
    await corpNumber.setValue('')
    await corpNumber.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify invalid legal name - MRAS jurisdiction
    await wrapper.setData({ isMrasJurisdiction: true })
    await corpNumber.setValue('+++')
    await corpNumber.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Corporate number is required')

    // verify legal name too short
    await corpNumber.setValue('xx')
    await corpNumber.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Must be at least 3 characters')

    // verify legal name too long
    await corpNumber.setValue('x'.repeat(41))
    await corpNumber.trigger('change')
    expect(wrapper.find('.v-messages__message').text()).toBe('Cannot exceed 40 characters')

    // verify valid legal name (max length)
    await corpNumber.setValue('x'.repeat(40))
    await corpNumber.trigger('change')
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

describe.skip('Amalgamating Businesses - foreign business form', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AmalgamatingBusinesses, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
