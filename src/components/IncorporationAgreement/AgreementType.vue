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
        <div v-else class="summary-desc">{{ selectedAgreementDescription }}</div>
      </v-card>
    </div>
    <div v-else style="margin-left:1rem;">
      <v-radio-group v-model="agreementType" @change="changeAgreementType">
        <v-radio v-for="(item, index) in incorporationAgreementTypes" :key="index" :value="item.code">
          <template slot="label">
            <div v-html="item.desc"/>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF } from '@/interfaces'

@Component
export default class AgreementType extends Vue {
   incorporationAgreementTypes = [
     {
       code: 'sample',
       desc: 'The <b>Sample Incorporation Agreement and Benefit Company Articles</b> containing a benefit ' +
                'provision have been completed and a copy added to the company\'s record book.',
       summaryDesc: 'The Sample Incorporation Agreement and Benefit Company Articles containing a benefit ' +
                'provision have been completed and a copy added to the company\'s record book.'
     },
     {
       code: 'custom',
       desc: 'A <b>custom Incorporation Agreement and custom Benefit Company Articles</b> containing ' +
              'a benefit provision have been completed and a copy added to the company\'s record book.',
       summaryDesc: 'A custom Incorporation Agreement and custom Benefit Company Articles containing ' +
              'a benefit provision have been completed and a copy added to the company\'s record book.'
     }
   ]

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
      return this.incorporationAgreementTypes.find(item => item.code === this.agreementTypeState).summaryDesc
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
}
</style>
