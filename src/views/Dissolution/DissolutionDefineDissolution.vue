<template>
  <div id="dissolution-define-dissolution">
    <MessageBox
      color="gold"
      class="mt-10"
    >
      <p>
        <strong>Important:</strong> You are about to voluntarily dissolve <strong>{{ entityName }}</strong>.
        Once this process is completed and the required documents are filed, the {{ corpDescription }}
        is struck from the register and dissolved, ceasing to be an incorporated {{ entityDesignation }}
        under the {{ entityAct }}. All assets and liabilities must be addressed prior to filing.
      </p>
    </MessageBox>

    <section class="mt-10">
      <header id="details-title">
        <h2>1. {{ getDetailsTitle }}</h2>
      </header>

      <v-card
        flat
        class="mt-5"
      >
        <AssociationDetails
          :entityLabel="isEntityCoop ? 'Cooperative Association' : 'Company'"
        />
      </v-card>
    </section>

    <!-- Dissolution Statement -->
    <section
      v-if="isEntityCoop"
      class="mt-10"
    >
      <header id="dissolution-statement-header">
        <h2>2. Dissolution Statement</h2>
        <p class="mt-4">
          Choose a dissolution statement regarding dissolution and
          the Cooperative Association's assets and liabilities:
        </p>
      </header>

      <v-card
        flat
        class="mt-5 py-8 px-6"
        :class="{ 'invalid-section': showDissolutionStatementErrors }"
      >
        <DissolutionStatement />
      </v-card>
    </section>

    <!-- Custodian of Records -->
    <section class="mt-10">
      <header id="custodian-header">
        <h2>{{ isEntityCoop ? 3 : 2 }}. {{ getCustodialRecords.custodianTitle }}</h2>
        <p class="mt-4">
          {{ getCustodialRecords.sectionSubtitle }}
        </p>
      </header>

      <!-- Help Section -->
      <HelpSection
        v-if="getCustodialRecords.helpSection"
        class="mt-5"
        :helpSection="getCustodialRecords.helpSection"
      />

      <v-card
        flat
        class="mt-5 py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !isDissolutionCustodianValid }"
      >
        <CustodianOfRecords
          :showErrors="getShowErrors"
          @valid="setCustodianValidity($event)"
        />
      </v-card>
    </section>

    <!-- Delete and/or Destroy Certificates -->
    <section
      v-if="isEntityCoop"
      class="mt-10"
    >
      <header id="delete-certificates-header">
        <h2>{{ isEntityCoop ? 4 : 3 }}. Delete and/or Destroy Certificates</h2>
        <p class="mt-4">
          After dissolution, all original certificates of incorporation, name change, or amalgamation
          are not valid and must not be used by the Cooperative Association. Any copies of these documents must
          be deleted and/or destroyed.
        </p>
        <p class="mt-4 delete-certificates-note">
          <strong>Note:</strong> The Cooperative Association Act requires
          that the application for a voluntary dissolution be accompanied by the Certificate of Incorporation.
          The Certificate of Incorporation is on file for this Cooperative Association.
        </p>
      </header>

      <v-card
        flat
        class="mt-5 py-8 px-6"
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
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
// import CareAndCustodySelect from '@/components/Dissolution/CareAndCustodySelect.vue'
import CustodianOfRecords from '@/components/Dissolution/CustodianOfRecords.vue'
import DestroyCertificate from '@/components/Dissolution/DestroyCertificate.vue'
import DissolutionStatement from '@/components/Dissolution/DissolutionStatement.vue'
import HelpSection from '@/components/common/HelpSection.vue'
import { CustodianResourceIF, DissolutionStatementIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription, GetCorpNumberedDescription }
  from '@bcrs-shared-components/corp-type-module'
import MessageBox from '@/components/common/MessageBox.vue'

@Component({
  components: {
    AssociationDetails,
    // CareAndCustodySelect,
    CustodianOfRecords,
    DestroyCertificate,
    DissolutionStatement,
    HelpSection,
    MessageBox
  }
})
export default class DissolutionDefineDissolution extends Mixins(CommonMixin) {
  // Global getters
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getCustodialRecords!: CustodianResourceIF
  @Getter(useStore) getDetailsTitle!: string
  @Getter(useStore) getDissolutionStatementStep!: DissolutionStatementIF
  @Getter(useStore) getDissolutionHasCertificateDestroyed!: boolean
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isDissolutionCustodianValid!: boolean
  @Getter(useStore) isEntityCoop: boolean

  // Global actions
  @Action(useStore) setCustodianValidity!: (x: boolean) => void

  get corpDescription (): string {
    return GetCorpFullDescription(this.getEntityType as any)
  }

  /** The entity name. */
  get entityName (): string {
    return this.getBusinessLegalName || GetCorpNumberedDescription(this.getEntityType as any)
  }

  /** The entity designation. */
  get entityDesignation (): string {
    return this.isEntityCoop ? 'Cooperative' : 'Company'
  }

  /** The entity act. */
  get entityAct (): string {
    return this.isEntityCoop ? 'Cooperative Association Act' : 'Business Corporations Act'
  }

  get showDissolutionStatementErrors (): boolean {
    return this.getShowErrors &&
      (this.isEntityCoop && this.getDissolutionStatementStep && !this.getDissolutionStatementStep.valid)
  }

  get showDestroyCertificateErrors () {
    return this.getShowErrors && (this.isEntityCoop && !this.getDissolutionHasCertificateDestroyed)
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DISSOLUTION_DEFINE_DISSOLUTION) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(
        {
          isStatementValid: this.isEntityCoop ? this.getDissolutionStatementStep.valid : true,
          isCustodianValid: this.isDissolutionCustodianValid,
          isDeleteValid: this.isEntityCoop ? this.getDissolutionHasCertificateDestroyed : true
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
