import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { mount, Wrapper } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { getVuexStore } from '@/store'
import RegAddEditOrgPerson from '@/components/Registration/RegAddEditOrgPerson.vue'
import { EmptyOrgPerson } from '@/interfaces'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Events
const addEditPersonEvent = 'addEditPerson'
const removePersonEvent = 'removePerson'
const removeCompletingPartyRoleEvent = 'removeCompletingPartyRole'
const resetEvent = 'resetEvent'

// selectors to test changes to the DOM elements
const firstNameSelector = '.first-name'
const middleNameSelector = '.middle-name'
const lastNameSelector = '.last-name'
const orgNameSelector = '.org-name'
const buttonRemoveSelector = '.btn-remove'
const buttonDoneSelector = '.btn-done'
const buttonCancelSelector = '.btn-cancel'

const validCompletingParty = {
  officer: {
    id: '0',
    firstName: 'Adam',
    lastName: 'Smith',
    middleName: 'D',
    organizationName: '',
    partyType: 'person',
    email: 'completing-party@example.com'
  },
  roles: [
    { roleType: 'Completing Party', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: {
    streetAddress: '123 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA'
  },
  deliveryAddress: {
    streetAddress: '123 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA'
  }
}

const validProprietorPerson = {
  officer: {
    id: '1',
    firstName: 'Bill',
    lastName: 'Jones',
    middleName: 'M',
    organizationName: '',
    partyType: 'person',
    email: 'proprietor-person@example.com'
  },
  roles: [
    { roleType: 'Proprietor', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: {
    streetAddress: '123 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA'
  },
  deliveryAddress: {
    streetAddress: '123 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA'
  }
}

const validProprietorOrg = {
  officer: {
    id: '0',
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: 'Test Org',
    partyType: 'organization',
    email: 'proprietor-org@example.com'
  },
  roles: [
    { roleType: 'Proprietor', appointmentDate: '2020-03-30' }
  ],
  mailingAddress: {
    streetAddress: '3942 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA'
  }
}

/**
 * Returns the last event for a given name, to be used for testing event propagation
 * in response to component changes.
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<RegAddEditOrgPerson>, name: string): any {
  const eventsList = wrapper.emitted(name)
  const events = eventsList && eventsList[eventsList.length - 1]
  return events && events[0]
}

/**
 * Mounts and returns a component so that it can be tested.
 * @returns a Wrapper object with the given parameters.
 */
function createComponent (
  initialValue: any, // org-person
  activeIndex: number,
  existingCompletingParty: any,
  addIncorporator: boolean = true
): Wrapper<RegAddEditOrgPerson> {
  return mount(RegAddEditOrgPerson, {
    data () { return { enableRules: true } },
    propsData: {
      initialValue,
      activeIndex,
      existingCompletingParty,
      addIncorporator
    },
    store,
    vuetify
  })
}

store.state.stateModel.nameRequest.entityType = 'SP'
store.state.stateModel.currentDate = '2021-04-01'

describe('Registration Add/Edit Org/Person component', () => {
  it('loads the component and sets the data for completing party', () => {
    const wrapper = createComponent(validCompletingParty, -1, null)
    const vm = wrapper.vm as any

    expect(vm.$data.orgPerson).toStrictEqual(validCompletingParty)
    expect(vm.isCompletingParty).toBe(true)
    expect(vm.isIncorporator).toBe(false)
    expect(vm.isDirector).toBe(false)
    expect(vm.isProprietor).toBe(false)

    wrapper.destroy()
  })

  it('loads the component and sets the data for proprietor-person', () => {
    const wrapper = createComponent(validProprietorPerson, -1, null)
    const vm = wrapper.vm as any

    expect(vm.$data.orgPerson).toStrictEqual(validProprietorPerson)
    expect(vm.isCompletingParty).toBe(false)
    expect(vm.isIncorporator).toBe(false)
    expect(vm.isDirector).toBe(false)
    expect(vm.isProprietor).toBe(true)

    wrapper.destroy()
  })

  it('loads the component and sets the data for proprietor-org', () => {
    const wrapper = createComponent(validProprietorOrg, -1, null)
    const vm = wrapper.vm as any

    expect(vm.$data.orgPerson).toStrictEqual(validProprietorOrg)
    expect(vm.isCompletingParty).toBe(false)
    expect(vm.isIncorporator).toBe(false)
    expect(vm.isDirector).toBe(false)
    expect(vm.isProprietor).toBe(true)

    wrapper.destroy()
  })

  it('displays form data for completing party', () => {
    const wrapper = createComponent(validCompletingParty, 0, null)

    // verify input values
    const firstNameInput = wrapper.find(`${firstNameSelector} input`)
    const middleNameInput = wrapper.find(`${middleNameSelector} input`)
    const lastNameInput = wrapper.find(`${lastNameSelector} input`)
    expect((firstNameInput.element as HTMLInputElement).value)
      .toEqual(validCompletingParty['officer']['firstName'])
    expect((middleNameInput.element as HTMLInputElement).value)
      .toEqual(validCompletingParty['officer']['middleName'])
    expect((lastNameInput.element as HTMLInputElement).value)
      .toEqual(validCompletingParty['officer']['lastName'])

    // verify buttons
    expect(wrapper.find(buttonDoneSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonRemoveSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonCancelSelector).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('displays form data for proprietor-person', () => {
    const wrapper = createComponent(validProprietorPerson, 0, null)

    // verify input values
    const firstNameInput = wrapper.find(`${firstNameSelector} input`)
    const middleNameInput = wrapper.find(`${middleNameSelector} input`)
    const lastNameInput = wrapper.find(`${lastNameSelector} input`)
    expect((firstNameInput.element as HTMLInputElement).value)
      .toEqual(validProprietorPerson['officer']['firstName'])
    expect((middleNameInput.element as HTMLInputElement).value)
      .toEqual(validProprietorPerson['officer']['middleName'])
    expect((lastNameInput.element as HTMLInputElement).value)
      .toEqual(validProprietorPerson['officer']['lastName'])

    // verify buttons
    expect(wrapper.find(buttonDoneSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonRemoveSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonCancelSelector).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('displays form data for proprietor-org', () => {
    const wrapper = createComponent(validProprietorOrg, 0, null)

    // verify input values
    const orgNameInput = wrapper.find(`${orgNameSelector} input`)
    expect((orgNameInput.element as HTMLInputElement).value)
      .toEqual(validProprietorOrg['officer']['organizationName'])

    // verify buttons
    expect(wrapper.find(buttonDoneSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonRemoveSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(buttonCancelSelector).attributes('disabled')).toBeUndefined()

    wrapper.destroy()
  })

  it('enables Remove button in edit mode', () => {
    const wrapper = createComponent(validCompletingParty, 0, null)
    expect(wrapper.find(buttonRemoveSelector).attributes('disabled')).toBeUndefined()
    wrapper.destroy()
  })

  it('disables Remove button in add mode', () => {
    const wrapper = createComponent(validCompletingParty, -1, null)
    expect(wrapper.find(buttonRemoveSelector).attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('emits event when Remove button is clicked', async () => {
    const wrapper = createComponent(validCompletingParty, 0, null)

    wrapper.find(buttonRemoveSelector).trigger('click')
    await Vue.nextTick()
    expect(getLastEvent(wrapper, removePersonEvent)).toBe(0)

    wrapper.destroy()
  })

  it('emits event when Done button is clicked', async () => {
    const wrapper = createComponent(validCompletingParty, -1, null)

    wrapper.find(buttonDoneSelector).trigger('click')
    await Vue.nextTick()
    const event = getLastEvent(wrapper, addEditPersonEvent)
    expect(event.officer.firstName).toEqual(validCompletingParty.officer.firstName)
    expect(event.officer.middleName).toEqual(validCompletingParty.officer.middleName)
    expect(event.officer.lastName).toEqual(validCompletingParty.officer.lastName)

    wrapper.destroy()
  })

  it('emits event when Cancel button is clicked', async () => {
    const wrapper = createComponent(validCompletingParty, -1, null)

    wrapper.find(buttonCancelSelector).trigger('click')
    await Vue.nextTick()
    expect(wrapper.emitted(resetEvent).length).toBe(1)
    expect(wrapper.emitted(resetEvent)[0]).toEqual([])

    wrapper.destroy()
  })

  it('does not display error message when user enters valid org name', async () => {
    const wrapper = createComponent(validProprietorOrg, -1, null)

    const inputElement = wrapper.find(`${orgNameSelector} input`)
    inputElement.setValue('Valid Org Name')
    inputElement.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages.error--text')
    expect(messages.length).toBe(0)

    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(true)

    wrapper.destroy()
  })

  it('displays error message when user enters invalid org name', async () => {
    const wrapper = createComponent(validProprietorOrg, -1, null)

    const inputElement = wrapper.find(`${orgNameSelector} input`)
    inputElement.setValue('     ')
    inputElement.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages.error--text')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Business or corporation name is required')

    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })

  it('does not display error message when user enters valid person names', async () => {
    const wrapper = createComponent(validCompletingParty, -1, null)

    const firstNameInput = wrapper.find(`${firstNameSelector} input`)
    const middleNameInput = wrapper.find(`${middleNameSelector} input`)
    const lastNameInput = wrapper.find(`${lastNameSelector} input`)

    firstNameInput.setValue('First')
    firstNameInput.trigger('change')
    middleNameInput.setValue('Middle')
    middleNameInput.trigger('change')
    lastNameInput.setValue('Last')
    lastNameInput.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages.error--text')
    expect(messages.length).toBe(0)

    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(true)

    wrapper.destroy()
  })

  it('displays error message when user does not enter person names', async () => {
    const wrapper = createComponent(validCompletingParty, -1, null)

    const firstNameInput = wrapper.find(`${firstNameSelector} input`)
    const middleNameInput = wrapper.find(`${middleNameSelector} input`)
    const lastNameInput = wrapper.find(`${lastNameSelector} input`)

    firstNameInput.setValue('')
    firstNameInput.trigger('change')
    middleNameInput.setValue('')
    middleNameInput.trigger('change')
    lastNameInput.setValue('')
    lastNameInput.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages.error--text')
    expect(messages.length).toBe(2)
    expect(messages.at(0).text()).toBe('First name is required')
    expect(messages.at(1).text()).toBe('Last name is required')

    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })

  it('displays errors and does not submit form when clicking Done button and form is invalid', async () => {
    const wrapper = createComponent({ ...EmptyOrgPerson }, -1, null)

    // verify that Done button is not disabled, then click it
    const button = wrapper.find(buttonDoneSelector)
    expect(button.attributes('disabled')).toBeUndefined()
    button.trigger('click')
    await flushPromises()

    // verify error messages
    const messages = wrapper.findAll('.v-messages.error--text')
    expect(messages.length).toBe(6)
    expect(messages.at(0).text()).toBe('Email address is required') // email address
    expect(messages.at(1).text()).toBe('This field is required') // mailing - street address
    expect(messages.at(2).text()).toBe('This field is required') // mailing - city
    expect(messages.at(3).text()).toBe('This field is required') // mailing - postal code
    expect(messages.at(4).text()).toBe('This field is required') // mailing - country
    expect(messages.at(5).text()).toBe('')

    // verify that no events were emitted
    expect(wrapper.emitted(removeCompletingPartyRoleEvent)).toBeUndefined()
    expect(wrapper.emitted(addEditPersonEvent)).toBeUndefined()
    expect(wrapper.emitted(resetEvent)).toBeUndefined()

    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })
})
