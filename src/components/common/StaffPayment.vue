<template>
  <div id="staff-payment-container" :class="{'invalid-section': invalidStaffPayment}">
    <StaffPaymentShared
      :staffPaymentData="getStaffPaymentStep.staffPayment"
      :displayPriorityCheckbox="displayPriorityCheckbox"
      :validate="getValidateSteps"
      :invalidSection="invalidStaffPayment"
      @update:staffPaymentData="onStaffPaymentDataUpdate($event)"
      @valid="setStaffPaymentValidity($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { StaffPayment as StaffPaymentShared } from '@bcrs-shared-components/staff-payment'
import { ActionBindingIF, StaffPaymentIF, StaffPaymentStepIF } from '@/interfaces'
import { StaffPaymentOptions } from '@/enums'

/** This is a shim between the view and the atomic component. */
@Component({
  components: {
    StaffPaymentShared
  }
})
export default class StaffPayment extends Vue {
  /** Whether to display priority checkbox. */
  @Prop({ default: true }) readonly displayPriorityCheckbox!: boolean

  // Global getters
  @Getter(useStore) getStaffPaymentStep!: StaffPaymentStepIF
  @Getter(useStore) getValidateSteps!: boolean

  // Global actions
  @Action(useStore) setStaffPayment!: ActionBindingIF
  @Action(useStore) setStaffPaymentValidity!: ActionBindingIF

  /** Check validity state, only when prompted by app. */
  get invalidStaffPayment (): boolean {
    return this.getValidateSteps && !this.getStaffPaymentStep.valid
  }

  onStaffPaymentDataUpdate (event: any) {
    let staffPaymentData: StaffPaymentIF = { ...this.getStaffPaymentStep.staffPayment, ...event }

    switch (staffPaymentData.option) {
      case StaffPaymentOptions.FAS:
        staffPaymentData = {
          option: StaffPaymentOptions.FAS,
          routingSlipNumber: staffPaymentData.routingSlipNumber,
          isPriority: staffPaymentData.isPriority,
          bcolAccountNumber: '',
          datNumber: '',
          folioNumber: ''
        }
        break

      case StaffPaymentOptions.BCOL:
        staffPaymentData = {
          option: StaffPaymentOptions.BCOL,
          bcolAccountNumber: staffPaymentData.bcolAccountNumber,
          datNumber: staffPaymentData.datNumber,
          folioNumber: staffPaymentData.folioNumber,
          isPriority: staffPaymentData.isPriority,
          routingSlipNumber: ''
        }
        break

      case StaffPaymentOptions.NO_FEE:
        staffPaymentData = {
          option: StaffPaymentOptions.NO_FEE,
          routingSlipNumber: '',
          isPriority: false,
          bcolAccountNumber: '',
          datNumber: '',
          folioNumber: ''
        }
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    this.setStaffPayment(staffPaymentData)
    this.emitHaveChanges()
  }

  @Emit('haveChanges')
  private emitHaveChanges (): void {}
}
</script>
