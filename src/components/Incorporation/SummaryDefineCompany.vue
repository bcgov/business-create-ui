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
            :to="{ path: `/${RouteNames.INCORPORATION_DEFINE_COMPANY}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <div class="section-container">
        <v-row no-gutters>
          <v-col md="3" class="mr-n1">
            <label>Name</label>
          </v-col>
          <v-col md="9">
            <div class="company-name">{{ getApprovedName || '[Incorporation Number] B.C. Ltd.' }}</div>
            <div class="company-type">
              <span>{{ entityDescription }}</span>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
          <v-col md="3" class="mr-n1">
            <label>Name Translation</label>
          </v-col>
          <v-col md="9">
            <div v-for="(nameTranslation, index) in getNameTranslations" :key="`name_translation_${index}`">
              {{ nameTranslation.name }}
            </div>
          </v-col>
        </v-row>
      </div>
      <v-divider/>
      <div v-if="isTypeCoop" class="section-container">
        <v-row no-gutters>
          <v-col md="3" class="mr-n1">
            <label>Type</label>
          </v-col>
          <v-col md="9">
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
        <FolioNumber :initialValue="getFolioNumber" :isEditing="false" />
      </div>
    </section>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { EntityFilterMixin, EnumMixin } from '@/mixins'
import { CoopType, RouteNames } from '@/enums'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    OfficeAddresses
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
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getFolioNumber!: string

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
  padding: 1.5rem
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
  font-size: $px-22;
  font-weight: bold
}

.company-type{
  padding-top: 0.5rem
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
