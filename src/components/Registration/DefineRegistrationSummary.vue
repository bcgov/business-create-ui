<template>
  <v-card flat class="rounded-0">
    <div class="define-registration-header review-header">
      <v-icon color="appDkBlue">mdi-domain</v-icon>
      <label class="define-registration-title pl-2"><strong>Your Business</strong></label>
    </div>

    <section :class="{ 'invalid-section': !defineBusinessValid }">
      <div v-if="!defineBusinessValid" class="define-registration-step-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            :to="{ path: `/${RouteNames.REGISTRATION_DEFINE_BUSINESS}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <!-- Name -->
      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Name</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div class="company-name">{{ getApprovedName || 'Unavailable' }}</div>
            <div class="company-type">
              <span>{{ entityDescription }}</span>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mx-6" />

      <!-- Nature of Business -->
      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Nature of Business</label>
          </v-col>
          <v-col cols="12" sm="9">
            <span>{{ natureOfBusiness || '(Not entered)' }}</span>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mx-6" />

      <!-- Business Addresses -->
      <div class="section-container">
        <BusinessAddresses
          :isEditing="false"
          :showErrors="false"
        />
      </div>

      <v-divider class="mx-6" />

      <!-- Business Contact Info -->
      <div class="section-container">
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="false"
        />
      </div>

      <v-divider class="mx-6" />

      <!-- Business Start Date -->
      <div class="section-container">
        <v-row no-gutters>
          <v-col cols="12" sm="3" class="pr-4">
            <label>Business Start Date</label>
          </v-col>
          <v-col cols="12" sm="9">
            <div>{{ businessStartDate || '(Not entered)' }}</div>
          </v-col>
        </v-row>
      </div>

      <!-- Folio Number -->
      <template v-if="isPremiumAccount">
        <v-divider class="mx-6" />

        <div class="section-container">
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="false"
          />
        </div>
      </template>
    </section>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactIF, RegistrationStateIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import BusinessAddresses from '@/components/Registration/BusinessAddresses.vue'
import { DateMixin, EnumMixin } from '@/mixins'
import { CorpTypeCd, RouteNames } from '@/enums'

@Component({
  components: {
    BusinessAddresses,
    BusinessContactInfo,
    FolioNumber
  }
})
export default class DefineRegistrationSummary extends Mixins(DateMixin, EnumMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter isPremiumAccount!: boolean
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getFolioNumber!: string
  @Getter getRegistration!: RegistrationStateIF
  @Getter getEntityType!: CorpTypeCd

  /** The entity description. */
  get entityDescription (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)}`
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

.define-registration-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .define-registration-title {
    color: $gray9;
  }
}

.company-name {
  font-size: $px-22;
  font-weight: bold;
  color: $gray9;
}

.company-type{
  padding-top: 0.5rem;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
