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
            <label id="company-label">Name</label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <div id="company-name">{{ getNameRequestApprovedName || '[Incorporation Number] B.C. Ltd.' }}</div>
            <div id="company-description">{{ entityDescription }}</div>
          </v-col>
        </v-row>

        <!-- Name Translation -->
        <v-row no-gutters v-if="getNameTranslations && getNameTranslations.length" class="mt-3">
          <v-col cols="12" sm="3" class="pr-4">
            <label>Name Translation</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div
              v-for="(nameTranslation, index) in getNameTranslations"
              class="text-uppercase"
              :key="`name_translation_${index}`"
            >
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
                <span>{{ coopDescription }}</span>
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
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { ContactPointIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { CoopTypes, CorpTypeCd, RouteNames } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CoopTypeToDescription } from '@/utils'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    OfficeAddresses
  }
})
export default class SummaryDefineCompany extends Vue {
  // for template
  readonly RouteNames = RouteNames

  // Getters
  @Getter getNameRequestApprovedName!: string
  @Getter getCooperativeType!: CoopTypes
  @Getter isDefineCompanyValid!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getBusinessContact!: ContactPointIF
  @Getter getFolioNumber!: string
  @Getter getEntityType!: CorpTypeCd

  /** The entity description. */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  /** The coop description. */
  get coopDescription (): string {
    return (this.getCooperativeType ? CoopTypeToDescription(this.getCooperativeType) : '(Not Entered)')
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

#company-name {
  font-size: $px-22;
  font-weight: bold;
  color: $gray9;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
