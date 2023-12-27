<template>
  <div id="summary-define-company">
    <section :class="{ 'invalid-section': invalidSection }">
      <div
        v-if="invalidSection"
        class="defineCompanyStepErrorMessage"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>

          <template v-if="isAmalgamationFilingRegular">
            <router-link
              v-if="!isAmalgamationInformationValid"
              :to="{ path: `/${RouteNames.AMALG_REG_INFORMATION}` }"
            >Return to this step to finish it</router-link>
            <router-link
              v-else-if="!isDefineCompanyValid"
              :to="{ path: `/${RouteNames.AMALG_REG_BUSINESS_INFO}` }"
            >Return to this step to finish it</router-link>
          </template>

          <template v-if="isAmalgamationFilingHorizontal || isAmalgamationFilingVertical">
            <router-link
              v-if="!isAmalgamationInformationValid"
              :to="{ path: `/${RouteNames.AMALG_SHORT_INFORMATION}` }"
            >Return to this step to finish it</router-link>
            <router-link
              v-else-if="!isDefineCompanyValid"
              :to="{ path: `/${RouteNames.AMALG_SHORT_BUSINESS_INFO}` }"
            >Return to this step to finish it</router-link>
          </template>

          <router-link
            v-if="isContinuationInFiling"
            :to="{ path: `/${RouteNames.CONTINUATION_IN_BUSINESS_BC}` }"
          >Return to this step to finish it</router-link>

          <router-link
            v-if="isAmalgamationFiling"
            :to="{ path: `/${RouteNames.AMALG_REG_INFORMATION}` }"
          >Return to this step to finish it</router-link>
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

      <!-- Amalgamation Type -->
      <template v-if="isAmalgamationFiling">
        <article class="section-container pb-0">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
              class="pr-4"
            >
              <label id="amalgamation-type-label">Amalgamation Type</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
              class="pt-4 pt-sm-0"
            >
              <div id="amalgamation-type">
                {{ amalgamationType || '[Unknown]' }}
              </div>
            </v-col>
          </v-row>
        </article>
      </template>

      <!-- Name -->
      <template v-if="showCompanyName">
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
            class="mt-6"
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

      <!-- Cooperative Type -->
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
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ContactPointIF, DefineCompanyIF, NameTranslationIF } from '@/interfaces'
import BusinessContactInfo from './BusinessContactInfo.vue'
import FolioNumber from './FolioNumber.vue'
import OfficeAddresses from './OfficeAddresses.vue'
import { CoopTypes, RouteNames } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
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
  @Getter(useStore) isAmalgamationInformationRegValid!: boolean
  @Getter(useStore) isAmalgamationFiling!: boolean
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isAmalgamationFilingRegular!: boolean
  @Getter(useStore) isAmalgamationFilingVertical!: boolean
  @Getter(useStore) isAmalgamationInformationValid!: boolean
  @Getter(useStore) isContinuationInFiling!: boolean
  @Getter(useStore) isDefineCompanyValid!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isLimitedRestorationFiling!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isTypeBcCcc!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean
  @Getter(useStore) isTypeCoop!: boolean

  /** Whether this section is invalid. */
  get invalidSection (): boolean {
    if (this.isAmalgamationFiling) {
      // *** FUTURE: update this for short-form amalgamation (needs to be valid)
      return (!this.isAmalgamationInformationValid || !this.isDefineCompanyValid)
    }
    return !this.isDefineCompanyValid
  }

  get amalgamationType (): string {
    if (this.isAmalgamationFilingRegular) return 'Regular'
    if (this.isAmalgamationFilingHorizontal) return 'Horizontal'
    if (this.isAmalgamationFilingVertical) return 'Vertical'
    return null
  }

  /** The company name. */
  get companyName (): string {
    // check if we have a name from a NR
    if (this.getNameRequestApprovedName) return this.getNameRequestApprovedName

    // otherwise name will be created from new incorporation number
    const prefix = '[Incorporation Number]'
    if (this.isTypeBcCcc) return `${prefix} B.C. COMMUNITY CONTRIBUTION COMPANY`
    if (this.isTypeBcUlcCompany) return `${prefix} B.C. UNLIMITED LIABILITY COMPANY`
    return `${prefix} B.C. LTD.`
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
