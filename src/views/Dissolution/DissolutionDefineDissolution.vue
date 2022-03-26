<template>
  <div id="dissolution-define-dissolution">
    <v-card outlined class="message-box mt-10">
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve <strong>{{ entityName }}</strong>.
        Once this process is completed and the required documents are filed, the
        {{ getCorpTypeDescription(this.getEntityType) }} is struck from the register and dissolved, ceasing to be
        an incorporated {{ entityDesignation }} under the {{ entityAct }}. All assets and liabilities must be addressed
        prior to filing.
      </p>
    </v-card>

    <section class="mt-10">
      <header id="association-details">
        <h2>1. {{ getDissolutionDetailsTitle }}</h2>
      </header>

      <v-card flat class="mt-5">
        <AssociationDetails
        :entityLabel= "isTypeCoop ? 'Cooperative Association' : 'Company'"
      />
      </v-card>
    </section>

    <!-- Dissolution Statement -->
    <section class="mt-10" v-if="isTypeCoop">
      <header id="dissolution-statement-header">
        <h2>2. Dissolution Statement</h2>
        <p class="mt-4">Choose a dissolution statement regarding dissolution and
          the Cooperative Association's assets and liabilities:
        </p>
      </header>

      <v-card flat class="mt-5 py-8 px-6"
        :class="{ 'invalid-section': showDissolutionStatementErrors }"
      >
        <DissolutionStatement />
      </v-card>
    </section>

    <!-- Custodian of Records -->
    <section class="mt-10">
      <header id="custodian-header">
        <h2>{{isTypeCoop ? 3 : 2 }}. {{ getCustodialRecordsResources.custodianTitle }}</h2>
        <p class="mt-4">{{getCustodialRecordsResources.sectionSubtitle}}</p>
      </header>

      <!-- Help Section -->
      <HelpSection
        class="mt-5"
        v-if="getCustodialRecordsResources.helpSection"
        :helpSection="getCustodialRecordsResources.helpSection"
      />

      <v-card flat class="mt-5 py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !isDissolutionCustodianValid }"
      >
        <CustodianOfRecords
          :showErrors="getShowErrors"
          @valid="setCustodianValidity($event)"
        />
      </v-card>
    </section>

    <!-- Delete and/or Destroy Certificates -->
    <section class="mt-10" v-if="isTypeCoop">
      <header id="delete-certificates-header">
        <h2>{{isTypeCoop ? 4 : 3 }}. Delete and/or Destroy Certificates</h2>
        <p class="mt-4">After dissolution, all original certificates of incorporation, name change, or amalgamation
          are not valid and must not be used by the Cooperative Association. Any copies of these documents must
          be deleted and/or destroyed.
        </p>
        <p class="mt-4 delete-certificates-note"><strong>Note:</strong> The Cooperative Association Act requires
          that the application for a voluntary dissolution be accompanied by the Certificate of Incorporation.
          The Certificate of Incorporation is on file for this Cooperative Association.
        </p>
      </header>

      <v-card flat class="mt-5 py-8 px-6"
        :class="{ 'invalid-section': showDestroyCertificateErrors }"
      >
        <DestroyCertificate
          :showErrorSummary="showDestroyCertificateErrors"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
// import CareAndCustodySelect from '@/components/Dissolution/CareAndCustodySelect.vue'
import CustodianOfRecords from '@/components/Dissolution/CustodianOfRecords.vue'
import DestroyCertificate from '@/components/Dissolution/DestroyCertificate.vue'
import DissolutionStatement from '@/components/Dissolution/DissolutionStatement.vue'
import HelpSection from '@/components/common/HelpSection.vue'
import { ActionBindingIF, CustodianResourceIF, DissolutionStatementIF } from '@/interfaces'
import { CommonMixin, EnumMixin } from '@/mixins'
import { CorpTypeCd, RouteNames } from '@/enums'

@Component({
  components: {
    AssociationDetails,
    // CareAndCustodySelect,
    CustodianOfRecords,
    DestroyCertificate,
    DissolutionStatement,
    HelpSection
  }
})
export default class DissolutionDefineDissolution extends Mixins(CommonMixin, EnumMixin) {
  // Global getters
  @Getter getBusinessLegalName!: string
  @Getter getCustodialRecordsResources!: CustodianResourceIF
  @Getter getDissolutionDetailsTitle!: string
  @Getter getDissolutionStatementStep!: DissolutionStatementIF
  @Getter getDissolutionHasCertificateDestroyed!: boolean
  @Getter getShowErrors!: boolean
  @Getter isDissolutionCustodianValid!: boolean
  @Getter isTypeCoop: boolean
  @Getter getEntityType!: CorpTypeCd

  // Global actions
  @Action setCustodianValidity!: ActionBindingIF

  /** The entity name. */
  private get entityName (): string {
    return this.getBusinessLegalName || `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  /** The entity designation. */
  private get entityDesignation (): string {
    return this.isTypeCoop ? 'Cooperative' : 'Company'
  }

  /** The entity act. */
  private get entityAct (): string {
    return this.isTypeCoop ? 'Cooperative Association Act' : 'Business Corporations Act'
  }

  private get showDissolutionStatementErrors (): boolean {
    return this.getShowErrors &&
      (this.isTypeCoop && this.getDissolutionStatementStep && !this.getDissolutionStatementStep.valid)
  }

  private get showDestroyCertificateErrors () {
    return this.getShowErrors && (this.isTypeCoop && !this.getDissolutionHasCertificateDestroyed)
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_DEFINE_DISSOLUTION) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(
        {
          isStatementValid: this.isTypeCoop ? this.getDissolutionStatementStep.valid : true,
          isCustodianValid: this.isDissolutionCustodianValid,
          isDeleteValid: this.isTypeCoop ? this.getDissolutionHasCertificateDestroyed : true
        },
        [
          'dissolution-statement-header',
          'custodian-header',
          'delete-certificates-header'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.delete-certificates-note {
  font-size: $px-14;
}
</style>
