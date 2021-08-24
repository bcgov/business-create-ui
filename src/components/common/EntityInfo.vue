<template>
  <div id="entity-info">
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider=">" class="breadcrumb">
        <v-breadcrumbs-item
          slot="item"
          slot-scope="{ item }"
          exact
          :href="item.href">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-row no-gutters class="pt-3 pb-3">
        <v-col cols="12" md="9">
          <div id="nr-header" v-show="isEntityType">
            <span class="header-title" id="entity-legal-name">{{ getApprovedName || getNumberedEntityName }}</span>
          </div>
          <div id="entity-title" class="business-info">
            <span>{{ entityTitle }}</span>
          </div>
        </v-col>

        <v-col cols="12" md="3" class="business-info pl-5 pt-7">
          <div v-if="getNameRequestNumber" id="entity-nr-number">
            <span class="font-weight-bold">Name Request No:</span>
            {{ getNameRequestNumber }}
          </div>

          <div id="entity-business-email">
            <span class="font-weight-bold">Email:</span>
            {{ getUserEmail || 'Not Available' }}
          </div>

          <div id="entity-business-phone">
            <span class="font-weight-bold">Phone:</span>
            {{ getUserPhone || 'Not Available' }}
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
import { CorpTypeCd, FilingNames } from '@/enums'

// Modules
import { EnumMixin } from '@/mixins'

@Component({})
export default class EntityInfo extends Mixins(EnumMixin) {
  @Getter isEntityType!: boolean
  @Getter getUserEmail!: string
  @Getter getUserPhone!: string
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequestNumber!: string
  @Getter getTempId!: string
  @Getter getApprovedName!: string

  /** The entity application title.  */
  private get entityTitle (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)} ${FilingNames.INCORPORATION_APPLICATION}`
  }

  /** The numbered entity name. */
  private get getNumberedEntityName (): string {
    return `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  /** The route breadcrumbs. */
  private get breadcrumbs (): Array<any> {
    return [
      {
        text: 'Manage Businesses Dashboard',
        disabled: false,
        href: `${sessionStorage.getItem('AUTH_WEB_URL')}business`
      },
      {
        text: this.getApprovedName || this.getNumberedEntityName,
        disabled: false,
        href: `${sessionStorage.getItem('DASHBOARD_URL')}${this.getTempId}`
      },
      {
        text: this.entityTitle,
        disabled: false
      }
    ]
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

.container {
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.business-info {
  color: $gray7;
  font-size: .875rem;
}
</style>
