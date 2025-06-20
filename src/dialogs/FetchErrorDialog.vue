<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="fetch-error-dialog"
  >
    <v-card>
      <v-card-title id="dialog-title">
        Unable to Resume Application
      </v-card-title>

      <v-card-text>
        <p class="font-14">
          We were unable to resume your application. You can retry to resume your
          application now, or you can exit and return to the dashboard.
        </p>

        <template v-if="!IsAuthorized(AuthorizedActions.NO_CONTACT_INFO)">
          <p class="font-14">
            If this error persists, please contact us:
          </p>
          <RegistriesContactInfo />
        </template>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-btn
          id="dialog-exit-button"
          color="primary"
          text
          @click="exit()"
        >
          Return to dashboard
        </v-btn>
        <v-spacer />
        <v-btn
          id="dialog-retry-button"
          color="primary"
          text
          @click="retry()"
        >
          Retry
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
import { AuthorizedActions } from '@/enums'
import { IsAuthorized } from '@/utils'

@Component({
  components: {
    RegistriesContactInfo
  }
})
export default class FetchErrorDialog extends Vue {
  // for template
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() exit (): void {}
  @Emit() retry (): void {}
}
</script>
