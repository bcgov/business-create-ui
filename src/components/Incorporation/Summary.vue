<template>
  <div id="incorporation-summary">
    <v-card flat>
      <header class="v-card-header rounded-t">
        <v-icon color="appDkBlue">mdi-domain</v-icon>
        <label class="v-card-label pl-2"><strong>Your {{ getCompanyDisplayName }}</strong></label>
      </header>
      <SummaryDefineCompany />
    </v-card>

    <!-- People and Roles -->
    <v-card flat class="mt-10">
      <header class="v-card-header rounded-t">
        <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
        <label class="v-card-label pl-2">People and Roles</label>
      </header>
      <ListPeopleAndRoles :isSummary="true" />
    </v-card>

    <!-- Share Structure -->
    <template v-if="isBaseCompany">
      <v-card flat class="mt-10">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-sitemap</v-icon>
          <label class="v-card-label pl-2">Share Structure</label>
        </header>
        <ListShareClass
          :isSummary="true"
          :shareClasses="getCreateShareStructureStep.shareClasses"
          :showErrorSummary="!getCreateShareStructureStep.valid"
        />
      </v-card>
    </template>

    <!-- Agreement Type -->
    <template v-if="isBaseCompany">
      <v-card flat class="mt-10">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-handshake</v-icon>
          <label class="v-card-label pl-2">
            Incorporation Agreement and {{getEntityDescription}} Articles
          </label>
        </header>
        <AgreementType
          :isSummary="true"
          :showErrorSummary="!getIncorporationAgreementStep.valid"
        />
      </v-card>
    </template>

    <!-- Rules -->
    <template v-if="isTypeCoop">
      <v-card flat class="mt-10">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
          <label class="v-card-label pl-2">Rules</label>
        </header>
        <UploadRulesSummary />
      </v-card>
    </template>

    <!-- Memorandum -->
    <template v-if="isTypeCoop">
      <v-card flat class="mt-10">
        <header class="v-card-header rounded-t">
          <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
          <label class="v-card-label pl-2">Memorandum</label>
        </header>
        <UploadMemorandumSummary />
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import AgreementType from '@/components/common/AgreementType.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/Incorporation/ListShareClass.vue'
import SummaryDefineCompany from '@/components/Incorporation/SummaryDefineCompany.vue'
import UploadMemorandumSummary from '@/components/Incorporation/UploadMemorandumSummary.vue'
import UploadRulesSummary from '@/components/Incorporation/UploadRulesSummary.vue'
import { IncorporationAgreementIF, ShareStructureIF } from '@/interfaces'
import { EnumMixin } from '@/mixins'
import { CorpTypeCd } from '@/enums'

@Component({
  components: {
    AgreementType,
    ListPeopleAndRoles,
    ListShareClass,
    SummaryDefineCompany,
    UploadMemorandumSummary,
    UploadRulesSummary
  }
})
export default class Summary extends Mixins(EnumMixin) {
  @Getter isBaseCompany!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getCompanyDisplayName!: string
  @Getter getEntityType!: CorpTypeCd

  /** The entity description,  */
  get getEntityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-card-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .v-card-label {
    font-weight: bold;
    color: $gray9;
  }
}
</style>
