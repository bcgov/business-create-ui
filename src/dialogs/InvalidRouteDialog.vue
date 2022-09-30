<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach"
            content-class="invalid-route-dialog">
    <v-card>
      <v-card-title id="dialog-title">Invalid Route</v-card-title>

      <v-card-text>
        <p class="genErr">The route you are trying to access does not exist for the current entity or filing type.</p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="dialog-exit-button" color="primary" text @click="exit()">Go to Dashboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class InvalidRouteDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() protected exit (): void {}
}
</script>
