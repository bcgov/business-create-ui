<template>
  <div id="restoration-business-name">
    <!-- Name -->
    <section id="name-section" class="mt-10">
      <header>
        <h2>Name</h2>
        <p>Add a Name Request that is reserved for this restoration application or restore
          as a numbered company.</p>
      </header>

      <v-card flat class="mt-5">
        <BusinessName
          @hasNameTranslation="onNameTranslation($event)"
        />
      </v-card>
    </section>

    <!-- Restoration Type -->
    <section id="restoration-type-section" class="mt-10">
      <header>
        <h2>Restoration Type</h2>
        <p>Determine the restoration and approval type.</p>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !getRestorationTypeValid || !getApprovalTypeValid }">
        <RestorationType />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { CorpTypeCd, RouteNames } from '@/enums'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import RestorationType from '@/components/Restoration/RestorationType.vue'

@Component({
  components: {
    BusinessName,
    RestorationType
  },
  mixins: [
    CommonMixin
  ]
})
export default class RestorationBusinessName extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getShowErrors!: boolean
  @Getter getRestorationTypeValid!: boolean

  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  protected hasValidNameTranslation = true

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  private onNameTranslation (valid: boolean): void {
    // *** TODO: hook this up
    // this.hasValidNameTranslation = valid
    // this.setDefineCompanyStepValidity(
    //   this.hasValidNameTranslation
    // )
  }
  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.RESTORATION_BUSINESS_NAME) {
      // scroll to invalid components
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          hasValidNameTranslation: this.hasValidNameTranslation,
          hasValidRestorationType: this.getRestorationTypeValid
        },
        [
          'name-section',
          'restoration-type-section'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#restoration-business-name {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

.value.name-request {
  width: 100%;
  min-width: 24rem;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      padding-right: 2rem;
      width: 12rem;
    }
  }
}

header p {
  padding-top:0.5rem
}
</style>
