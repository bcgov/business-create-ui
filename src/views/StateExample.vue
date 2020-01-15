<template>
  <v-card>
    <div class="stateExample">
      <h1>This is an about page that contains an example for state</h1>
      <p>Current Step: {{ stateModel.currentStep }}</p>
      <p>Keycloak Roles: {{ tombStoneModel.keycloakRoles }}</p>
      <p>Auth Roles: {{ tombStoneModel.authRoles }}</p>
    </div>

    <div class="gettersExample">
      <h1>This section gives examples of getter Usage</h1>
      <p>{{ isRoleView }}</p>
      <p>{{ isRoleStaff }}</p>
    </div>

    <!-- Resourced Component example #1 -->
    <ResourceExample
      :name="getName(1)"
      :message="getMessage(1)"
    />

    <!-- Resourced Component example #2-->
    <ResourceExample
      :name="getName(2)"
      :message="getMessage(2)"
    />
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Components
import { ResourceExample } from '@/components/common'

// Mixins
import { ResourceLookupMixin } from '@/mixins'

// Resources
import { ExternalResource } from '@/resources'

// Interfaces
import { StateModelIF, TombStoneIF, GetterIF, ActionBindingIF } from '@/interfaces'

@Component({
  components: {
    ResourceExample
  }
})
export default class StateExample extends Mixins(ResourceLookupMixin) {
  // Global state
  @State stateModel!: StateModelIF
  @State tombStoneModel!: TombStoneIF

  // Global getters
  @Getter isRoleStaff!: GetterIF
  @Getter isRoleView!: GetterIF

  // Global actions
  @Action setResource!: ActionBindingIF

  // Lifecycle event
  private created ():void {
    // Example of setting the State of a Resource
    this.setResource(ExternalResource)
  }
}
</script>
