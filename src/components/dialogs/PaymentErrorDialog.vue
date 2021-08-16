<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="payment-error-dialog">
    <v-card>
      <v-card-title id="dialog-title">Unable to process payment</v-card-title>

      <v-card-text id="dialog-text">
        <!-- display common message -->
        <div class="genErr">
          <p>We are unable to process your payment at this time. This {{filingName}} has been saved
            as a DRAFT and you can retry your payment from the Business Dashboard at a later time.</p>
        </div>

        <!-- display generic message (no errors or warnings) -->
        <div class="genErr" v-if="!isRoleStaff && (numErrors + numWarnings) < 1">
          <p>PayBC is normally available:</p>
          <ul>
            <li>Monday to Friday: 6:00am to 9:00pm</li>
            <li>Saturday: 12:00am to 7:00pm</li>
            <li>Sunday: 12:00pm to 12:00am</li>
          </ul>
        </div>

        <!-- display errors -->
        <div class="genErr mb-4" v-if="numErrors > 0">
          <p>We were unable to process your payment due to the following errors:</p>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error.message }}</li>
          </ul>
        </div>

        <!-- display warnings-->
        <div class="genErr mb-4" v-if="numWarnings > 0">
          <p>Please note the following warnings:</p>
          <ul>
            <li v-for="(warning, index) in warnings" :key="index">{{ warning.message }}</li>
          </ul>
        </div>

        <template v-if="!isRoleStaff">
          <p class="genErr">If this error persists, please contact us:</p>
          <ErrorContact />
        </template>
      </v-card-text>

      <v-divider class="my-0" />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn id="dialog-exit-button" color="primary" text @click="exit()">Return to dashboard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import ErrorContact from '@/components/common/ErrorContact.vue'

@Component({
  components: { ErrorContact }
})
export default class PaymentErrorDialog extends Vue {
  @Getter isRoleStaff!: boolean

  /** Prop containing filing name. */
  @Prop({ default: 'Application' }) private readonly filingName: string

  /** Prop to display the dialog. */
  @Prop() private readonly dialog: boolean

  /** Prop to provide attachment selector. */
  @Prop() private readonly attach: string

  /** Prop containing error messages. */
  @Prop({ default: () => [] }) private readonly errors: any[]

  /** Prop containing warning messages. */
  @Prop({ default: () => [] }) private readonly warnings: any[]

  /** Pass click event to parent. */
  @Emit() private exit () { }

  /** The number of errors in the passed-in array. */
  private get numErrors (): number {
    return this.errors?.length || 0
  }

  /** The number of warnings in the passed-in array. */
  private get numWarnings (): number {
    return this.warnings?.length || 0
  }
}
</script>
