<template>
  <div id="define-dissolution">
    <v-card outlined class="message-box mt-10">
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve <strong>{{ entityName }}</strong>.
        Once this process is completed and the required documents are filed, the Cooperative Association is struck from
        the register and dissolved, ceasing to be an incorporated cooperative under the Cooperative Association Act. All
        assets and liabilities must be addressed prior to filing.
      </p>
    </v-card>

    <section class="mt-10">
      <header id="association-details">
        <h2>1. Association Details</h2>
      </header>
      <AssociationDetails class="mt-5"/>
    </section>

    <section class="mt-10" v-if="isTypeCoop">
      <header id="dissolution-statement">
        <h2>2. Dissolution Statement</h2>
        <p class="mt-4">Choose a dissolution statement regarding dissolution and
          the Cooperative Association's assets and liabilities:
        </p>
      </header>
      <DissolutionStatement class="mt-5"
        :showErrorSummary="showDissolutionStatementErrors"
      />
    </section>

    <section class="mt-10">
      <header id="custodian-header">
        <h2>{{isTypeCoop ? 3 : 2 }}. {{ getCustodialRecordsResources.custodianTitle }}</h2>
        <p class="mt-4">{{getCustodialRecordsResources.sectionSubtitle}}</p>
      </header>

      <!-- Help Section -->
      <HelpSection
        :helpSection="getCustodialRecordsResources.helpSection"
        :helpTitle="getCustodialRecordsResources.custodianTitle"
      />

      <CustodianOfRecords
        class="mt-5"
        :showErrors="getShowErrors && !isCustodianValid"
        @valid="setCustodianValidity($event)"
      />
    </section>

    <section class="mt-10">
      <header id="delete-certificates">
        <h2>{{isTypeCoop ? 4 : 3 }}. Delete and/or Destroy Certificates</h2>
      </header>
      <!-- Component goes here -->
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { HelpSection } from '@/components/common'
import {
  AssociationDetails,
  CareAndCustodySelect,
  DissolutionStatement,
  CustodianOfRecords
} from '@/components/DefineDissolution'
import { ActionBindingIF, DissolutionStatementIF } from '@/interfaces'
import { CommonMixin, EntityFilterMixin, EnumMixin } from '@/mixins'
import { RouteNames } from '@/enums'

@Component({
  components: {
    AssociationDetails,
    CareAndCustodySelect,
    DissolutionStatement,
    HelpSection,
    CustodianOfRecords
  }
})
export default class DefineDissolution extends Mixins(CommonMixin, EntityFilterMixin, EnumMixin) {
  // Global getters
  @Getter getBusinessLegalName!: string
  @Getter getCustodialRecordsResources!: any // TODO: Update to Custodial Resource IF
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getShowErrors!: boolean
  @Getter isCustodianValid!: boolean
  @Getter isTypeCoop: boolean

  // Global actions
  @Action setCustodianValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** The entity name. */
  private get entityName (): string {
    return this.getBusinessLegalName || `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  private get showDissolutionStatementErrors (): boolean {
    return this.getShowErrors &&
      (this.isTypeCoop && this.getDissolutionStatementStep && !this.getDissolutionStatementStep.valid)
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DEFINE_DISSOLUTION) {
      // Scroll to invalid components.
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          isStatementValid: this.isTypeCoop ? this.getDissolutionStatementStep.valid : true,
          isCustodianValid: this.isCustodianValid
        },
        [
          'dissolution-statement',
          'custodian-header'
        ]
      )
    }
  }
}
</script>
