<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="namerequest-invalid-error-dialog">
    <v-card>
      <v-card-title id="dialog-title">Invalid Incorporation Application</v-card-title>

      <v-card-text>
        <p class="genErr" v-if="type === NameRequestStates.EXPIRED">
          The specified name request has expired.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.NOT_APPROVED">
          The specified name request has not been approved.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.NEED_CONSENT">
          The specified name request is awaiting consent.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.NOT_FOUND">
          The specified name request could not be found.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.CONSUMED">
          The specified name request has already been consumed.</p>

        <p class="genErr" v-else-if="type === NameRequestStates.INVALID">
          The specified name request data is invalid.</p>

        <p class="genErr" v-else>An unexpected error has occurred.</p>
      </v-card-text>

      <v-divider class="my-0"></v-divider>

      <v-card-actions>
        <v-btn v-if="showOkay" id="dialog-ok-button" color="primary" text @click="okay()">OK</v-btn>
        <v-btn v-else id="dialog-redirect-button" color="primary" text @click="redirect()">Back to Dashboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { NameRequestStates } from '@/enums/nameRequestStates'

@Component({})
export default class NameRequestInvalidErrorDialog extends Vue {
  // Enum for template
  readonly NameRequestStates = NameRequestStates

  /** Prop to display the dialog. */
  @Prop() private readonly dialog: boolean

  /** Prop to provide message type. */
  @Prop({ default: null }) private readonly type: NameRequestStates

  /** Prop to provide attachment selector. */
  @Prop() private readonly attach: string

  /** True if user has Okay option. Otherwise user gets Redirect option. */
  private get showOkay (): boolean {
    return (
      this.type === NameRequestStates.EXPIRED ||
      this.type === NameRequestStates.NOT_APPROVED ||
      this.type === NameRequestStates.NEED_CONSENT
    )
  }

  // Pass click events to parent.
  @Emit() private okay () { }
  @Emit() private redirect () { }
}
</script>

<style lang="scss" scoped>
</style>
