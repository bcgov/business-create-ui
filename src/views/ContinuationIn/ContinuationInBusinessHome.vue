<template>
  <div id="continuation-in-business-home">
    <!-- Existing Business Information -->
    <section class="mt-10">
      <header id="existing-Business-information">
        <h2>Existing Business Information</h2>
        <p class="mt-4">
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

    <!-- Continuation Authorization -->
    <section class="mt-10">
      <header id="continuation-authorization">
        <h2>Continuation Authorization</h2>
        <p class="mt-4">
          You must provide proof of authorization to continue out of your home jurisdiction.
          This may be reviewed by our staff.
        </p>
      </header>

      <v-card
        flat
        class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !continuationAuthorizationValid }"
      >
        <ContinuationAuthorization
          @valid="continuationAuthorizationValid = $event"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import ContinuationAuthorization from '@/components/ContinuationIn/ContinuationAuthorization.vue'
import ExtraproRegistration from '@/components/ContinuationIn/ExtraproRegistration.vue'
import ManualBusinessInfo from '@/components/ContinuationIn/ManualBusinessInfo.vue'
import { ExistingBusinessInfoIF } from '@/interfaces'

@Component({
  components: {
    ContinuationAuthorization,
    ManualBusinessInfo,
    ExtraproRegistration
  }
})
export default class ContinuationInBusinessHome extends Mixins(CommonMixin, NameRequestMixin) {
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationInBusinessHomeValid!: (x: boolean) => void
  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void

  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  // Local properties
  manualBusinessInfoActive = false
  manualBusinessInfoValid = false
  extraproRegistrationActive = false
  extraproRegistrationValid = false
  continuationAuthorizationValid = false

  /** Array of valid components. Must match validFlags below. */
  readonly validComponents = [
    'existing-business-information',
    'continuation-authorization'
  ]

  /** Object of valid flags. Must match validComponents above. */
  get validFlags (): object {
    return {
      existingBusinessInformationValid: this.existingBusinessInformationValid,
      continuationAuthorizationValid: this.continuationAuthorizationValid
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
  @Watch('continuationAuthorizationValid', { immediate: true })
  @Watch('existingBusinessInformationValid', { immediate: true })
  private onContinuationInBusinessHomeValid () {
    this.setContinuationInBusinessHomeValid(
      this.continuationAuthorizationValid &&
      this.existingBusinessInformationValid
    )
  }

  /** When we route to this step, validate the step and scroll to any errors. */
  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.CONTINUATION_IN_BUSINESS_HOME) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
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

#continuation-in-business-home {
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
