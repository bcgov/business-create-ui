<template>
  <div id="incorporation-summary">
    <v-card flat>
      <CardHeader icon="mdi-domain" :label="getCompanyDisplayName" />
      <SummaryDefineCompany />
    </v-card>

    <!-- People and Roles -->
    <v-card flat class="mt-10">
      <CardHeader icon="mdi-account-multiple-plus" label="People and Roles" />
      <ListPeopleAndRoles :isSummary="true" />
    </v-card>

    <!-- Share Structure -->
    <template v-if="isBaseCompany">
      <v-card flat class="mt-10">
        <CardHeader icon="mdi-sitemap" label="Share Structure" />
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
        <CardHeader icon="mdi-handshake" :label="`Incorporation Agreement and ${getEntityDescription} Articles`" />
        <AgreementType
          :isSummary="true"
          :showErrorSummary="!getIncorporationAgreementStep.valid"
        />
      </v-card>
    </template>

    <!-- Rules -->
    <template v-if="isTypeCoop">
      <v-card flat class="mt-10">
        <CardHeader icon="mdi-format-list-text" label="Rules" />
        <UploadRulesSummary />
      </v-card>
    </template>

    <!-- Memorandum -->
    <template v-if="isTypeCoop">
      <v-card flat class="mt-10">
        <CardHeader icon="mdi-text-box-multiple" label="Memorandum" />
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
import CardHeader from '@/components/common/CardHeader.vue'
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
    CardHeader,
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
