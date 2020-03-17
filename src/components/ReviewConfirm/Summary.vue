<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles :personList="orgPersonList" :isSummary="true" :showErrorSummary="!step2Valid"/>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Components
import { SummaryDefineCompany } from '@/components/Summary'
import { ListPeopleAndRoles } from '@/components/AddPeopleAndRoles'

// Interfaces
import { OrgPersonIF } from '@/interfaces'

@Component({
  components: {
    ListPeopleAndRoles,
    SummaryDefineCompany
  }
})
export default class Summary extends Vue {
  // State
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @State(state => state.stateModel.addPeopleAndRoleStep.valid)
  readonly step2Valid: boolean
}
</script>

<style lang="scss">
.summary-container {
  margin-top: 1rem;
}
</style>
