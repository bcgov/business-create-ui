<template>
  <div id="entity-info">
    <v-container>
      <v-row no-gutters class="pt-3 pb-3">
        <v-col cols="12" md="9">
          <div id="nr-header" v-show="isEntityType">
            <span class="header-title" id="entity-legal-name">{{ legalName || getNumberedEntityName }}</span>
          </div>
          <div id="entity-title" class="business-info">
            <span>{{ entityTitle }}</span>
          </div>
        </v-col>

        <v-col cols="12" md="3" class="business-info pl-5 pt-7">
          <div v-if="getNameRequestNumber" id="entity-nr-number">
            <span class="font-weight-bold business-info-label">Name Request:</span>
            {{ getNameRequestNumber }}
          </div>

          <div id="entity-business-email">
            <span class="font-weight-bold business-info-label">Email:</span>
            {{ getEmail || 'Not Available' }}
          </div>

          <div id="entity-business-phone">
            <span class="font-weight-bold business-info-label">Phone:</span>
            {{ getPhone || 'Not Available' }}
          </div>
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

  /** The entity application title.  */
  private get entityTitle (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)} ${this.getFilingName}`
  }

  /** The numbered entity name. */
  private get getNumberedEntityName (): string {
    return `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  private get getEmail (): string {
    if (this.isIncorporationFiling) {
      return this.getUserEmail
    }
    return this.getBusinessContact.email
  }

  private get getPhone (): string {
    if (this.isIncorporationFiling) {
      return this.getUserPhone
    }
    return this.getBusinessContact.phone
  }

  private get legalName (): string {
    switch (this.getFilingType) {
      case FilingTypes.DISSOLUTION:
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
    font-size: .75rem;
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
  font-size: 1.25rem;
  font-weight: bold;
  color: $gray9;
}

.business-info {
  color: $gray7;
  font-size: .875rem;

  .business-info-label {
    color: $gray9;
  }
}
</style>
