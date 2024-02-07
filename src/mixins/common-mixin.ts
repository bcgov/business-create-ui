import { Component, Vue } from 'vue-property-decorator'
import { isEqual } from 'lodash'
import omit from 'lodash.omit'
import { ValidationItemDetailIF } from '@/interfaces'
import { getName } from 'country-list'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  /**
   * Compares two objects while omitting specified properties from the comparison.
   * @param objA the first object to compare
   * @param objB the second object to compare
   * @param props an optional array of properties to omit during the comparison
   * @return a boolean indicating a match of objects
   */
  isSame (objA: object, objB: object, props: string[] = []): boolean {
    return isEqual({ ...omit(objA, props) }, { ...omit(objB, props) })
  }

  /**
   * Scrolls the window to the top of the specified element.
   * @param element the element to scroll to the top of
   */
  async scrollToTop (element: any): Promise<void> {
    if (element) {
      await element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  /**
   * Identifies the first invalid flag and scrolls to the component.
   * @param validFlags list of current component validity flags
   * @param components list of current component IDs
   * @return whether all components are valid
   */
  async validateAndScroll (validFlags: object, components: object): Promise<boolean> {
    // Create an array of the _ordered_ validity flags
    const validFlagArray = Object.keys(validFlags).map(key => validFlags[key])

    // Find the _first_ corresponding component that is invalid
    const component = document.getElementById(components[validFlagArray.findIndex(f => !f)])

    // If there is an invalid component, scroll to it
    if (component) {
      await this.scrollToTop(component)
      return false
    }
    return true
  }

  /**
   * Extracts validation flags from validation item detail object
   * @param validation items details object
   * @return array of validation flags for all validation items
   */
  buildValidFlags (validationItems: ValidationItemDetailIF[]): object {
    const result = {}
    for (const vi of validationItems) { result[vi.name] = vi.valid }
    return result
  }

  /**
   * Extracts element ids from validation item detail object
   * @param validation items details object
   * @return array of element ids for all validation items
   */
  buildElementIds (validationItems: ValidationItemDetailIF[]): string[] {
    return validationItems.map(vi => vi.elementId)
  }

  /**
   * Convert integer to corresponding character defaulting to lowercase by default
   * @param intVal number to convert to character
   * @return string character that maps to intVal
   */
  convertIntToChar (intVal: number, toLower = true): string {
    const charSet = toLower ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const result = charSet.charAt(intVal)
    return result
  }

  /**
   * Returns the full (first-middle-last) name of the subject officer.
   * @param officer the object to get the names from
   * @returns the formatted full name string
   */
  formatFullName (officer: any): string {
    let fullName = ''
    if (officer?.firstName) fullName += officer.firstName + ' '
    if (officer?.middleName) fullName += officer.middleName + ' '
    if (officer?.lastName) fullName += officer.lastName
    return fullName.trimEnd()
  }

  /**
   * Returns the full address of the subject.
   * @param addressData the object to get the address from
   * @returns the formatted full address string
   */
  formatFullAddress (addressData: any): string {
    let fullAddress = ''
    if (addressData?.addrLine1) fullAddress += addressData.addrLine1 + ', '
    if (addressData?.addrLine2) fullAddress += addressData.addrLine2 + ', '
    if (addressData?.addrLine3) fullAddress += addressData.addrLine3 + ', '
    if (addressData?.city) fullAddress += addressData.city + ', '
    if (addressData?.stateProvinceCd) fullAddress += addressData.stateProvinceCd + ', '
    if (addressData?.postalCd) fullAddress += addressData.postalCd + ', '
    if (addressData?.countryTypeCd) fullAddress += getName(addressData.countryTypeCd)

    return fullAddress.trimEnd()
  }

  /**
   * Formats a phone number for display.
   * @param phoneNumber the phone number to format
   * @returns a formatted phone number
   */
  toDisplayPhone (phoneNumber: string): string {
    // Filter only numbers from the input
    const cleaned = ('' + phoneNumber).replace(/\D/g, '')

    // Check if the input is of correct length
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }

    return null
  }
}
