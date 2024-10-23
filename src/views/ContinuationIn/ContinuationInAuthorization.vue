<template>
  <div id="continuation-in-authorization">
    <!-- Name -->
    <section
      id="name-section"
      class="mt-10"
    >
      <header>
        <h2>Name</h2>
      </header>

      <v-card
        flat
        class="mt-4"
      >
        <NameRequestInfo />

        <template v-if="!getNameRequestNumber">
          <v-divider class="mx-6 mt-n2" />
          <NameTranslations class="px-6 py-8" />
        </template>
      </v-card>
    </section>

    <!-- Existing Business Information -->
    <section
      id="existing-business-information"
      class="mt-10"
    >
      <header>
        <h2>Existing Business Information</h2>
        <p>
          Enter information about your existing business. If your company is extraprovincially registered
          in B.C., that registration will be made historical when this Continuation Application is processed.
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
    <section
      id="contact-information"
      class="mt-10"
    >
      <header>
        <h2>Contact Information</h2>
        <p>
          Enter the contact information for the resulting business. BC Registries will use this to
          communicate with the business in the future, including sending documents and notifications.
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
    <section
      id="proof-of-authorization"
      class="mt-10"
    >
      <header>
        <h2>Proof of Authorization</h2>
        <p>
          You must provide proof of authorization to continue out of your previous jurisdiction. This
          will be reviewed by BC Registries.
        </p>
      </header>

      <AuthorizationProof
        @valid="authorizationProofValid = $event"
      />
    </section>

    <!-- Unlimited Liability Corporation Information -->
    <v-expand-transition>
      <section
        v-if="isUlcInfoRequired"
        id="ulc-information-section"
        class="mt-10"
      >
        <header>
          <h2>Unlimited Liability Corporation Information</h2>
          <p>
            Additional information is required for an Unlimited Liability Corporation from Alberta.
          </p>
        </header>

        <ExpandableHelp
          class="mt-4"
          helpLabel="Help with Unlimited Liability Corporation Information"
        >
          <template #content>
            <UnlimitedLiabilityCorporationHelp />
          </template>
        </ExpandableHelp>

        <UnlimitedLiabilityCorporationInformation
          ref="ulcInformation"
          class="mt-6"
          @valid="ulcInformationValid = $event"
        />
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { ContactPointIF } from '@bcrs-shared-components/interfaces'
import { ExpandableHelp } from '@bcrs-shared-components/expandable-help'
import { JurisdictionLocation } from '@bcrs-shared-components/enums/'
import AuthorizationProof from '@/components/ContinuationIn/AuthorizationProof.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import ExtraproRegistration from '@/components/ContinuationIn/ExtraproRegistration.vue'
import ManualBusinessInfo from '@/components/ContinuationIn/ManualBusinessInfo.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'
import UnlimitedLiabilityCorporationInformation
  from '@/components/ContinuationIn/UnlimitedLiabilityCorporationInformation.vue'
import UnlimitedLiabilityCorporationHelp from '@/components/ContinuationIn/UnlimitedLiabilityCorporationHelp.vue'

@Component({
  components: {
    AuthorizationProof,
    BusinessContactInfo,
    ExpandableHelp,
    ExtraproRegistration,
    ManualBusinessInfo,
    NameRequestInfo,
    NameTranslations,
    UnlimitedLiabilityCorporationHelp,
    UnlimitedLiabilityCorporationInformation
  }
})
export default class ContinuationInAuthorization extends Mixins(CommonMixin, NameRequestMixin) {
  // Refs
  $refs!: {
    ulcInformation: UnlimitedLiabilityCorporationInformation
  }

  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getValidateSteps!: boolean
  @Getter(useStore) isEntityUlcContinueIn!: boolean
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
  ulcInformationValid = false

  /** Array of valid components. Must match validFlags below. */
  readonly validComponents = [
    'name-section',
    'existing-business-information',
    'contact-information',
    'proof-of-authorization',
    'ulc-information-section'
  ]

  /** Object of valid flags. Must match validComponents above. */
  get validFlags (): object {
    return {
      validNameSection: this.getNameTranslationsValid,
      existingBusinessInformationValid: this.existingBusinessInformationValid,
      contactInformationValid: this.businessContactInfoValid,
      authorizationProofValid: this.authorizationProofValid,
      ulcInformationValid: this.ulcInformationValid
    }
  }

  /**
   * Whether additional ULC information is required.
   * Is true if the business is a Continued In ULC from Alberta.
   */
  get isUlcInfoRequired (): boolean {
    const previousJurisdiction = this.getExistingBusinessInfo?.previousJurisdiction
    return (
      this.isEntityUlcContinueIn &&
      (previousJurisdiction?.country === JurisdictionLocation.CA) &&
      (previousJurisdiction?.region === 'AB')
    )
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

  /** When ULC Info is no longer required, remove existing file info. */
  @Watch('isUlcInfoRequired')
  private onUlcInfoRequiredChanged (val: boolean): void {
    if (!val) {
      this.$refs.ulcInformation.onRemoveClicked()
    }
  }

  /**
   * Watch all components on this page and set validity in the store accordingly.
   * Note: Only need 1 immediate watcher for initial update.
   */
  @Watch('getNameTranslationsValid', { immediate: true })
  @Watch('existingBusinessInformationValid')
  @Watch('businessContactInfoValid')
  @Watch('authorizationProofValid')
  @Watch('isUlcInfoRequired')
  @Watch('ulcInformationValid')
  private onComponentValidityChanged () {
    this.setContinuationAuthorizationPageValid(
      this.getNameTranslationsValid &&
      this.existingBusinessInformationValid &&
      this.businessContactInfoValid &&
      this.authorizationProofValid &&
      (!this.isUlcInfoRequired || this.ulcInformationValid)
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
