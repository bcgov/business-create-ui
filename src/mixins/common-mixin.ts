import { Component, Vue } from 'vue-property-decorator'
import { omit, isEqual } from 'lodash'

/**
 * Mixin that provides some useful common utilities.
 */
@Component
export default class CommonMixin extends Vue {
  /**
   * This is an example mixin that will return a msg.
   *
   * @param msg The msg to return.
   */
  sendMsg (msg: string): string {
    return msg ? `${msg} - msg created by sendMsg mixin` : 'Error, no Message'
  }

  /**
   * Removes the specified property from an object.
   *
   * @param baseObj The base object.
   * @param prop The property to be removed.
   */
  omitProp (baseObj: object, prop: Array<string>): object {
    return omit(baseObj, prop)
  }

  /**
   * Compares two objects while omitting specified properties from the comparison.
   *
   * @param addressA The first object to compare
   * @param addressB The second object to compare
   * @param prop The property to omit during the comparison
   *
   * @return boolean A boolean indicating a match of objects
   */
  isSame (objA: {}, objB: {}, prop: string | null = null): boolean {
    return isEqual({ ...this.omitProp(objA, prop ? [prop] : []) }, { ...this.omitProp(objB, prop ? [prop] : []) })
  }
}
