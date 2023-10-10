<template>
  <div id="summary-define-company">
    <section :class="{ 'invalid-section': !isDefineCompanyValid }">
      <div
        v-if="!isDefineCompanyValid"
        class="defineCompanyStepErrorMessage"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            v-if="isIncorporationFiling"
            :to="{ path: `/${RouteNames.INCORPORATION_DEFINE_COMPANY}` }"
          >Return to this step to finish it</router-link>
          <router-link
            v-if="isFullRestorationFiling || isLimitedRestorationFiling"
            id="router-link"
            :to="{ path: `/${RouteNames.RESTORATION_BUSINESS_INFORMATION}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <template v-if="showCompanyName">
        <!-- Name -->
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label id="company-label">Name</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="company-name">
                {{ companyName }}
              </div>
              <div id="company-description">
                {{ entityDescription }}
              </div>
            </v-col>
          </v-row>

          <!-- Name Translation -->
          <v-row
            v-if="getNameTranslations && getNameTranslations.length > 0"
            no-gutters
            class="mt-3"
          >
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Name Translation</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <div
                v-for="(nameTranslation, index) in getNameTranslations"
                :key="`name-translation-${index}`"
                class="text-uppercase"
              >
                {{ nameTranslation.name }}
              </div>
            </v-col>
          </v-row>
        </article>

        <v-divider class="mx-6" />
      </template>

      <!-- Type -->
      <template v-if="isTypeCoop">
        <article class="section-container">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label>Type</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <div class="cooperative-type ml-n1">
                <span>{{ coopDescription }}</span>
              </div>
            </v-col>
          </v-row>
        </article>

        <v-divider class="mx-6" />
      </template>

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
import { Component, Vue } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ContactPointIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { CoopTypes, RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
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
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getCooperativeType!: CoopTypes
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) isDefineCompanyValid!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isLimitedRestorationFiling!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isTypeCoop!: boolean

  /** The company name. */
  get companyName (): string {
    return this.getNameRequestApprovedName || '[Incorporation Number] B.C. LTD.'
  }

  /** The entity description. */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  /** The coop description. */
  get coopDescription (): string {
    return (this.getCooperativeType ? CoopTypeToDescription(this.getCooperativeType) : '(Not Entered)')
  }

  /** Whether to show the company name section. */
  get showCompanyName (): boolean {
    if (this.isFullRestorationFiling || this.isLimitedRestorationFiling) return false
    return true
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
