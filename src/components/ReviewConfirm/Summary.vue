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
      <UploadRules class="mt-4" :isSummary="true" />
      <UploadMemorandum class="mt-4" :isSummary="true" />
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
import { UploadRules } from '@/components/CreateRules'

// Interfaces
import { IncorporationAgreementIF, PeopleAndRoleIF, ShareStructureIF } from '@/interfaces'

@Component({
  components: {
    AgreementType,
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany,
    UploadMemorandum,
    UploadRules
  }
})
export default class Summary extends Vue {
  @Getter isBaseCompany!: boolean
  @Getter isTypeCoop: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getCreateShareStructureStep!: ShareStructureIF
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF
}
</script>

<style lang="scss" scoped>
.summary-container {
  margin-top: 1rem;
}
</style>
