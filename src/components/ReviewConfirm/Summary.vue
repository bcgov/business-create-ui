<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" :showErrorSummary="!step2Valid" />
    <ListShareClass :shareClasses="shareClasses" :isSummary="true" :showErrorSummary="!step3Valid"/>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Components
import { SummaryDefineCompany } from '@/components/Summary'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'
import { ListShareClass } from '@/components/CreateShareStructure'

// Interfaces
import { OrgPersonIF, ShareClassIF } from '@/interfaces'

@Component({
  components: {
    ListShareClass,
    ListPeopleAndRoles,
    SummaryDefineCompany
  }
})
export default class Summary extends Vue {
  // State
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.createShareStructureStep.shareClasses)
  readonly shareClasses: ShareClassIF[]

  @State(state => state.stateModel.addPeopleAndRoleStep.valid)
  readonly step2Valid: boolean

  @State(state => state.stateModel.createShareStructureStep.valid)
  readonly step3Valid: boolean
}
</script>

<style lang="scss" scoped>
.summary-container {
  margin-top: 1rem;
}
</style>
