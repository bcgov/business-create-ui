import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'

Vue.use(Vuetify)
const store = getVuexStore()

let vuetify = new Vuetify({})

// Events
const formValidEvent = 'valid'
const formDataChangeEvent = 'update'

// Input field selectors to test changes to the DOM elements.
const emailSelector = '#txt-email'
const confirmEmailSelector = '#txt-confirm-email'
const phoneSelector = '#txt-phone'
const extensionSelector = '#txt-phone-extension'
const formSelector = 'form'
const readOnlyEmailSelector = '#lbl-email'
const readOnlyPhoneSelector = '#lbl-phone'

const email = 'test@abc.com'
const invalidEmail = 'test@'
const phoneNumber = '5555555555'
const invalidPhoneNumber = '11'
const extension = 4444

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<BusinessContactInfo>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]
  return events[0]
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @param email The email address. The default value is ''.
 * @param confirmEmail The confirm email address. The default value is ''.
 * @param phone The phone number. The default value is ''.
 * @param extension The phone extension. The default value is ''.
 * @param isEditing Indicates whether the component is in editing or readonly mode. The default value is true.
 * @returns a Wrapper<BusinessContactInfo> object with the given parameters.
 */
function createComponent (
  email = '',
  confirmEmail = '',
  phone = '',
  extension: number = null,
  isEditing = true
): Wrapper<BusinessContactInfo> {
  const businessContact = {
    email,
    confirmEmail,
    phone,
    ...extension ? { extension } : {}
  }
  return mount(BusinessContactInfo, {
    store,
    propsData: { initialValue: businessContact, isEditing: isEditing },
    vuetify
  })
}

describe('Business Contact Info component', () => {
  it('Loads the component and sets data for valid data', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    expect((<HTMLInputElement> wrapper.find(emailSelector).element).value).toEqual(email)
    expect((<HTMLInputElement> wrapper.find(confirmEmailSelector).element).value).toEqual(email)
    expect((<HTMLInputElement> wrapper.find(phoneSelector).element).value).toEqual('')
    expect((<HTMLInputElement> wrapper.find(extensionSelector).element).value).toEqual('')
    wrapper.destroy()
  })

  it('form is valid for correct input', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(true)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: ''
    })
    wrapper.destroy()
  })

  it('form is invalid for wrong email', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(invalidEmail, invalidEmail)
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: invalidEmail,
      phone: ''
    })
    wrapper.destroy()
  })

  it('form is invalid for wrong optional phone number field', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email, invalidPhoneNumber)
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: '(11'
    })
    wrapper.destroy()
  })

  it('displays error message when user enters invalid email', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(emailSelector)
    inputElement.setValue(invalidEmail)
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: email,
      phone: ''
    })
    await Vue.nextTick()
    expect(wrapper.find(formSelector).text()).toContain('Valid email is required')
    wrapper.destroy()
  })

  it('displays error message when email and confirmEmail do not match', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(emailSelector)
    inputElement.setValue(invalidEmail)
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: email,
      phone: ''
    })
    expect(wrapper.find(formSelector).text()).toContain('Email addresses must match')
    wrapper.destroy()
  })

  it('displays error message when user enters invalid phone number', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue(invalidPhoneNumber)
    inputElement.trigger('change')
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: '(11'
    })
    await Vue.nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(wrapper.find(formSelector).text()).toContain('Phone number is invalid')
    wrapper.destroy()
  })

  it('displays read only data in non editing mode', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email, phoneNumber, extension, false)
    expect(wrapper.find(readOnlyEmailSelector).text()).toEqual(email)
    expect(wrapper.find(readOnlyPhoneSelector).text()).toContain(phoneNumber)
    expect(wrapper.find(readOnlyPhoneSelector).text()).toContain('Ext: ' + extension)
    expect(wrapper.find(formSelector).exists()).toBeFalsy()
    wrapper.destroy()
  })
})
