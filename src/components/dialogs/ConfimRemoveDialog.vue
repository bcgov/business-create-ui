<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="confirm-remove-dialog">
    <v-card>
      <v-card-title id="dialog-title">
        Remove Person or Corporation / Firm
      </v-card-title>

      <v-card-text id="dialog-text">
        <p class="genErr">Remove this Person or Corporation or Firm from your Company?</p>
      </v-card-text>

      <v-divider class="my-0"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="dialog-remove-btn" color="primary" text @click="confirm()">Remove</v-btn>
        <v-btn id="dialog-cancel-btn" text @click="exit()">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class ConfirmRemoveDialog extends Vue {
  // Prop to display the dialog.
  @Prop() private dialog: boolean

  // Prop to provide attachment selector.
  @Prop() private attach: string

  // Pass click event to parent.
  @Emit() private confirm () { }

  // Pass click event to parent.
  @Emit() private exit () { }
}
</script>
