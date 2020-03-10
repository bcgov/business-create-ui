<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles v-if="orgPersonList.length > 0" :personList="orgPersonList" :isSummary="true"
      :showErrorSummary="!stepValid"/>
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
  readonly stepValid: boolean
}
</script>

<style lang="scss">
.summary-container {
  margin-top: 1rem;
}
</style>
