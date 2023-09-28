<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="namerequest-invalid-error-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Invalid Incorporation Application
      </v-card-title>

      <v-card-text>
        <p
          v-if="type === NameRequestStates.EXPIRED"
          class="font-14"
        >
          The specified name request has expired.
        </p>

        <p
          v-else-if="type === NameRequestStates.NOT_APPROVED"
          class="font-14"
        >
          The specified name request has not been approved.
        </p>

        <p
          v-else-if="type === NameRequestStates.NEED_CONSENT"
          class="font-14"
        >
          The specified name request is awaiting consent.
        </p>

        <p
          v-else-if="type === NameRequestStates.NOT_FOUND"
          class="font-14"
        >
          The specified name request could not be found.
        </p>

        <p
          v-else-if="type === NameRequestStates.CONSUMED"
          class="font-14"
        >
          The specified name request has already been consumed.
        </p>

        <p
          v-else-if="type === NameRequestStates.INVALID"
          class="font-14"
        >
          The specified name request data is invalid.
        </p>

        <p
          v-else
          class="font-14"
        >
          An unexpected error has occurred.
        </p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn
          v-if="showOkay"
          id="dialog-ok-button"
          color="primary"
          variant="text"
          @click="okay()"
        >
          OK
        </v-btn>
        <v-btn
          v-else
          id="dialog-redirect-button"
          color="primary"
          variant="text"
          @click="redirect()"
        >
          Back to Dashboard
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { NameRequestStates } from '@/enums'

@Component({})
export default class NameRequestInvalidErrorDialog extends Vue {
  // Enum for template
  readonly NameRequestStates = NameRequestStates

  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  /** Prop to provide message type. */
  @Prop({ default: null }) readonly type!: NameRequestStates

  /** True if user has Okay option. Otherwise user gets Redirect option. */
  get showOkay (): boolean {
    return (
      this.type === NameRequestStates.EXPIRED ||
      this.type === NameRequestStates.NOT_APPROVED ||
      this.type === NameRequestStates.NEED_CONSENT
    )
  }

  // Pass click events to parent.
  @Emit() okay (): void {}
  @Emit() redirect (): void {}
}
</script>
