import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

/**
 * Mixin that provides an entity filter utility.
 */
@Component({})
export default class EntityFilterMixin extends Vue {
  // Global state
  @State(state => state.stateModel.entityType)
  readonly entityType!: string

  /**
   * Method to compare the conditional entity to the entityType defined from the Store.
   *
   * @param entity The entity type of the component.
   * @return boolean A boolean indicating if the entityType given matches the entityType assigned to the component.
   */
  entityFilter (entityType: string): boolean {
    return this.entityType === entityType
  }
}
