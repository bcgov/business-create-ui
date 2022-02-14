<template>
  <v-card flat class="rounded-0">
    <div class="define-registration-header review-header">
      <v-icon color="appDkBlue">mdi-domain</v-icon>
      <label class="define-registration-title pl-2"><strong>Your Business</strong></label>
    </div>

    <section :class="{ 'invalid-section': !isDefineRegistrationValid }">
      <div v-if="!isDefineRegistrationValid" class="define-registration-step-error-message">
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

      <div class="section-container">
        <v-row no-gutters>
          <v-col md="3" class="mr-n1">
            <label>Name</label>
          </v-col>
          <v-col md="9">
            <div class="company-name">{{ getApprovedName || 'Unavailable' }}</div>
            <div class="company-type">
              <span>{{ entityDescription }}</span>
            </div>
          </v-col>
        </v-row>
      </div>

      <v-divider />

      <div class="section-container">
        *** BUSINESS ADDRESSES PLACEHOLDER ***
      </div>

      <v-divider />

      <div class="section-container">
        <BusinessContactInfo :initialValue="getBusinessContact" :isEditing="false" />
      </div>

      <v-divider />

      <div class="section-container">
        <v-row no-gutters>
          <v-col md="3" class="mr-n1">
            <label>Business Start Date</label>
          </v-col>
          <v-col md="9">
            <div>{{ yyyyMmDdToPacificDate(getRegistration.startDate, true) || '(Not entered)' }}</div>
          </v-col>
        </v-row>
      </div>

      <v-divider v-if="isPremiumAccount" />

      <div class="section-container" v-if="isPremiumAccount">
        <FolioNumber :initialValue="getFolioNumber" :isEditing="false" />
      </div>
    </section>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { BusinessContactIF, RegistrationStateIF } from '@/interfaces'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import { DateMixin, EntityFilterMixin, EnumMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import { getRegistration, isDefineRegistrationValid } from '@/store/getters'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    OfficeAddresses
  }
})
export default class DefineRegistrationSummary extends Mixins(DateMixin, EntityFilterMixin, EnumMixin) {
  // Getters
  @Getter getApprovedName!: string
  @Getter isDefineRegistrationValid!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter getValidateSteps!: boolean
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getFolioNumber!: string
  @Getter getRegistration!: RegistrationStateIF

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

.define-registration-step-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-red;
}

.section-container {
 padding: 1.5rem
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
