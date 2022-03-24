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

        <div class="mt-5" />
      </v-col>

      <v-col cols="12" md="3">
        <div v-if="getNameRequestNumber" id="entity-nr-number">
          <span class="business-info-label">Name Request:</span>
          {{ getNameRequestNumber }}
        </div>

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
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces & enums
import { BusinessTypes, CorpTypeCd, FilingNames, FilingTypes } from '@/enums'
import { ContactPointIF, RegistrationStateIF } from '@/interfaces'

// Modules
import { EnumMixin } from '@/mixins'

@Component({})
export default class EntityInfo extends Mixins(EnumMixin) {
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

  /** The entity description.  */
  get entityDescription (): string {
    let corpTypeDescription = this.getCorpTypeDescription(this.getEntityType)
    const isSpDba = (this.getRegistration.businessType === BusinessTypes.DBA)
    if (isSpDba) corpTypeDescription += ' / Doing Business As (DBA)'
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
