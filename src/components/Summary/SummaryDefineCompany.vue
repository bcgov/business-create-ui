<template>
  <v-card flat class="rounded-0">
    <div class="define-company-header review-header">
      <v-icon color="appDkBlue">mdi-domain</v-icon>
      <label class="define-company-title pl-2"><strong>Your {{ getCompanyDisplayName }}</strong></label>
    </div>

    <section :class="{ 'invalid-section': !isDefineCompanyValid }">
      <div v-if="!isDefineCompanyValid" class="defineCompanyStepErrorMessage">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            :to="{ path: `/${RouteNames.DEFINE_COMPANY}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <div class="section-container">
        <v-row no-gutters>
          <v-col md="4">
            <label class="ml-n3">Name</label>
          </v-col>
          <v-col md="8">
            <div class="company-name">{{ getApprovedName || '[Incorporation Number] B.C. Ltd.' }}</div>
            <div class="company-type">
              <span>{{ entityDescription }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
          <v-col md="4">
            <label class="ml-n3">Name Translation</label>
          </v-col>
          <v-col md="8">
            <div v-for="(nameTranslation, index) in getNameTranslations" :key="`name_translation_${index}`">
              {{ nameTranslation.name }}
            </div>
          </v-col>
        </v-row>
      </div>
      <v-divider/>
      <div v-if="isTypeCoop" class="section-container">
        <v-row no-gutters>
          <v-col md="4">
            <label class="ml-n3">Type</label>
          </v-col>
          <v-col md="8">
            <div class="cooperative-type ml-n1">
              <span>{{ getCooperativeType ? coopTypeToDescription(getCooperativeType) : '(Not Entered)' }}</span>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-divider />

      <div class="section-container">
        <OfficeAddresses :inputAddresses="getDefineCompanyStep.officeAddresses" :isEditing="false" />
      </div>

      <v-divider />

      <div class="section-container">
        <BusinessContactInfo :initialValue="getBusinessContact" :isEditing="false" />
      </div>
      <div class="section-container" v-if="isPremiumAccount">
        <FolioNumber :initialValue="getDefineCompanyStep.folioNumber" :isEditing="false" />
      </div>
    </section>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { BusinessContactIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'

// Components
import { FolioNumber, BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'

// Mixins
import { EntityFilterMixin, EnumMixin } from '@/mixins'

// Enums
import { CoopType, RouteNames } from '@/enums'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses,
    FolioNumber
  }
})
export default class SummaryDefineCompany extends Mixins(EntityFilterMixin, EnumMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getCompanyDisplayName!: string
  @Getter getCooperativeType!: CoopType
  @Getter isDefineCompanyValid!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getValidateSteps!: boolean
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getBusinessContact!: BusinessContactIF

  /** The entity description  */
  private get entityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
  }

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

.section-container {
  padding-left: 2rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.define-company-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .define-company-title {
    color: $gray9;
  }
}

.company-name {
  font-size: 1.375rem;
  font-weight: bold
}

.company-type{
  padding-top: 0.5rem
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
