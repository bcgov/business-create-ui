<template>
  <div>
    <div id="agreement-summary" v-if="isSummary">
      <v-card flat>
        <!-- Summary Header -->
        <div class="agreement-summary-header">
          <v-icon color="dkBlue">mdi-handshake</v-icon>
          <label class="agreement-summary-title">
            <strong>Incorporation Agreement and {{getEntityDescription}} Articles</strong>
          </label>
        </div>
        <!-- Summary Warning -->
        <div
          v-if="showErrorSummary"
          class="agreement-invalid-message"
          :class="{ 'invalid-section': getValidateSteps }"
        >
          <span>
            <v-icon color="error">mdi-information-outline</v-icon>
            &nbsp;
            <span class="error-text">This step is not complete.</span>
            &nbsp;
            <router-link
              id="router-link"
              :to="{ path: `/${RouteNames.INCORPORATION_AGREEMENT}`,
              query: { showErrors: true } }"
            >
              Return to this step to complete it.
            </router-link>
          </span>
        </div>

        <!-- Summary Content -->
        <div v-else class="summary-desc">
          <div><v-icon color="green darken-2" class="agreement-valid-icon">mdi-check</v-icon></div>
            <div v-html="agreementTypeDescription"></div>
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-card flat>
        <template v-if="isTypeCC">
          <v-checkbox
            v-for="(item, index) in getIncorporationAgreementDocuments"
            :id="`agreement-type-${item.code}`"
            class="agreement-option-list"
            :key="index"
            v-model="agreementType"
            :value="item.code"
            @change="changeAgreementType"
          >
            <template slot="label">
              <div v-html="item.description" class="agreement-option"/>
            </template>
          </v-checkbox>
        </template>
        <template v-else>
          <v-radio-group v-model="agreementType" @change="changeAgreementType" class="agreement-option-list">
            <v-radio v-for="(item, index) in getIncorporationAgreementDocuments"
                     :key="index" :value="item.code" :id="`agreement-type-${item.code}`"
            >
              <template slot="label">
                <div v-html="item.description" class="agreement-option"/>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces & enums
import { ActionBindingIF, IncorporationAgreementIF, IncorporationAgreementTypeIF } from '@/interfaces'
import { CorpTypeCd, RouteNames } from '@/enums'

// Modules
import { EnumMixin } from '@/mixins'

@Component
export default class AgreementType extends Mixins(EnumMixin) {
  @Prop({ default: false })
  private readonly showErrorSummary: boolean

  @Prop({ default: false })
  private readonly isSummary: boolean

  @Getter getIncorporationAgreementDocuments!: Array<IncorporationAgreementTypeIF>
  @Getter getEntityType!: CorpTypeCd
  @Getter getValidateSteps!: boolean
  @Getter isTypeCC!: boolean
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF

  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  private agreementType: string = null

  // Enum for template
  readonly RouteNames = RouteNames

  /** The entity description,  */
  private get getEntityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  /** The agreement type description. */
  private get agreementTypeDescription (): string {
    return this.getIncorporationAgreementDocuments
      .find(x => x.code === this.getIncorporationAgreementStep.agreementType)?.description
  }

  // Lifecycle methods
  private created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)
    this.agreementType = this.getIncorporationAgreementStep.agreementType
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
  color: $gray7;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
