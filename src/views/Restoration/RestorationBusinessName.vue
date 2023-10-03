<template>
  <div id="restoration-business-name">
    <!-- Business Name and Name Translations -->
    <section
      id="name-section"
      class="mt-10"
    >
      <header>
        <h2>Name</h2>
        <p>
          Add a Name Request that is reserved for this restoration application or restore
          as a numbered company.
        </p>
      </header>
      <v-card
        flat
        class="mt-5"
      >
        <BusinessName id="business-name" />
        <BusinessType
          id="business-type"
          class="mt-n8"
        />
        <NameTranslations
          id="name-translations"
          class="mt-n8"
        />
      </v-card>
    </section>

    <!-- Restoration Type and Approval Type -->
    <section
      id="restoration-type-section"
      class="mt-10"
    >
      <header>
        <h2>Restoration Type</h2>
        <p>Determine the restoration and approval type.</p>
      </header>
      <v-card
        flat
        class="mt-5"
      >
        <RestorationType
          id="restoration-type"
          class="mb-n5"
          :class="{ 'approval-restoration-invalid-section': invalidSectionRestoration }"
        />

        <!-- Divider b/w Restoration and Approval type -->
        <v-divider class="mb-11 mr-5 ml-5"></v-divider>

        <ApprovalType
          id="approval-type"
          class="mt-n10"
          :class="{ 'approval-restoration-invalid-section': invalidSectionApproval }"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
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
  }
})
export default class RestorationBusinessName extends Mixins(CommonMixin) {
  @Getter(useStore) getApprovalTypeValid!: boolean
  @Getter(useStore) getBusinessNameValid!: boolean
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getRestorationTypeValid!: boolean
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

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

  /** This section's validity state for Restoration and Approval (when prompted by app). */
  get invalidSectionApproval (): boolean {
    return (this.getShowErrors && !this.getApprovalTypeValid)
  }

  get invalidSectionRestoration (): boolean {
    return (this.getShowErrors && !this.getRestorationTypeValid)
  }

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.RESTORATION_BUSINESS_NAME) {
      // scroll to invalid components
      await this.$nextTick()
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

/* Invalid Section border for Approval and Restoration Type */
.approval-restoration-invalid-section{
  box-shadow: inset 3px 0 0 $app-red;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
