<template>
  <v-card flat id="agreement-summary review-header" class="rounded-0">
    <div class="mt-4" v-if="isSummary">
      <!-- Summary Header -->
      <div class="agreement-summary-header">
        <v-icon color="appDkBlue">mdi-handshake</v-icon>
        <label class="agreement-summary-title">
          <strong>Incorporation Agreement and {{getEntityDescription}} Articles</strong>
        </label>
      </div>

      <!-- Summary Warning -->
      <div
        v-if="showErrorSummary"
        class="agreement-invalid-message invalid-section"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            id="router-link"
            :to="{ path: `/${RouteNames.INCORPORATION_AGREEMENT}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <!-- Summary Content -->
      <div v-else class="summary-desc">
        <div><v-icon color="green darken-2" class="agreement-valid-icon">mdi-check</v-icon></div>
          <div v-html="agreementTypeDescription"></div>
      </div>
    </div>

    <div v-else-if="isTypeCCC">
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
          <div v-html="item.description" class="agreement-option" />
        </template>
      </v-checkbox>
    </div>

    <div v-else :class="{ 'invalid-section': showErrorSummary }">
      <v-radio-group v-model="agreementType" @change="changeAgreementType" class="agreement-option-list">
        <v-radio v-for="(item, index) in getIncorporationAgreementDocuments"
                  :key="index" :value="item.code" :id="`agreement-type-${item.code}`"
        >
          <template slot="label">
            <div v-html="item.description" class="agreement-option" />
          </template>
        </v-radio>
      </v-radio-group>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, IncorporationAgreementIF, IncorporationAgreementTypeIF } from '@/interfaces'
import { CorpTypeCd, RouteNames } from '@/enums'
import { EnumMixin } from '@/mixins'

@Component
export default class AgreementType extends Mixins(EnumMixin) {
  @Prop({ default: false })
  readonly showErrorSummary: boolean

  @Prop({ default: false })
  readonly isSummary: boolean

  @Getter getIncorporationAgreementDocuments!: Array<IncorporationAgreementTypeIF>
  @Getter getEntityType!: CorpTypeCd
  @Getter isTypeCCC!: boolean
  @Getter getIncorporationAgreementStep!: IncorporationAgreementIF

  @Action setIncorporationAgreementStepData!: ActionBindingIF

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

  /** Called when component is created. */
  created (): void {
    this.agreementType = this.getIncorporationAgreementStep.agreementType
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
  color: $app-red;
}

.summary-desc {
  padding: 1rem;
  font-size: $px-14;
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
