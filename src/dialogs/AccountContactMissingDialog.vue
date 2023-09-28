<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="account-authorization-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Account Error
      </v-card-title>

      <v-card-text>
        <p class="font-14">
          This account seems to have incomplete information. Click ‘OK’ to update your account details.
        </p>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn
          id="dialog-exit-button"
          color="primary"
          variant="text"
          @click="exit()"
        >
          Exit
        </v-btn>
        <v-spacer />
        <v-btn
          id="to-user-profile-button"
          color="primary"
          variant="text"
          @click="redirectToUserProfile"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class AccountContactMissingDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() exit (): void {}

  // Method to redirect to user profile page
  redirectToUserProfile (): void {
    const authWebUrl = sessionStorage.getItem('AUTH_WEB_URL')
    const userProfileUrl = `${authWebUrl}/userprofile`
    window.location.href = userProfileUrl
  }
}
</script>
