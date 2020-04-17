import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'

import { BusinessContactInfo } from '@/components/DefineCompany'
import { BusinessContactIF } from '@/interfaces'

Vue.use(Vuetify)

let vuetify = new Vuetify({})

// Events
const formValidEvent = 'contactInfoFormValidityChange'
const formDataChangeEvent = 'contactInfoChange'

// Input field selectors to test changes to the DOM elements.
const emailSelector: string = '#txt-email'
const confirmEmailSelector: string = '#txt-confirm-email'
const phoneSelector: string = '#txt-phone'
const extensionSelector: string = '#txt-phone-extension'
const formSelector: string = '[name="business-contact-form"]'
const readOnlyEmailSelector: string = '#lbl-email'
const readOnlyPhoneSelector: string = '#lbl-phone'

const email: string = 'test@abc.com'
const invalidEmail: string = 'test@'
const phoneNumber: string = '5555555555'
const invalidPhoneNumber: string = '11'
const extension: string = '4444'

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
  email: string = '',
  confirmEmail: string = '',
  phone: string = '',
  extension: string = '',
  isEditing: boolean = true
): Wrapper<BusinessContactInfo> {
  const businessContact: BusinessContactIF = {
    email,
    confirmEmail,
    phone,
    extension
  }
  return mount(BusinessContactInfo, {
    propsData: { initialValue: businessContact, isEditing: isEditing },
    vuetify
  })
}

describe('BusinessContactInfo', () => {
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
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(true)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: '',
      extension: ''
    })
    wrapper.destroy()
  })

  it('form is invalid for wrong email', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(invalidEmail, invalidEmail)
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: invalidEmail,
      phone: '',
      extension: ''
    })
    wrapper.destroy()
  })

  it('form is invalid for wrong optional phone number field', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email, invalidPhoneNumber)
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: '(11',
      extension: ''
    })
    wrapper.destroy()
  })

  it('displays error message when user enters invalid email', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(emailSelector)
    inputElement.setValue(invalidEmail)
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: email,
      phone: '',
      extension: ''
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find(formSelector).text()).toContain('Valid email is required')
    wrapper.destroy()
  })

  it('displays error message when email and confirmEmail do not match', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(emailSelector)
    inputElement.setValue(invalidEmail)
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formValidEvent)).toBe(false)
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: invalidEmail,
      confirmEmail: email,
      phone: '',
      extension: ''
    })
    expect(wrapper.find(formSelector).text()).toContain('Email addresses must match')
    wrapper.destroy()
  })

  it('displays error message when user enters invalid phone number', async () => {
    const wrapper: Wrapper<BusinessContactInfo> = createComponent(email, email)
    const inputElement: Wrapper<Vue> = wrapper.find(phoneSelector)
    inputElement.setValue(invalidPhoneNumber)
    inputElement.trigger('change')
    await wrapper.vm.$nextTick()
    expect(getLastEvent(wrapper, formDataChangeEvent)).toStrictEqual({ email: email,
      confirmEmail: email,
      phone: '(11',
      extension: ''
    })
    await wrapper.vm.$nextTick()
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
