<template>
  <div>
    <div id="agreement-summary" v-if="isSummary">
      <v-card flat>
        <!-- Summary Header -->
        <div class="agreement-summary-header">
            <v-icon>mdi-handshake</v-icon>
            <label class="agreement-summary-title"><strong>Incorporation Agreement and Benefit </strong></label>
        </div>

        <!-- Summary Warning -->
        <div v-if="showErrorSummary" class="agreement-invalid-message">
            <span>
            <v-icon color="#1976d2">mdi-information-outline</v-icon>
            This step is not complete.
            <router-link id="router-link" :to="{ path: '/incorporation-agreement' }">
                Return to this step to complete it.
            </router-link>
            </span>
        </div>
        <!-- Summary Content -->
        <div v-else class="summary-desc">
            <div><v-icon color="green" class="agreement-valid-icon">mdi-check</v-icon></div>
             <div>
                {{ selectedAgreementDescription }}
            </div>
        </div>
      </v-card>
    </div>
    <div v-else style="margin-left:1rem;">
      <v-card flat>
        <v-radio-group v-model="agreementType" @change="changeAgreementType" class="agreement-option-list">
          <v-radio v-for="(item, index) in incorporationAgreementTypes"
           :key="index" :value="item.code" :id="`agreement-type-${item.code}`">
            <template slot="label">
              <div v-html="item.description" class="agreement-option"/>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF } from '@/interfaces'
import { AgreementTypeResource } from '@/resources'

@Component
export default class AgreementType extends Vue {
   private incorporationAgreementTypes = AgreementTypeResource

  // State
  @State(state => state.stateModel.incorporationAgreementStep.agreementType)
  readonly agreementTypeState: string | null

  @Prop({ default: false })
  private showErrorSummary: boolean

  @Prop({ default: false })
  private isSummary: boolean

  // Actions
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  private agreementType: string | null = null

  // Lifecycle methods
  private created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)
    this.agreementType = this.agreementTypeState
    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  mounted (): void {
    this.setIncorporationAgreementStepData({
      valid: !!this.agreementType,
      agreementType: this.agreementType
    })
  }

  private changeAgreementType (): void {
    this.setIncorporationAgreementStepData({
      valid: !!this.agreementType,
      agreementType: this.agreementType
    })
  }

  private get selectedAgreementDescription () : string {
    if (this.agreementTypeState) {
      return this.incorporationAgreementTypes.find(item => item.code === this.agreementTypeState)
        .summaryDescription
    } else { return '' }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.agreement-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .agreement-summary-title {
    padding-left: .5rem;
  }
}

.agreement-invalid-message {
  padding: 1.25rem;
  font-weight: bold;
  color: $BCgovABlue2;
}

#agreement-summary {
    margin-top: 1rem;
}

.summary-desc {
    padding: 1rem;
    font-size: 0.875rem;
    display: flex;
    justify-content: center;
}

.agreement-valid-icon {
    padding-right: 0.5rem;
}

.agreement-option-list {
  padding: 1.5rem;
}

.agreement-option {
  padding-top: 1rem;
  color: #495057;
}
</style>
