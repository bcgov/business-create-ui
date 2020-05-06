<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="payment-error-dialog">
    <v-card>
      <v-card-title id="dialog-title">Unable to Process Payment</v-card-title>

      <v-card-text>
        <p class="genErr">We are unable to process payments at this time. Your filing has been saved
          as a DRAFT and you can resume your filing from the Business Dashboard at a later time.</p>

        <template v-if="!isRoleStaff">
          <p class="genErr">PayBC is normally available:</p>
          <ul class="genErr mb-4">
            <li>Monday to Friday: 6:00am to 9:00pm</li>
            <li>Saturday: 12:00am to 7:00pm</li>
            <li>Sunday: 12:00pm to 12:00am</li>
          </ul>

          <p class="genErr">If this error persists, please contact us:</p>
          <ErrorContact />
        </template>
      </v-card-text>

      <v-divider class="my-0"></v-divider>

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

  /** Prop to display the dialog. */
  @Prop() private dialog: boolean

  /** Prop to provide attachment selector. */
  @Prop() private attach: string

  // Pass click event to parent.
  @Emit() private exit () { }
}
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/theme.scss';
</style>
