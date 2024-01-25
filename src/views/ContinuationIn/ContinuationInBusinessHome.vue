<template>
  <div id="continuation-in-business-home">
    <v-fade-transition>
      <div
        v-show="showSpinner"
        class="loading-container grayed-out"
      >
        <div class="loading__content">
          <v-progress-circular
            color="primary"
            size="50"
            indeterminate
          />
          <div class="loading-msg white--text">
            Fetching data
          </div>
        </div>
      </div>
    </v-fade-transition>

    <!-- Existing Business Information -->
    <section class="mt-10">
      <header id="existing-Business-information">
        <h2>Existing Business Information</h2>
        <p class="mt-4">
          Enter information about your existing business.
        </p>
      </header>

      <div>**TODO: Add component</div>
    </section>

    <!-- Continuation Authorization -->
    <section class="mt-10">
      <header id="continuation-authorization">
        <h2>Continuation Authorization</h2>
      </header>
      <p class="mt-4">
        You must provide proof of authorization to continue out of your home jurisdiction.
        This may be reviewed by our staff.
      </p>

      <div>**TODO: Add component</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import { RouteNames } from '@/enums'

@Component({})
export default class ContinuationInBusinessHome extends Mixins(CommonMixin, NameRequestMixin) {
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  // Local properties
  showSpinner = false

  /** Array of valid components. Must match validFlags below. **TODO: Add components. */
  readonly validComponents = []

  /** Object of valid flags. Must match validComponents above. **TODO: Add flags. */
  get validFlags (): object {
    return {}
  }

  /** Called when component is created. */
  created (): void {
    // ignore data changes while page loads
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })

    // listen for spinner show/hide events
    this.$root.$on('showSpinner', (flag = false) => { this.showSpinner = flag })
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

header p {
  padding-top: 0.5rem;
}
</style>
