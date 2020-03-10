<template>
  <div class="summary-container">
    <SummaryDefineCompany />
    <ListPeopleAndRoles v-if="orgPersonList.length > 0" :personList="orgPersonList" :isSummary="true"/>
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
}
</script>

<style lang="scss">
.summary-container {
  margin-top: 1rem;
}
</style>
