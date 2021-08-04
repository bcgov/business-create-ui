<template>
  <div>
    <div class="mt-10 company-statement" v-if="isTypeBcomp">
      <p>
        <span class="company-statement-label">{{ getCompanyResources.title }}:</span>
        {{ getCompanyResources.description }}
      </p>
    </div>

    <section class="mt-10">
      <header>
        <h2>Review and Confirm</h2>
        <p class="mt-1">Review the information in your application. If you need to change or complete anything, return
          to the step to make the necessary change.</p>
      </header>
      <Summary class="mt-6"/>
    </section>
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
        :incorporationDateTime="incorporationDateTime"
        @valid="onValidDateTime($event)"
        @dateTime="setDateTime($event)"
      />
    </section>

    <section class="mt-10">
      <header>
        <h2>Certify</h2>
        <p class="mt-1">Enter the legal name of the person authorized to complete and submit this application.</p>
      </header>
      <div :class="{ 'invalid-section': isCertifyInvalid }">
        <certify
          :currentDate="currentDate"
          :certifiedBy="getCertifyState.certifiedBy"
          :isCertified="getCertifyState.valid"
          :statements="getCompletingPartyStatement.certifyStatements"
          :message="getCompletingPartyStatement.certifyClause"
          :enableMailTo="true"
          :businessEmail="getBusinessEmail"
          :completingPartyEmail="getCompletingPartyEmail"
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
import { State, Action, Getter } from 'vuex-class'

// Interfaces
import { CertifyStatementIF, ActionBindingIF, CertifyIF, DateTimeIF, GetterIF, ResourceIF } from '@/interfaces'

// Components
import { IncorporationDateTime, Summary } from '@/components/ReviewConfirm'
import { Certify } from '@bcrs-shared-components/certify'

@Component({
  components: {
    Certify,
    IncorporationDateTime,
    Summary
  }
})
export default class ReviewConfirm extends Mixins() {
  // Global state
  @State(state => state.stateModel.currentDate)
  readonly currentDate!: string

  @State(state => state.stateModel.incorporationDateTime)
  readonly incorporationDateTime!: DateTimeIF

  // Global Getters
  @Getter getBusinessEmail!: string
  @Getter getCertifyState!: CertifyIF
  @Getter getCompanyResources!: ResourceIF
  @Getter getCompletingPartyStatement!: CertifyStatementIF
  @Getter getCompletingPartyEmail!: string
  @Getter getValidateSteps!: boolean
  @Getter isBaseCompany!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isRoleStaff!: boolean

  // Global Actions
  @Action setIsIncorporationDateTimeValid!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
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

  /** Handler for Valid DateTime change event. */
  private onValidDateTime (val: boolean): void {
    this.setIsIncorporationDateTimeValid(val)
  }

  /** Handler for setting DateTime. */
  private setDateTime (val: string): void {
    this.setEffectiveDate(val)
  }
}
</script>

<style lang="scss" scoped>
.company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
}
</style>
