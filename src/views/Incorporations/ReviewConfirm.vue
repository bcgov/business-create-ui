<template>
  <div>
    <div class="mt-10 company-statement" v-if="isTypeBcomp">
      <p v-if="getCompanyTitle">
        <span class="company-statement-label">{{ getCompanyTitle }}:</span>
        {{ getCompanyDescription }}
      </p>
    </div>

    <!-- Step Summaries -->
    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-1">Review the information in your application. If you need to change or complete anything, return
          to the step to make the necessary change.</p>
      </header>
      <Summary class="mt-6" />
    </section>

    <!-- Incorporation Date Time -->
    <section v-if="isBaseCompany" class="mt-10">
      <header>
        <h2>Incorporation Date and Time</h2>
        <p class="mt-1">Select the Date and Time of incorporation for your business. You may select
          a date up to 10 days in the future (note: there is an <strong>additional fee of $100</strong> to enter an
          incorporation date in the future). Unless a business has special requirements, most businesses select an
          immediate Date and Time of Incorporation.
        </p>
      </header>
      <IncorporationDateTime
        :effectiveDateTime="getEffectiveDateTime"
        @valid="setEffectiveDateTimeValid($event)"
        @effectiveDate="setEffectiveDate($event)"
        @isFutureEffective="setIsFutureEffective($event)"
      />
    </section>

    <!-- Document Delivery -->
    <section id="document-delivery-section" class="mt-10">
      <header>
        <h2>Document Delivery</h2>
        <p class="mt-1">Copies of the incorporation documents will be sent to the following email addresses listed
          below.
        </p>
      </header>
      <DocumentDelivery
          :registeredOfficeEmail="getBusinessContact.email"
          :userEmail="getUserEmail" />
    </section>

    <section class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-1">Confirm the legal name of the person authorized to complete and submit this application.</p>
      </header>
      <div :class="{ 'invalid-section': isCertifyInvalid }">
        <Certify
          :currentDate="getCurrentDate"
          :certifiedBy="getCertifyState.certifiedBy"
          :entityDisplay="getCompletingPartyStatement.entityDisplay"
          :isCertified="getCertifyState.valid"
          :statements="getCompletingPartyStatement.certifyStatements"
          :message="getCompletingPartyStatement.certifyClause"
          :isStaff="isRoleStaff"
          :firstColumn="3"
          :secondColumn="9"
          :invalidSection="isCertifyInvalid"
          :disableEdit="!isRoleStaff"
          @update:certifiedBy="onCertifiedBy($event)"
          @update:isCertified="onIsCertified($event)"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF, BusinessContactIF, CertifyIF, CertifyStatementIF, EffectiveDateTimeIF
} from '@/interfaces'

// Components
import { DocumentDelivery } from '@/components/common'
import { IncorporationDateTime, Summary } from '@/components/ReviewConfirm'
import { Certify } from '@/components'

@Component({
  components: {
    Certify,
    DocumentDelivery,
    IncorporationDateTime,
    Summary
  }
})
export default class ReviewConfirm extends Mixins() {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCertifyState!: CertifyIF
  @Getter getCompanyTitle!: string
  @Getter getCompanyDescription!: string
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getValidateSteps!: boolean
  @Getter isBaseCompany!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isRoleStaff!: boolean
  @Getter getCurrentDate!: string
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getUserEmail!: string

  @Action setEffectiveDateTimeValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Called when component is mounted. */
  mounted (): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }

  /** Is true when the certify conditions are not met. */
  private get isCertifyInvalid () {
    return this.getValidateSteps && (!this.getCertifyState.certifiedBy || !this.getCertifyState.valid)
  }

  /** Handler for Valid change event. */
  private onIsCertified (val: boolean): void {
    this.setCertifyState(
      {
        valid: val,
        certifiedBy: this.getCertifyState.certifiedBy
      }
    )
  }

  /** Handler for CertifiedBy change event. */
  private onCertifiedBy (val: string): void {
    this.setCertifyState(
      {
        valid: this.getCertifyState.valid,
        certifiedBy: val
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
}

::v-deep #document-delivery-section {
  .v-card {
    padding: 1.5rem 1.25rem !important;
  }

  .row {
    padding: 0.75rem 0;

    .col-3 {
      font-size: 0.875rem;
      color: $gray9;
      padding: 0 0 0 0.75rem !important;
    }

    .col-9 {
      padding: 0 0.5rem 0 0 !important;
    }
  }
}
</style>
