<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles
      :personList="getAddPeopleAndRoleStep.orgPeople"
      :isSummary="true"
      :showErrorSummary="!getAddPeopleAndRoleStep.valid"
    />

    <!-- Company summary components -->
    <template v-if="isBaseCompany">
      <ListShareClass
        :shareClasses="getCreateShareStructureStep.shareClasses"
        :isSummary="true"
        :showErrorSummary="!getCreateShareStructureStep.valid"
      />
      <AgreementType
        :isSummary="true"
        :showErrorSummary="!getIncorporationAgreementStep.valid"
      />
    </template>

    <!-- Coops summary components -->
    <template v-else>
      <UploadRulesSummary />
      <UploadMemorandum :isSummary="true" />
    </template>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Components
import { AgreementType } from '@/components/IncorporationAgreement'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { SummaryDefineCompany } from '@/components/Summary'
import { UploadMemorandum } from '@/components/CreateMemorandum'
import { UploadRulesSummary } from '@/components/CreateRules'

// Interfaces
import { IncorporationAgreementIF, PeopleAndRoleIF, ShareStructureIF, CreateRulesIF } from '@/interfaces'

@Component({
  components: {
    AgreementType,
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    UploadMemorandum,
    UploadRulesSummary
  }
})
export default class Summary extends Vue {
  @Getter isBaseCompany!: boolean
  @Getter isTypeCoop: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
  @Getter getCreateRulesStep!: CreateRulesIF
}
</script>

<style lang="scss" scoped>
.summary-container {
  margin-top: 1rem;

  ::v-deep .v-card {
    margin-top: 30px !important;
    border-radius: 0px !important;

    .review-header {
      border-radius: 4px 4px 0px 0px !important;
    }
  }
}
</style>
