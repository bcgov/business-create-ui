<template>
  <v-card flat>
     <div class="define-company-header">
        <v-icon>mdi-domain</v-icon>
        <label class="define-company-title"><strong>Your Company</strong></label>
    </div>
    <div v-if="!valid" class="defineCompanyStepErrorMessage">
      <span>
        <v-icon color="#1976d2">mdi-information-outline</v-icon>
        This step is not complete.
        <router-link :to="{ path: '/define-company', query: { showErrors: true } }">
          Return to this step to complete it.
        </router-link>
      </span>
    </div>
    <div class="section-container">
      <OfficeAddresses :inputAddresses="addresses" :isEditing="false" />
    </div>
    <v-divider/>
    <div class="section-container">
      <BusinessContactInfo :initialValue="businessContact" :isEditing="false" />
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { BusinessContactIF, IncorporationAddressIf } from '@/interfaces'

// Components
import { BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses
  }
})
export default class SummaryDefineCompany extends Vue {
  // State
  @State(state => state.stateModel.defineCompanyStep.valid)
  readonly valid!: boolean;

  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF;

  @State(state => state.stateModel.defineCompanyStep.officeAddresses)
  readonly addresses!: IncorporationAddressIf;
}
</script>

<style lang="scss">
.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  font-weight: bold;
  color: #1976d2;
}

.section-container {
  padding-left: 2rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.define-company-header {
  display: flex;
  background-color: rgba(1, 51, 102, 0.15);
  padding: 1.25rem;
}

  .define-company-title {
    padding-left: 0.5rem;
    padding-top: 0.2rem
  }

</style>
