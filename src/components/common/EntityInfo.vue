<template>
  <div id="entity-info">
    <v-row no-gutters>
      <v-col cols="12" md="9">
        <div v-show="isEntityType" id="entity-legal-name">
          {{ legalName || getNumberedEntityName }}
        </div>

        <div id="entity-description">
          {{ entityDescription }}
        </div>

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

        <template v-if="isTypeFirm">
          <div id="entity-business-registration-date">
            <span class="business-info-label">Registration Date:</span>
            {{ businessStartDate || "Not Available" }}
          </div>
        </template>

        <template v-if="isTypeFirm">
          <div id="entity-business-registration-date">
            <span class="business-info-label">Registration Number:</span>
            {{ (!this.getEntityIdentifier || this.getEntityIdentifier.startsWith('T')) ? "Not Available" : this.getEntityIdentifier }}
          </div>
        </template>

         <template v-if="isTypeFirm">
          <div id="entity-business-registration-date">
            <span class="business-info-label">Business Number:</span>
            {{ this.getBusinessId || "Not Available" }}
          </div>
        </template>

        <template v-if="!isRegistrationFiling">
          <div id="entity-business-email">
            <span class="business-info-label">Email:</span>
            {{ getEmail || 'Not Available' }}
          </div>

          <div id="entity-business-phone">
            <span class="business-info-label">Phone:</span>
            {{ getPhone || 'Not Available' }}
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { CorpTypeCd, FilingNames, FilingTypes } from '@/enums'
import { ContactPointIF, RegistrationStateIF } from '@/interfaces'
import { EnumMixin, DateMixin } from '@/mixins'
import { StaffComments } from '@bcrs-shared-components/staff-comments'
import { axios } from '@/utils'

@Component({ components: { StaffComments } })
export default class EntityInfo extends Mixins(EnumMixin, DateMixin) {
  @Getter getBusinessLegalName!: string
  @Getter getBusinessContact!: ContactPointIF
  @Getter getEntityIdentifier!: string
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getFilingName!: FilingNames
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getFilingType!: FilingTypes
  @Getter getRegistration!: RegistrationStateIF
  @Getter isEntityType!: boolean
  @Getter isIncorporationFiling!: boolean
  @Getter isRegistrationFiling!: boolean
  @Getter isTypeSoleProp!: boolean
  @Getter getBusinessId!: string
  @Getter isRoleStaff!: boolean
  @Getter isTypeFirm!: boolean
  @Getter getBusinessFoundingDate!: string

  // axios for template
  readonly axios = axios

  /** The business start date. */
  get businessStartDate (): string {
    // it will be same as foundingDate
    return this.dateToPacificDate(this.apiToDate(this.getBusinessFoundingDate), true)
  }

  /** The entity description.  */
  get entityDescription (): string {
    const corpTypeDescription = this.getCorpTypeDescription(this.getEntityType)
    if (this.isTypeSoleProp) {
      return `${corpTypeDescription} / Doing Business As (DBA) ${this.getFilingName}`
    }
    return `${corpTypeDescription} ${this.getFilingName}`
  }

  /** The numbered entity name. */
  get getNumberedEntityName (): string {
    return `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  get getEmail (): string {
    if (this.isIncorporationFiling) {
      return this.getUserEmail
    }
    return this.getBusinessContact.email
  }

  get getPhone (): string {
    if (this.isIncorporationFiling) {
      return this.getUserPhone
    }
    const phone = this.getBusinessContact.phone
    const ext = this.getBusinessContact.extension
    return `${phone}${ext ? (' x' + ext) : ''}`
  }

  get legalName (): string {
    switch (this.getFilingType) {
      case FilingTypes.VOLUNTARY_DISSOLUTION:
        return this.getBusinessLegalName
      case FilingTypes.INCORPORATION_APPLICATION:
        return this.getApprovedName
      case FilingTypes.REGISTRATION:
        return this.getApprovedName
    }
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
