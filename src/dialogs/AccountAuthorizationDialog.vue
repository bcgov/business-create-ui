<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="account-authorization-dialog">
    <v-card>
      <v-card-title id="dialog-title">Account Authorization</v-card-title>

      <v-card-text>
        <p class="font-14">This account appears to be unable to access this name request, incorporation application,
          or business. You can retry, or you can exit and return to the dashboard.</p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn id="dialog-exit-button" color="primary" text @click="exit()">Exit</v-btn>
        <v-spacer></v-spacer>
        <v-btn id="dialog-retry-button" color="primary" text @click="retry()">Retry</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class AccountAuthorizationDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() exit (): void {}
  @Emit() retry (): void {}
}
</script>
