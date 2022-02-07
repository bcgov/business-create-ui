<template>
  <div id="define-registration">
    <section class="mt-10">
      <header id="name-info">
        <h2>Name</h2>
      </header>
      <v-card flat class="step-container">
        <NameRequestInfo />
      </v-card>
    </section>

    <section class="mt-10">
      <header id="business-addresses">
        <h2>Business Addresses</h2>
        <p class="mt-4">Enter the business mailing and delivery addresses. The Delivery Address must be located in
          British Columbia.
        </p>
      </header>
    </section>

    <section class="mt-10">
      <header id="business-contact">
        <h2>Business Contact Information</h2>
        <p class="mt-4">Enter the contact information for the business. The Corporate Registry will use this to
          communicate with the business in the future, including sending registration documents and notifications.
        </p>
      </header>
      <BusinessContactInfo
        :initialValue="getBusinessContact"
        :isEditing="true"
        :showErrors="null"
        @contactInfoChange="setBusinessContact($event)"
        @contactInfoFormValidityChange="onBusinessContactFormValidityChange($event)"
      />
    </section>

    <section class="mt-10">
      <header id="business-start-date">
        <h2>Business Start Date</h2>
        <p class="mt-4">Enter the start date of the business. The start date can be
          <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline">no more than 2 years in the past</span>
            </template>
            <span>
              Choose the oldest date possible even if the actual start date is older than 2 years in the past.
            </span>
          </v-tooltip>
          and 90 days in the future. Make certain that this is the correct date as it cannot be easily corrected
          afterwards.
        </p>
        <StartDate :initialValue="getRegistration.startDate"/>
      </header>
    </section>

    <section class="mt-10" v-if="isPremiumAccount">
      <header id="folio-number">
        <h2>Folio or Reference Number</h2>
        <p class="mt-4">Add an optional Folio or Reference Number to this business for your own tracking purposes. This
          information is not used by the BC Business Registry.
        </p>
      </header>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

import { BusinessContactInfo, NameRequestInfo } from '@/components/common'
import { StartDate } from '@/components/DefineRegistration'
import { ActionBindingIF, BusinessContactIF, RegistrationStateIF } from '@/interfaces'
import { getRegistration } from '@/store/getters'

@Component({
  components: {
    BusinessContactInfo,
    NameRequestInfo,
    StartDate
  }
})
export default class DefineRegistration extends Vue {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getRegistration!: RegistrationStateIF
  @Getter isPremiumAccount!: boolean

  @Action setBusinessContact!: ActionBindingIF

  private businessContactFormValid: boolean = false

  private onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    // todo: handle state validity
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#define-registration {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
