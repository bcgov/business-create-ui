<template>
    <v-card flat>
      <div v-if="!defineCompanyStepValid" class="defineCompanyStepErrorMessage">
         <span>
          <v-icon color="#1976d2">mdi-information-outline</v-icon>
          This step is not complete.
          <router-link :to="{path:'/define-company', query: {showErrors: true}}">
             Return to this step to complete it.
          </router-link>
         </span>
      </div>
      <div class="business-contact-container">
      <BusinessContactForm
      :initialValue = businessContact
      :isEditing = false /></div>
      </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { BusinessContactIF } from '@/interfaces/stepper-interfaces/DefineCompany/business-contact-interface'

// Components
import BusinessContactForm from '@/components/DefineCompany/BusinessContactInfo.vue'

@Component({
  components: {
    BusinessContactForm
  }
})
export default class SummaryDefineCompany extends Vue {
  // State
  @State(state => state.stateModel.defineCompanyStep.defineCompanyStepValid)
  readonly defineCompanyStepValid!: boolean

  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF
}
</script>

<style lang="scss">
.defineCompanyStepErrorMessage {
  padding: 1.25rem;
  font-weight: bold;
  color:#1976d2;
}

.business-contact-container{
  padding-left: 1.25rem;
}
</style>
