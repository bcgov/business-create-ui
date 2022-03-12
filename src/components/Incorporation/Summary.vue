<template>
  <div class="summary-container">
    <SummaryDefineCompany />

    <ListPeopleAndRoles
      class="mt-10"
      :personList="getAddPeopleAndRoleStep.orgPeople"
      :isSummary="true"
      :showErrorSummary="!getAddPeopleAndRoleStep.valid"
    />

    <!-- Company summary components -->
    <template v-if="isBaseCompany">
      <ListShareClass
        class="mt-10"
        :shareClasses="getCreateShareStructureStep.shareClasses"
        :isSummary="true"
        :showErrorSummary="!getCreateShareStructureStep.valid"
      />

      <AgreementType
        class="mt-10"
        :isSummary="true"
        :showErrorSummary="!getIncorporationAgreementStep.valid"
      />
    </template>

    <!-- Coops summary components -->
    <template v-else>
      <UploadRulesSummary
        class="mt-10"
      />

      <UploadMemorandumSummary
        class="mt-10"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import AgreementType from '@/components/common/AgreementType.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ListShareClass from '@/components/Incorporation/ListShareClass.vue'
import SummaryDefineCompany from '@/components/Incorporation/SummaryDefineCompany.vue'
import UploadMemorandumSummary from '@/components/Incorporation/UploadMemorandumSummary.vue'
import UploadRulesSummary from '@/components/Incorporation/UploadRulesSummary.vue'

import {
  IncorporationAgreementIF,
  PeopleAndRoleIF,
  ShareStructureIF,
  CreateRulesIF,
  CreateMemorandumIF
} from '@/interfaces'

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
export default class Summary extends Vue {
  @Getter isBaseCompany!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getCreateRulesStep!: CreateRulesIF
  @Getter getCreateMemorandumStep!: CreateMemorandumIF
}
</script>
