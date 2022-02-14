<template>
  <div id="registration-define-business">
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
        <p class="mt-4">
          Enter the business mailing and delivery addresses. The Delivery Address must be located in
          British Columbia.
        </p>

        *** MAILING ADDRESS AND DELIVERY ADDRESS PLACEHOLDER ***

      </header>
    </section>

    <section class="mt-10">
      <header id="business-contact">
        <h2>Business Contact Information</h2>
        <p class="mt-4">
          Enter the contact information for the business. The Corporate Registry will use this to communicate
          with the business in the future, including sending registration documents and notifications.
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
        <p class="mt-4">
          Enter the start date of the business. The start date can be
          <v-tooltip top max-width="20rem" content-class="top-tooltip" transition="fade-transition">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="tool-tip dotted-underline">no more than 2 years in the past</span>
            </template>
            <span>Choose the oldest date possible even if the actual start date is older than 2 years in the
              past.</span>
          </v-tooltip>
          and 90 days in the future. Make certain that this is the correct date as it cannot be easily
          corrected afterwards.
        </p>
        <StartDate :initialValue="getRegistration.startDate"/>
      </header>
    </section>

    <section class="mt-10" v-if="isPremiumAccount">
      <header id="folio-number">
        <h2>Folio or Reference Number</h2>
        <p class="mt-4">
          Add an optional Folio or Reference Number to this business for your own tracking purposes. This
          information is not used by the BC Business Registry.
        </p>
      </header>

      <!-- FUTURE -->
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import StartDate from '@/components/Registration/StartDate.vue'
import { ActionBindingIF, BusinessContactIF, RegistrationStateIF } from '@/interfaces'
import { getRegistration } from '@/store/getters'
import { RouteNames } from '@/enums'
import { CommonMixin } from '@/mixins'

@Component({
  components: {
    BusinessContactInfo,
    NameRequestInfo,
    StartDate
  }
})
export default class RegistrationDefineBusiness extends Mixins(CommonMixin) {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getRegistration!: RegistrationStateIF
  @Getter getShowErrors!: boolean
  @Getter isPremiumAccount!: boolean

  @Action setBusinessContact!: ActionBindingIF

  private businessContactFormValid: boolean = false

  private onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    // todo: handle state validity
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.REGISTRATION_DEFINE_BUSINESS) {
      // Scroll to invalid components.
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          isStartDateValid: !!this.getRegistration.startDate
        },
        [
          'business-start-date'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#registration-define-business {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}
</style>
