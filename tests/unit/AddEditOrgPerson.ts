import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { mount, Wrapper, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { getVuexStore } from '@/store'
import AddEditOrgPerson from '@/components/common/AddEditOrgPerson.vue'
import { EmptyOrgPerson } from '@/interfaces'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Events
const addEditPersonEvent: string = 'AddEditOrgPerson'
const removePerson: string = 'removePerson'
const reassignCompletingPartyEvent: string = 'removeCompletingPartyRole'
const formResetEvent: string = 'resetEvent'

// Input field selectors to test changes to the DOM elements.
const firstNameSelector: string = '#person__first-name'
const middleNameSelector: string = '#person__middle-name'
const lastNameSelector: string = '#person__last-name'
const orgNameSelector: string = '#firm-name'
const completingPartyChkBoxSelector: string = '#cp-checkbox'
const doneButtonSelector: string = '#btn-done'
const removeButtonSelector: string = '#btn-remove'
const cancelButtonSelector: string = '#btn-cancel'
const formSelector: string = '.appoint-form'

const validPersonData = {
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
    { roleType: 'Director', appointmentDate: '2020-03-30' },
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

const validIncorporator = {
  officer: {
    id: '1',
    firstName: 'Adam',
    lastName: 'Smith',
    middleName: 'D',
    organizationName: '',
    partyType: 'person'
  },
  roles: [
    { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
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

const validOrgData = {
  officer: {
    id: '0',
    firstName: '',
    lastName: '',
    middleName: '',
    organizationName: 'Test Org',
    partyType: 'organization'
  },
  roles: [
    { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
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

const emptyPerson = { ...EmptyOrgPerson }

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<AddEditOrgPerson>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]
  return events[0]
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @returns a Wrapper<AddEditOrgPerson> object with the given parameters.
 */
function createComponent (
  initialValue: any, // person
  activeIndex: number,
  existingCompletingParty: any,
  addIncorporator: boolean = true
): Wrapper<AddEditOrgPerson> {
  const localVue = createLocalVue()
  localVue.use(Vuetify)
  document.body.setAttribute('data-app', 'true')
  return mount(AddEditOrgPerson, {
    localVue,
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

store.state.stateModel.nameRequest.entityType = 'BEN'
store.state.stateModel.currentDate = '2020-03-30'

describe('Add/Edit Org/Person component', () => {
  it('Loads the component and sets data for person', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, -1, null)
    expect(wrapper.vm.$data.AddEditOrgPerson).toStrictEqual(validPersonData)
    expect((wrapper.vm as any).isIncorporator).toBe(false)
    expect((wrapper.vm as any).isDirector).toBe(true)
    expect((wrapper.vm as any).isCompletingParty).toBe(true)
    wrapper.destroy()
  })

  it('Loads the component and sets data for org', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    expect(wrapper.vm.$data.AddEditOrgPerson).toStrictEqual(validOrgData)
    expect((wrapper.vm as any).isIncorporator).toBe(true)
    expect((wrapper.vm as any).isDirector).toBe(false)
    expect((wrapper.vm as any).isCompletingParty).toBe(false)
    await Vue.nextTick()
    wrapper.destroy()
  })

  it('Displays form data for org', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    expect((<HTMLInputElement>wrapper.find(orgNameSelector).element).value)
      .toEqual(validOrgData['officer']['organizationName'])
    await Vue.nextTick()
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeDefined()
    expect(wrapper.find(cancelButtonSelector).attributes('disabled')).toBeUndefined()
    wrapper.destroy()
  })

  it('Displays form data for person', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, 0, null)
    expect((<HTMLInputElement>wrapper.find(firstNameSelector).element).value)
      .toEqual(validPersonData['officer']['firstName'])
    expect((<HTMLInputElement>wrapper.find(middleNameSelector).element).value)
      .toEqual(validPersonData['officer']['middleName'])
    expect((<HTMLInputElement>wrapper.find(lastNameSelector).element).value)
      .toEqual(validPersonData['officer']['lastName'])
    await Vue.nextTick()
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeUndefined()
    expect(wrapper.find(cancelButtonSelector).attributes('disabled')).toBeUndefined()
    wrapper.destroy()
  })

  it('Remove button is enabled in edit mode', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, 0, null)
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeUndefined()
    wrapper.destroy()
  })

  it('Remove button is disabled in create mode', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    expect(wrapper.find(removeButtonSelector).attributes('disabled')).toBeDefined()
    wrapper.destroy()
  })

  it('Clicking remove button emits event', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, 0, null)
    wrapper.find(removeButtonSelector).trigger('click')
    await Vue.nextTick()
    expect(getLastEvent(wrapper, removePerson)).toBe(0)
    wrapper.destroy()
  })

  it('Clicking Done button emits event for add edit person/org', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    expect((<HTMLInputElement>wrapper.find(orgNameSelector).element).value)
      .toEqual(validOrgData.officer.organizationName)
    await Vue.nextTick()
    expect(wrapper.find(doneButtonSelector).attributes('disabled')).toBeUndefined()
    wrapper.find(doneButtonSelector).trigger('click')
    await Vue.nextTick()
    expect(getLastEvent(wrapper, addEditPersonEvent).officer.organizationName)
      .toEqual(validOrgData.officer.organizationName)
    wrapper.destroy()
  })

  it('Does not display error message when user enters valid org name', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    const inputElement: Wrapper<Vue> = wrapper.find(orgNameSelector)

    inputElement.setValue('Valid Org Name')
    inputElement.trigger('change')
    await flushPromises()

    expect(wrapper.find(formSelector).text()).not.toContain('Invalid spaces')
    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(true)

    wrapper.destroy()
  })

  it('Displays error message when user enters invalid org name', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validOrgData, -1, null)
    const inputElement: Wrapper<Vue> = wrapper.find(orgNameSelector)

    inputElement.setValue('     ')
    inputElement.trigger('change')
    await flushPromises()

    expect(wrapper.find(formSelector).text()).toContain('Corporation or firm name is required')
    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Does not display error message when user enters valid person names', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, -1, null)
    const inputElement1: Wrapper<Vue> = wrapper.find(firstNameSelector)
    const inputElement2: Wrapper<Vue> = wrapper.find(middleNameSelector)
    const inputElement3: Wrapper<Vue> = wrapper.find(lastNameSelector)

    inputElement1.setValue('First')
    inputElement1.trigger('change')
    inputElement2.setValue('Middle')
    inputElement2.trigger('change')
    inputElement3.setValue('Last')
    inputElement3.trigger('change')
    await flushPromises()

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)
    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(true)

    wrapper.destroy()
  })

  it('Displays error message when user does not enter person names', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, -1, null)
    const inputElement1: Wrapper<Vue> = wrapper.find(firstNameSelector)
    const inputElement2: Wrapper<Vue> = wrapper.find(middleNameSelector)
    const inputElement3: Wrapper<Vue> = wrapper.find(lastNameSelector)

    inputElement1.setValue('')
    inputElement1.trigger('change')
    inputElement2.setValue('')
    inputElement2.trigger('change')
    inputElement3.setValue('')
    inputElement3.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(2)
    expect(messages.at(0).text()).toBe('First name is required')
    expect(messages.at(1).text()).toBe('Last name is required')
    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Displays error message when user enters person names that are too long', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, -1, null)
    const inputElement1: Wrapper<Vue> = wrapper.find(firstNameSelector)
    const inputElement2: Wrapper<Vue> = wrapper.find(middleNameSelector)
    const inputElement3: Wrapper<Vue> = wrapper.find(lastNameSelector)

    inputElement1.setValue('1234567890123456789012345678901')
    inputElement1.trigger('change')
    inputElement2.setValue('1234567890123456789012345678901')
    inputElement2.trigger('change')
    inputElement3.setValue('1234567890123456789012345678901')
    inputElement3.trigger('change')
    await Vue.nextTick()
    await flushPromises()
    await Vue.nextTick()

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(3)
    expect(messages.at(0).text()).toBe('Cannot exceed 30 characters')
    expect(messages.at(1).text()).toBe('Cannot exceed 30 characters')
    expect(messages.at(2).text()).toBe('Cannot exceed 30 characters')
    expect(wrapper.vm.$data.addPersonOrgFormValid).toBe(false)

    wrapper.destroy()
  })

  it('Shows popup if there is already a completing party', async () => {
    store.state.stateModel.tombstone.authRoles = ['staff']
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validIncorporator, -1, validPersonData)

    const cpCheckBox: Wrapper<Vue> = wrapper.find(completingPartyChkBoxSelector)
    cpCheckBox.setChecked(true)
    await Vue.nextTick()

    expect(wrapper.vm.$refs.reassignCPDialog).toBeTruthy()

    wrapper.destroy()
    store.state.stateModel.tombstone.authRoles = []
  })

  it('Emits events correctly on confirming reassign completing party', async () => {
    store.state.stateModel.tombstone.authRoles = ['staff']
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validIncorporator, -1, validPersonData)

    const cpCheckBox: Wrapper<Vue> = wrapper.find(completingPartyChkBoxSelector)
    cpCheckBox.setChecked(true)
    await Vue.nextTick()
    const reassignDialog: any = wrapper.vm.$refs.reassignCPDialog
    expect(reassignDialog).toBeTruthy()
    await reassignDialog.onClickYes()
    await flushPromises()
    expect(wrapper.vm.$data.reassignCompletingParty).toBe(true)
    wrapper.find(doneButtonSelector).trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted().removeCompletingPartyRole).toBeTruthy()
    expect(wrapper.emitted(reassignCompletingPartyEvent).length).toBe(1)

    expect(wrapper.emitted().AddEditOrgPerson).toBeTruthy()
    expect(wrapper.emitted(addEditPersonEvent).length).toBe(1)
    let incorporatorWithAddedRole = { ...validIncorporator }
    incorporatorWithAddedRole.roles = [
      { roleType: 'Completing Party', appointmentDate: '2020-03-30' },
      { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
    ]

    const event = wrapper.emitted(addEditPersonEvent)[0][0]
    expect(event.officer.firstName).toBe(validIncorporator.officer.firstName)
    expect(event.officer.lastName).toBe(validIncorporator.officer.lastName)
    expect(event.mailingAddress.streetAddress).toBe(validIncorporator.mailingAddress.streetAddress)
    expect(event.roles[0].roleType).toBe('Completing Party')
    expect(event.roles[1].roleType).toBe('Incorporator')

    wrapper.destroy()
    store.state.stateModel.tombstone.authRoles = []
  })

  it('Emits cancel event', async () => {
    const wrapper: Wrapper<AddEditOrgPerson> = createComponent(validPersonData, -1, null)
    wrapper.find(cancelButtonSelector).trigger('click')
    await Vue.nextTick()
    expect(wrapper.emitted().resetEvent).toBeTruthy()
    expect(wrapper.emitted(formResetEvent).length).toBe(1)
    wrapper.destroy()
  })

  it('Displays errors and does not submit form when clicking Done button and form is invalid', async () => {
    const wrapper = createComponent(emptyPerson, NaN, null)

    // verify that button is not disabled, then click it
    const button = wrapper.find(doneButtonSelector)
    expect(button.attributes('disabled')).toBeUndefined()
    button.trigger('click')
    await Vue.nextTick()

    // get a list of error messages
    const wrappers = wrapper.findAll('.v-messages__message')
    const messages: Array<string> = []
    for (let i = 0; i < wrappers.length; i++) {
      messages.push(wrappers.at(i).text())
    }

    // verify some error messages
    expect(messages.includes('A first name is required'))
    expect(messages.includes('A last name is required'))
    expect(messages.includes('A role is required'))
    expect(messages.includes('This field is required'))

    // verify no events were emitted
    expect(wrapper.emitted(reassignCompletingPartyEvent)).toBeUndefined()
    expect(wrapper.emitted(addEditPersonEvent)).toBeUndefined()
    expect(wrapper.emitted(formResetEvent)).toBeUndefined()

    wrapper.destroy()
  })
})
