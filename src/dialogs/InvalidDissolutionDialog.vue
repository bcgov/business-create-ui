<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach"
            content-class="invalid-dissolution-filing-dialog">
    <v-card>
      <v-card-title id="dialog-title">Dissolution Filing Does Not Exist</v-card-title>

      <v-card-text>
        <p class="genErr">The Dissolution filing you are attempting to open does not exist -
          it may have been filed, or it may be pending filing or payment.</p>
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
export default class InvalidDissolutionDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() protected exit (): void {}
}
</script>
