<template>
  <div id="continuation-in-authorization">
    <!-- Existing Business Information -->
    <section class="mt-10">
      <header id="existing-business-information">
        <h2>Existing Business Information</h2>
        <p>
          Enter information about your existing business. If your company is extraprovincially registered
          in B.C., that registration will be made historical when this continuation application is processed.
        </p>
      </header>

      <v-card
        flat
        class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !existingBusinessInformationValid }"
      >
        <v-expand-transition>
          <ExtraproRegistration
            v-if="!manualBusinessInfoActive"
            @active="extraproRegistrationActive = $event"
            @valid="extraproRegistrationValid = $event"
          />
        </v-expand-transition>

        <div :class="{ 'mt-6': !extraproRegistrationActive && !manualBusinessInfoActive }" />

        <v-expand-transition>
          <ManualBusinessInfo
            v-if="!extraproRegistrationActive"
            @active="manualBusinessInfoActive = $event"
            @valid="manualBusinessInfoValid = $event"
          />
        </v-expand-transition>
      </v-card>
    </section>

    <!-- Contact Information -->
    <section class="mt-10">
      <header id="contact-information">
        <h2>Contact Information</h2>
        <p>
          Enter the contact information for the continuation authorization. The BC Business Registry
          will use this to communicate with the business about this authorization in the future,
          including sending documents and notifications.
        </p>
      </header>

      <v-card
        flat
        class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !businessContactInfoValid }"
      >
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="true"
          :showErrors="getShowErrors"
          @update="setBusinessContact($event)"
          @valid="businessContactInfoValid = $event"
        />
      </v-card>
    </section>

    <!-- Proof of Authorization -->
    <section class="mt-10">
      <header id="proof-of-authorization">
        <h2>Proof of Authorization</h2>
        <p>
          You must provide proof of authorization to continue out of your home jurisdiction.
          This will be reviewed by our staff.
        </p>
      </header>

      <AuthorizationProof
        @valid="authorizationProofValid = $event"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'
import AuthorizationProof from '@/components/ContinuationIn/AuthorizationProof.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import ExtraproRegistration from '@/components/ContinuationIn/ExtraproRegistration.vue'
import ManualBusinessInfo from '@/components/ContinuationIn/ManualBusinessInfo.vue'

@Component({
  components: {
    AuthorizationProof,
    BusinessContactInfo,
    ExtraproRegistration,
    ManualBusinessInfo
  }
})
export default class ContinuationInAuthorization extends Mixins(CommonMixin, NameRequestMixin) {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isFilingValid!: boolean

  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setContinuationAuthorizationPageValid!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void
  @Action(useStore) setShowErrors!: (x: boolean) => void
  @Action(useStore) setValidateSteps!: (x: boolean) => void

  // Local properties
  manualBusinessInfoActive = false
  manualBusinessInfoValid = false
  extraproRegistrationActive = false
  extraproRegistrationValid = false
  businessContactInfoValid = false
  authorizationProofValid = false

  /** Array of valid components. Must match validFlags below. */
  readonly validComponents = [
    'existing-business-information',
    'contact-information',
    'proof-of-authorization'
  ]

  /** Object of valid flags. Must match validComponents above. */
  get validFlags (): object {
    return {
      existingBusinessInformationValid: this.existingBusinessInformationValid,
      contactInformationValid: this.businessContactInfoValid,
      authorizationProofValid: this.authorizationProofValid
    }
  }

  /** Whether the Existing Business Information section is valid. */
  get existingBusinessInformationValid (): boolean {
    return (this.extraproRegistrationValid || this.manualBusinessInfoValid)
  }

  /** Called when component is created. */
  created (): void {
    // ignore data changes while page loads
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Watch all components on this page and set validity in store accordingly. */
  @Watch('existingBusinessInformationValid', { immediate: true })
  @Watch('businessContactInfoValid', { immediate: true })
  @Watch('authorizationProofValid', { immediate: true })
  private onComponentValidityChanged () {
    this.setContinuationAuthorizationPageValid(
      this.existingBusinessInformationValid &&
      this.businessContactInfoValid &&
      this.authorizationProofValid
    )
  }

  /** Called when user has clicked Submit (and this flag's value has changed). */
  @Watch('getValidateSteps')
  private async onValidateStepsChanges (val: boolean): Promise<void> {
    if (val) {
      // set Show Errors flag to enable and show component validation
      this.setShowErrors(true)
      // wait for validation to complete
      await this.$nextTick()
      // scroll to the first error, if any
      await this.validateAndScroll(this.validFlags, this.validComponents)
      // reset this flag so user can click Submit again and we can re-validate
      this.setValidateSteps(false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.loading-container.grayed-out {
  // these are the same styles as dialog overlay:
  opacity: 0.46;
  background-color: rgb(33, 33, 33); // grey darken-4
  border-color: rgb(33, 33, 33); // grey darken-4
}

#continuation-in-authorization {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

header > p {
  padding-top: 0.5rem;
}
</style>
