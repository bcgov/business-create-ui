<template>
  <div id="summary-define-company">
    <section :class="{ 'invalid-section': !isDefineCompanyValid }">
      <div v-if="!isDefineCompanyValid" class="defineCompanyStepErrorMessage">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.INCORPORATION_DEFINE_COMPANY}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <!-- Name -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Name</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div class="company-name">{{ getApprovedName || '[Incorporation Number] B.C. Ltd.' }}</div>
            <div class="company-type">
              <span>{{ entityDescription }}</span>
            </div>
          </v-col>
        </v-row>

        <!-- Name Translation -->
        <v-row no-gutters v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
          <v-col cols="12" sm="3" class="pr-4">
            <label>Name Translation</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div v-for="(nameTranslation, index) in getNameTranslations" :key="`name_translation_${index}`">
              {{ nameTranslation.name }}
            </div>
          </v-col>
        </v-row>
      </article>

      <!-- Type -->
      <template v-if="isTypeCoop">
        <v-divider class="mx-6" />

        <article class="section-container">
          <v-row no-gutters>
            <v-col cols="12" sm="3" class="pr-4">
              <label>Type</label>
            </v-col>
            <v-col cols="12" sm="9">
              <div class="cooperative-type ml-n1">
                <span>{{ getCooperativeType ? coopTypeToDescription(getCooperativeType) : '(Not Entered)' }}</span>
              </div>
            </v-col>
          </v-row>
        </article>
      </template>

      <v-divider class="mx-6" />

      <!-- Registered Office / Records Office -->
      <article class="section-container">
        <OfficeAddresses
          :inputAddresses="getDefineCompanyStep.officeAddresses"
          :isEditing="false"
        />
      </article>

      <v-divider class="mx-6" />

      <!-- Registered Office Contact Information -->
      <article class="section-container">
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="false"
        />
      </article>

      <!-- Folio or Reference Number -->
      <template v-if="isPremiumAccount">
        <v-divider class="mx-6" />

        <article class="section-container">
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="false"
          />
        </article>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { EnumMixin } from '@/mixins'
import { CoopType, CorpTypeCd, RouteNames } from '@/enums'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    OfficeAddresses
  }
})
export default class SummaryDefineCompany extends Mixins(EnumMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter getCooperativeType!: CoopType
  @Getter isDefineCompanyValid!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getFolioNumber!: string
  @Getter getEntityType!: CorpTypeCd

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
