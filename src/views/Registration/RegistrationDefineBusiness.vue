<template>
  <div id="registration-define-business">
    <!-- Name -->
    <section class="mt-10">
      <header id="name-header">
        <h2>Name</h2>
      </header>

      <v-card flat class="mt-5">
        <NameRequestInfo />

        <v-divider class="mx-6" />

        <!-- Business Type -->
        <header id="business-type-confirm-header" />
        <BusinessTypeConfirm
          class="py-8 px-6"
          :class="{ 'invalid-section': getShowErrors && !businessTypeConfirmValid }"
          :businessTypeConfirm="getRegistration.businessTypeConfirm"
          :isTypePartnership="isTypePartnership"
          @update:businessTypeConfirm="setRegistrationBusinessTypeConfirm($event)"
          @valid="onBusinessTypeConfirmValidEvent($event)"
        />

        <v-divider class="mx-6" />

        <!-- Nature Of Business -->
        <header id="nature-of-business-header" />
        <NatureOfBusiness
          class="py-8 px-6"
          :class="{ 'invalid-section': getShowErrors && !natureOfBusinessValid }"
          :showErrors="getShowErrors"
          @valid="onNatureOfBusinessValidEvent($event)"
        />

        <template v-if="isTypePartnership">
          <v-divider class="mx-6" />

          <!-- Business Number -->
          <header id="business-number-header" />
          <BusinessNumber
            class="py-8 px-6"
            :class="{ 'invalid-section': getShowErrors && !businessNumberValid }"
            :businessNumber="getRegistration.businessNumber"
            @update:businessNumber="setRegistrationBusinessNumber($event)"
            @valid="onBusinessNumberValidEvent($event)"
          />
        </template>
      </v-card>

    </section>

    <!-- Business Addresses -->
    <section class="mt-10">
      <header id="business-addresses-header">
        <h2>Business Addresses</h2>
        <p class="mt-4">
          Enter the business mailing and delivery addresses. The Delivery Address must be located in
          British Columbia.
        </p>
      </header>

      <v-card flat class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !businessAddressesValid }"
      >
        <BusinessAddresses
          :isEditing="true"
          :showErrors="getShowErrors"
          @valid="onBusinessAddressValidEvent($event)"
        />
      </v-card>
    </section>

    <!-- Business Contact Information -->
    <section class="mt-10">
      <header id="business-contact-header">
        <h2>Business Contact Information</h2>
        <p class="mt-4">
          Enter the contact information for the business. The BC Business Registry will use this to communicate
          with the business in the future, including sending registration documents and notifications.
        </p>
      </header>

      <v-card flat class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !businessContactValid }"
      >
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="true"
          :showErrors="getShowErrors"
          @update="setBusinessContact($event)"
          @valid="onBusinessContactInfoValidEvent($event)"
        />
      </v-card>
    </section>

    <!-- Business Start Date -->
    <section class="mt-10">
      <header id="business-start-date-header">
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
      </header>

      <v-card flat class="step-container" :class="{ 'invalid-section': getShowErrors && !startDateValid }">
        <StartDate
          @valid="onStartDateValidEvent($event)"
        />
      </v-card>
    </section>

    <!-- Folio or Reference Number -->
    <section class="mt-10" v-if="isPremiumAccount">
      <header id="folio-number-header">
        <h2>Folio or Reference Number</h2>
        <p class="mt-4">
          Add an optional Folio or Reference Number to this business for your own tracking purposes. This
          information is not used by the BC Business Registry.
        </p>
      </header>

      <v-card flat class="step-container" :class="{ 'invalid-section': getShowErrors && !folioNumberValid }">
        <FolioNumber
          :initialValue="getFolioNumber"
          :isEditing="true"
          @update="setFolioNumber($event)"
          @valid="onFolioNumberValidEvent($event)"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import BusinessAddresses from '@/components/Registration/BusinessAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import BusinessNumber from '@/components/Registration/BusinessNumber.vue'
import BusinessTypeConfirm from '@/components/Registration/BusinessTypeConfirm.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NatureOfBusiness from '@/components/Registration/NatureOfBusiness.vue'
import StartDate from '@/components/Registration/StartDate.vue'
import { ActionBindingIF, ContactPointIF, RegistrationStateIF } from '@/interfaces'
import { RouteNames } from '@/enums'
import { CommonMixin } from '@/mixins'

@Component({
  components: {
    BusinessAddresses,
    BusinessContactInfo,
    BusinessNumber,
    BusinessTypeConfirm,
    FolioNumber,
    NameRequestInfo,
    NatureOfBusiness,
    StartDate
  }
})
export default class RegistrationDefineBusiness extends Mixins(CommonMixin) {
  @Getter getBusinessContact!: ContactPointIF
  @Getter getRegistration!: RegistrationStateIF
  @Getter getShowErrors!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getFolioNumber!: string
  @Getter isTypePartnership!: boolean

  @Action setBusinessContact!: ActionBindingIF
  @Action setRegistrationDefineBusinessValid!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setRegistrationBusinessNumber!: ActionBindingIF
  @Action setRegistrationBusinessTypeConfirm!: ActionBindingIF

  // local variables
  businessTypeConfirmValid = false
  natureOfBusinessValid = false
  businessNumberValid = false
  businessAddressesValid = false
  businessContactValid = false
  startDateValid = false
  folioNumberValid = false

  /** Object of valid flags. Must match validComponents. */
  get validFlags (): object {
    return {
      businessTypeConfirmValid: this.isTypePartnership ? this.businessTypeConfirmValid : true,
      natureOfBusinessValid: this.natureOfBusinessValid,
      businessNumberValid: this.isTypePartnership ? this.businessNumberValid : true,
      businessAddressesValid: this.businessAddressesValid,
      businessContactValid: this.businessContactValid,
      businessStartDateValid: this.startDateValid,
      folioNumberValid: !this.isPremiumAccount || this.folioNumberValid
    }
  }

  /** Array of valid components. Must match validFlags. */
  readonly validComponents = [
    'business-type-confirm-header',
    'nature-of-business-header',
    'business-number-header',
    'business-addresses-header',
    'business-contact-header',
    'business-start-date-header',
    'folio-number-header'
  ]

  /** True if all flags are valid. */
  get allFlagsValid (): boolean {
    return Object.keys(this.validFlags)
      .map(key => this.validFlags[key])
      .every(flag => flag)
  }

  onBusinessTypeConfirmValidEvent (valid: boolean): void {
    this.businessTypeConfirmValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onNatureOfBusinessValidEvent (valid: boolean): void {
    this.natureOfBusinessValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onBusinessNumberValidEvent (valid: boolean): void {
    this.businessNumberValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onBusinessAddressValidEvent (valid: boolean): void {
    this.businessAddressesValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onBusinessContactInfoValidEvent (valid: boolean): void {
    this.businessContactValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onStartDateValidEvent (valid: boolean): void {
    this.startDateValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  onFolioNumberValidEvent (valid: boolean): void {
    this.folioNumberValid = valid
    this.setRegistrationDefineBusinessValid(this.allFlagsValid)
  }

  @Watch('$route')
  async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.REGISTRATION_DEFINE_BUSINESS) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
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
