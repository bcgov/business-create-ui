<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="namerequest-invalid-error-dialog">
    <v-card>
      <v-card-title id="dialog-title" v-if="type === NameRequestStates.NOTFOUND">Name Request Not Found</v-card-title>
      <v-card-title id="dialog-title" v-else>Name Request Invalid</v-card-title>
      <v-card-text>
        <p class="genErr" v-if="type === NameRequestStates.EXPIRED">
          The specified name request has expired.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.CONSUMED">
          The specified name request has already been consumed.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.NOTAPPROVED">
          The specified name request has not been approved.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.NOTFOUND">
          The specified name request number could not be found.</p>

        <p class="genErr" v-else>An unexpected error has occurred.</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="type === NameRequestStates.NOTFOUND || type === NameRequestStates.CONSUMED"
                id="dialog-redirect-button" color="primary" text @click="redirect()">Back to Dashboard</v-btn>

        <v-btn v-else id="dialog-ok-button" color="primary" text @click="okay()">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { NameRequestStates } from '@/enums/nameRequestStates'

@Component({
  computed: {}
})
export default class NameRequestInvalidErrorDialog extends Vue {
  // NameRequestStates Enum
  readonly NameRequestStates: {} = NameRequestStates
  // Prop to display the dialog.
  @Prop() private dialog: boolean

  // Prop to provide attachment selector.
  @Prop() private type: string

  // Prop to provide attachment selector.
  @Prop() private attach: string

  // Pass click events to parent.
  @Emit() private okay () { }
  @Emit() private redirect () { }
}
</script>

<style lang="scss" scoped>

</style>
