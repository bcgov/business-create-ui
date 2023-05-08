<template>
  <div id="entity-info">
    <v-row no-gutters>
      <v-col cols="12" md="9">
        <div v-show="isEntityType" id="entity-legal-name">{{ entityLegalName }}</div>

        <div id="entity-description">{{ entityDescription }}</div>

        <menu class="mt-5">
          <!-- Staff Comments -->
          <div class=" ml-n3" v-if="getBusinessId && isRoleStaff">
            <StaffComments
              :axios="axios"
              :businessId="getBusinessId"
              maxLength="2000"
              :key="getBusinessId"
            />
          </div>
        </menu>
      </v-col>

      <v-col cols="12" md="3">
        <div v-if="getNameRequestNumber" id="entity-nr-number">
          <span class="business-info-label">Name Request:</span>
          {{ getNameRequestNumber }}
        </div>

        <template v-if="isTypeFirm && getBusinessId">
          <div id="entity-business-registration-date">
            <span class="business-info-label">Registration Date:</span>
            {{ businessStartDate || "Not Available" }}
          </div>
        </template>

        <template v-if="isTypeFirm && getBusinessId">
          <div id="entity-business-registration-number">
            <span class="business-info-label">Registration Number:</span>
            {{ getEntityIdentifier || "Not Available" }}
          </div>
        </template>

         <template v-if="isTypeFirm && getBusinessId">
          <div id="entity-business-business-number">
            <span class="business-info-label">Business Number:</span>
            {{ getBusinessNumber || "Not Available" }}
          </div>
        </template>

        <template v-if="!isRegistrationFiling">
          <div id="entity-business-email">
            <span class="business-info-label">Email:</span>
            {{ email || 'Not Available' }}
          </div>

          <div id="entity-business-phone">
            <span class="business-info-label">Phone:</span>
            {{ phone || 'Not Available' }}
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { FilingNames, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { ContactPointIF, RegistrationStateIF } from '@/interfaces'
import { DateMixin } from '@/mixins'
import { StaffComments } from '@bcrs-shared-components/staff-comments'
import { AxiosInstance as axios } from '@/utils'
import { GetCorpFullDescription, GetCorpNumberedDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    StaffComments
  },
  mixins: [
    DateMixin
  ]
})
export default class EntityInfo extends Vue {
  @Getter(useStore) getBusinessLegalName!: string
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getEntityIdentifier!: string
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserPhone!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getFilingName!: FilingNames
  @Getter(useStore) getNameRequestNumber!: string
  @Getter(useStore) getNameRequestApprovedName!: string
  @Getter(useStore) getFilingType!: FilingTypes
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isIncorporationFiling!: boolean
  @Getter(useStore) isRegistrationFiling!: boolean
  @Getter(useStore) getBusinessId!: string
  @Getter(useStore) getBusinessNumber!: string
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeFirm!: boolean
  @Getter(useStore) getBusinessFoundingDate!: string
  @Getter(useStore) getTempId!: string
  @Getter(useStore) isTypeSoleProp!: boolean

  // declaration for template
  readonly axios = axios

  /** The entity legal name (old name, new name, or numbered description). */
  get entityLegalName (): string {
    const numberedDescription = GetCorpNumberedDescription(this.getEntityType)

    // name comes from different places depending on filing type
    switch (this.getFilingType) {
      case FilingTypes.DISSOLUTION:
        return (this.getBusinessLegalName || numberedDescription)
      case FilingTypes.INCORPORATION_APPLICATION:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.REGISTRATION:
        return (this.getNameRequestApprovedName || numberedDescription)
      case FilingTypes.RESTORATION:
        return (this.getBusinessLegalName || numberedDescription)
    }
    return '' // should never happen
  }

  /** The entity description.  */
  get entityDescription (): string {
    const corpTypeDescription = GetCorpFullDescription(this.getEntityType)

    if (this.isTypeSoleProp && this.getTempId) {
      return `${corpTypeDescription} / Doing Business As (DBA)`
    } else if (this.isTypeFirm) {
      return corpTypeDescription
    } else {
      return `${corpTypeDescription} ${this.getFilingName}`
    }
  }

  /** The business start date. */
  get businessStartDate (): string {
    // it will be same as foundingDate
    return this.dateToPacificDate(this.apiToDate(this.getBusinessFoundingDate), true)
  }

  get email (): string {
    if (this.isIncorporationFiling) {
      return this.getUserEmail
    }
    return this.getBusinessContact.email
  }

  get phone (): string {
    if (this.isIncorporationFiling) {
      return this.getUserPhone
    }
    const phone = this.getBusinessContact.phone
    const ext = this.getBusinessContact.extension
    return `${phone}${ext ? (' x' + ext) : ''}`
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#entity-info {
  color: $gray7;
  background-color: $BCgovInputBG;
  font-size: $px-14;
}

#entity-legal-name {
  color: $gray9;
  font-size: $px-20;
  font-weight: bold;
}

.business-info-label {
  color: $gray9;
  font-weight: bold;
}
</style>
