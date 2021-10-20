<template>
  <div class="rounded" :class="{'invalid-section': invalidStaffPayment}">
    <staff-payment-component
      class="pl-3"
      :staffPaymentData="getStaffPaymentStep.staffPayment"
      :validate="validateStaffPayment"
      :invalidSection="invalidStaffPayment"
      @update:staffPaymentData="onStaffPaymentDataUpdate($event)"
      @valid="setStaffPaymentValidity($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Components
import { StaffPayment as StaffPaymentComponent } from '@bcrs-shared-components/staff-payment'

// Interfaces and Enums
import { ActionBindingIF, StaffPaymentStepIF } from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

@Component({
  components: {
    StaffPaymentComponent
  }
})
export default class StaffPayment extends Vue {
  // Global getters
  @Getter getStaffPaymentStep!: StaffPaymentStepIF
  @Getter getValidateSteps!: boolean
  // Global actions
  @Action setStaffPayment!: ActionBindingIF
  @Action setStaffPaymentValidity!: ActionBindingIF

  /** Check validity state, only when prompted by app. */
  private get invalidStaffPayment (): boolean {
    return this.getValidateSteps && !this.getStaffPaymentStep.valid
  }

  /** Is true when prompted by the app AND the user has selected an option. */
  private get validateStaffPayment (): boolean {
    return this.getValidateSteps && !!this.getStaffPaymentStep.staffPayment?.option
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

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

::v-deep .v-input .v-label {
  font-weight: normal;
}

::v-deep .v-input--radio-group__input {
  .v-radio:not(:first-child) {
    padding-top: 2rem;
  }
  .v-input--checkbox {
    padding-top: 2rem;
  }
}

::v-deep .v-input--selection-controls__ripple {
  color: $gray7;
}

::v-deep .v-text-field__slot {
  .v-label {
    color: $gray7;
  }
}

</style>
