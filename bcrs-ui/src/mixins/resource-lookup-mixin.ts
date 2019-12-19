// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Interfaces
import { ResourceExampleIF } from '@/interfaces'

/**
 * Mixin for components to retrieve text/settings from json resource.
 */
@Component
export default class ResourceLookupMixin extends Vue {
  @State resourceModel!: Array<ResourceExampleIF>

  /**
   * Method to return the specified message
   */
  getName (id: number): string {
    const user: ResourceExampleIF | undefined = this.resourceModel && this.resourceModel.find(user => user.id === id)
    return user ? user.displayName : ''
  }

  /**
   * Method to return the specified display Name
   */
  getMessage (id: number): string {
    const user: ResourceExampleIF | undefined = this.resourceModel && this.resourceModel.find(user => user.id === id)
    return user ? user.message : ''
  }
}
