<template>
  <div id="define-registration-summary">
    <section :class="{ 'invalid-section': !defineBusinessValid }">
      <div v-if="!defineBusinessValid" class="define-registration-step-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.REGISTRATION_DEFINE_BUSINESS}` }"
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
            <div id="company-name">{{ getNameRequestApprovedName || 'Unavailable' }}</div>
            <div id="company-description">{{ entityDescription }}</div>
          </v-col>
        </v-row>
      </article>

      <v-divider class="mx-6" />

      <!-- Nature of Business -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Nature of Business</label>
          </v-col>
          <v-col cols="12" sm="9">
            <span>{{ natureOfBusiness || '(Not entered)' }}</span>
          </v-col>
        </v-row>
      </article>

      <v-divider class="mx-6" />

      <!-- Business Addresses -->
      <article class="section-container">
        <BusinessAddresses
          :isEditing="false"
          :showErrors="false"
        />
      </article>

      <v-divider class="mx-6" />

      <!-- Business Contact Information -->
      <article class="section-container">
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="false"
        />
      </article>

      <v-divider class="mx-6" />

      <!-- Business Start Date -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Business Start Date</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div>{{ businessStartDate || '(Not entered)' }}</div>
          </v-col>
        </v-row>
      </article>

      <!-- Folio or Reference Number -->
      <template v-if="isPremiumAccount">
        <!-- DISABLED PER TICKET # 12306 -->
        <!-- <v-divider class="mx-6" />

        <article class="section-container">
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="false"
          />
        </article> -->
      </template>

      <v-divider class="mx-6" />

      <!-- Business Number -->
      <article class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Business Number</label>
          </v-col>
          <v-col cols="12" sm="9">
            <span>{{ businessNumber || '(Not entered)' }}</span>
          </v-col>
        </v-row>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ContactPointIF, RegistrationStateIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import BusinessAddresses from '@/components/Registration/BusinessAddresses.vue'
import { DateMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    BusinessAddresses,
    BusinessContactInfo,
    FolioNumber
  }
})
export default class DefineRegistrationSummary extends Mixins(DateMixin) {
  // Getters
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isTypePartnership: boolean

  /** The entity description. */
  get entityDescription (): string {
    return GetCorpFullDescription(this.getEntityType)
  }

  /** The business valid flag. */
  get defineBusinessValid (): boolean {
    return this.getRegistration.defineBusinessValid
  }

  /** The nature of business (code + desc). */
  get natureOfBusiness (): string {
    const naicsCode = this.getRegistration.naics.naicsCode
    const naicsDescription = this.getRegistration.naics.naicsDescription
    if (naicsCode && naicsDescription) {
      return `${naicsCode} - ${naicsDescription}`
    }
    return null
  }

  /** The business number. */
  get businessNumber (): string {
    return this.getRegistration.businessNumber
  }

  /** The business start date. */
  get businessStartDate (): string {
    return this.yyyyMmDdToPacificDate(this.getRegistration.startDate, true)
  }

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.define-registration-step-error-message {
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
