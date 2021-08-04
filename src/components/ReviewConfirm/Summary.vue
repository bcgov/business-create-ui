<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" :showErrorSummary="!step2Valid" />

    <!-- Company summary components -->
    <template v-if="isBaseCompany">
      <ListShareClass :shareClasses="shareClasses" :isSummary="true" :showErrorSummary="!step3Valid" />
      <AgreementType :isSummary="true" :showErrorSummary="!step4Valid" />
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
import { Getter, State } from 'vuex-class'

// Components
import { AgreementType } from '@/components/IncorporationAgreement'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'
import { SummaryDefineCompany } from '@/components/Summary'
import { UploadMemorandum } from '@/components/CreateMemorandum'
import { UploadRules } from '@/components/CreateRules'

// Interfaces
import { OrgPersonIF, ShareClassIF } from '@/interfaces'

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
  // Global state
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  @State(state => state.stateModel.addPeopleAndRoleStep.valid)
  readonly step2Valid: boolean

  @State(state => state.stateModel.createShareStructureStep.valid)
  readonly step3Valid: boolean

  @State(state => state.stateModel.incorporationAgreementStep.valid)
  readonly step4Valid: boolean

  // Global Getters
  @Getter isBaseCompany!: boolean
}
</script>

<style lang="scss" scoped>
.summary-container {
  margin-top: 1rem;
}
</style>
