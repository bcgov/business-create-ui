<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="save-error-dialog"
  >
    <v-card>
      <!-- if there are errors, or neither errors nor warnings... -->
      <v-card-title
        v-if="numErrors > 0 || numWarnings < 1"
        id="dialog-title"
      >
        Unable to save {{ filingName }}
      </v-card-title>

      <!-- otherwise there are only warnings... -->
      <v-card-title
        v-else
        id="dialog-title"
      >
        {{ filingName }} saved with warnings
      </v-card-title>

      <v-card-text id="dialog-text">
        <!-- display generic message (no errors or warnings) -->
        <div
          v-if="(numErrors + numWarnings) < 1"
          class="font-14"
        >
          <p>
            We were unable to save your {{ filingName }}. You can continue to try to save this
            {{ filingName }} or you can exit without saving and re-create this {{ filingName }} at another time.
          </p>
          <p>If you exit, any changes you've made will not be saved.</p>
        </div>

        <!-- display errors -->
        <div
          v-if="numErrors > 0"
          class="font-14 mb-4"
        >
          <p>We were unable to save your {{ filingName }} due to the following errors:</p>
          <ul>
            <li
              v-for="(error, index) in errors"
              :key="index"
            >
              {{ error.error }}
            </li>
          </ul>
        </div>

        <!-- display warnings-->
        <div
          v-if="numWarnings > 0"
          class="font-14 mb-4"
        >
          <p>Please note the following warnings:</p>
          <ul>
            <li
              v-for="(warning, index) in warnings"
              :key="index"
            >
              {{ warning.warning }}
            </li>
          </ul>
        </div>

        <template v-if="!isRoleStaff">
          <p class="font-14">
            If this error persists, please contact us:
          </p>
          <RegistriesContactInfo />
        </template>
      </v-card-text>

      <v-divider class="my-0" />

      <!-- if there are errors, or neither errors nor warnings... -->
      <v-card-actions v-if="numErrors > 0 || numWarnings < 1">
        <v-btn
          id="dialog-exit-button"
          color="primary"
          variant="text"
          @click="exit()"
        >
          Exit without saving
        </v-btn>
        <v-spacer />
        <v-btn
          id="dialog-okay-button"
          color="primary"
          variant="text"
          @click="okay()"
        >
          OK
        </v-btn>
      </v-card-actions>

      <!-- otherwise there are only warnings... -->
      <v-card-actions v-else>
        <v-spacer />
        <v-btn
          id="dialog-okay-button"
          color="primary"
          variant="text"
          @click="okay()"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
import { FilingTypes } from '@bcrs-shared-components/enums'

@Component({
  components: {
    RegistriesContactInfo
  }
})
export default class SaveErrorDialog extends Vue {
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) getFilingType!: FilingTypes

  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  /** Prop containing error messages. */
  @Prop({ default: () => [] }) readonly errors!: any[]

  /** Prop containing warning messages. */
  @Prop({ default: () => [] }) readonly warnings!: any[]

  // Pass click events to parent.
  @Emit() exit (): void {}
  @Emit() okay (): void {}

  /** The filing name. */
  get filingName (): string {
    switch (this.getFilingType) {
      case FilingTypes.INCORPORATION_APPLICATION: return 'Application'
      case FilingTypes.REGISTRATION: return 'Registration'
      case FilingTypes.RESTORATION: return 'Restoration'
      case FilingTypes.DISSOLUTION: return 'Filing'
      default: return 'Application'
    }
  }

  /** The number of errors in the passed-in array. */
  get numErrors (): number {
    return (this.errors?.length || 0)
  }

  /** The number of warnings in the passed-in array. */
  get numWarnings (): number {
    return (this.warnings?.length || 0)
  }
}
</script>
