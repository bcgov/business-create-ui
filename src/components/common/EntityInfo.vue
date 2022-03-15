<template>
  <div id="entity-info">
    <v-container>
      <v-row no-gutters class="pt-3 pb-3">
        <v-col cols="12" md="9" class="pr-5">
          <div id="nr-header" v-show="isEntityType">
            <span class="header-title" id="entity-legal-name">{{ legalName || getNumberedEntityName }}</span>
          </div>

          <div id="entity-title" class="business-info">
            <span>{{ entityTitle }}</span>
          </div>

          <div class="mt-5" />
        </v-col>

        <v-col cols="12" md="3" class="business-info">
          <div v-if="getNameRequestNumber" id="entity-nr-number">
            <span class="font-weight-bold business-info-label">Name Request:</span>
            {{ getNameRequestNumber }}
          </div>

          <template v-if="!isRegistrationFiling">
            <div id="entity-business-email">
              <span class="font-weight-bold business-info-label">Email:</span>
              {{ getEmail || 'Not Available' }}
            </div>

            <div id="entity-business-phone">
              <span class="font-weight-bold business-info-label">Phone:</span>
              {{ getPhone || 'Not Available' }}
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces & enums
import { CorpTypeCd, FilingNames, FilingTypes } from '@/enums'
import { BusinessContactIF } from '@/interfaces'

// Modules
import { EnumMixin } from '@/mixins'

@Component({})
export default class EntityInfo extends Mixins(EnumMixin) {
  @Getter getBusinessLegalName!: string
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getEntityIdentifier!: string
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getFilingName!: FilingNames
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getFilingType!: FilingTypes
  @Getter isEntityType!: boolean
  @Getter isIncorporationFiling!: boolean
  @Getter isRegistrationFiling!: boolean

  /** The entity application title.  */
  get entityTitle (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)} ${this.getFilingName}`
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
    return this.getBusinessContact.phone
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
  background: $BCgovInputBG;

  .breadcrumb {
    padding: 0;
  }

  .v-breadcrumbs li {
    font-size: $px-12;
  }

  ::v-deep {
    .v-breadcrumbs a {
      color: $gray8;
    }

    .v-breadcrumbs a:hover {
      color: $app-blue;
    }
  }
}

#entity-info-header {
  padding: 0!important;
}

#entity-title {
  color: $gray7;
}

.container {
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.header-title {
  font-size: $px-20;
  font-weight: bold;
  color: $gray9;
}

.business-info {
  color: $gray7;
  font-size: $px-14;

  .business-info-label {
    color: $gray9;
  }
}
</style>
