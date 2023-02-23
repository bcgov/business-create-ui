<template>
  <div id="restoration-business-name">
    <!-- Business Name and Name Translations -->
    <section id="name-section" class="mt-10">
      <header>
        <h2>Name</h2>
        <p>Add a Name Request that is reserved for this restoration application or restore
          as a numbered company.</p>
        <!-- *** TODO: remove before flight -->
        <!-- <pre>getBusinessNameValid={{ getBusinessNameValid }}</pre> -->
        <!-- <pre>getNameTranslationsValid={{ getNameTranslationsValid }}</pre> -->
        <!-- <pre>getRestorationTypeValid={{ getRestorationTypeValid }}</pre> -->
      </header>
      <v-card flat class="mt-5">
        <BusinessName id="business-name" />
        <BusinessType id="business-type" class="mt-n8" />
        <NameTranslations id="name-translations" class="mt-n8" />
      </v-card>
    </section>

    <!-- Restoration Type and Approval Type -->
    <section id="restoration-type-section" class="mt-10">
      <header>
        <h2>Restoration Type</h2>
        <p>Determine the restoration and approval type.</p>
      </header>
      <v-card flat class="mt-5">
        <RestorationType id="restoration-type" />
        <ApprovalType id="approval-type" class="mt-n8" />
      </v-card>
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
import ApprovalType from '@/components/Restoration/ApprovalType.vue'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import BusinessType from '@/components/Restoration/BusinessType.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'
import RestorationType from '@/components/Restoration/RestorationType.vue'

@Component({
  components: {
    ApprovalType,
    BusinessName,
    BusinessType,
    NameTranslations,
    RestorationType
  },
  mixins: [
    CommonMixin
  ]
})
export default class RestorationBusinessName extends Vue {
  @Getter getApprovalTypeValid!: boolean
  @Getter getBusinessNameValid!: boolean
  @Getter getNameTranslationsValid!: boolean
  @Getter getRestorationTypeValid!: boolean
  @Getter getShowErrors!: boolean

  @Action setIgnoreChanges!: ActionBindingIF

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  /** Array of valid components. Must match validFlags. */
  readonly validComponents = [
    'business-name',
    'name-translations',
    'restoration-type',
    'approval-type'
  ]

  /** Object of valid flags. Must match validComponents. */
  get validFlags (): object {
    return {
      businessName: this.getBusinessNameValid,
      bameTranslation: this.getNameTranslationsValid,
      restorationType: this.getRestorationTypeValid,
      approavalType: this.getApprovalTypeValid
    }
  }

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.RESTORATION_BUSINESS_NAME) {
      // scroll to invalid components
      await Vue.nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
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

header p {
  padding-top: 0.5rem;
}
</style>
