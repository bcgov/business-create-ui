<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="invalid-filing-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Invalid Filing
      </v-card-title>

      <v-card-text>
        <p
          v-if="type === NameRequestStates.EXPIRED"
          class="font-14"
        >
          The Name Request has expired.
        </p>

        <p
          v-else-if="type === NameRequestStates.NOT_APPROVED"
          class="font-14"
        >
          The Name Request has not been approved.
        </p>

        <p
          v-else-if="type === NameRequestStates.NEED_CONSENT"
          class="font-14"
        >
          The Name Request is awaiting consent.
        </p>

        <p
          v-else-if="type === NameRequestStates.NOT_FOUND"
          class="font-14"
        >
          The Name Request could not be found.
        </p>

        <p
          v-else-if="type === NameRequestStates.CONSUMED"
          class="font-14"
        >
          The Name Request has already been consumed.
        </p>

        <p
          v-else-if="type === NameRequestStates.INVALID"
          class="font-14"
        >
          The Name Request is invalid.
        </p>

        <p
          v-else
          class="font-14"
        >
          An unexpected error has occurred. Please try your action again.
        </p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="showOkay"
          id="dialog-ok-button"
          color="primary"
          text
          @click="okay()"
        >
          OK
        </v-btn>
        <v-btn
          v-else
          id="dialog-redirect-button"
          color="primary"
          text
          @click="redirect()"
        >
          Back to Dashboard
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { NameRequestStates } from '@bcrs-shared-components/enums'

@Component({})
export default class InvalidFilingDialog extends Vue {
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

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

p {
  color: $gray9;
}
</style>
