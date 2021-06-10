<template>
  <div id="entity-info">
    <v-container>
      <v-breadcrumbs :items="breadcrumbs" divider=">" class="breadcrumb mb-5">
        <v-breadcrumbs-item
          slot="item"
          slot-scope="{ item }"
          exact
          :href="item.href">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-list-item three-line id="entity-info-header">

        <!-- Header -->
        <v-list-item-content id="nr-header" v-show="isEntityType">
          <!-- Company Name -->
          <v-list-item-title class="header-title" id="entity-legal-name">
            <span>{{ getApprovedName || getNumberedEntityName }}</span>
          </v-list-item-title>

          <!-- Company Number -->
          <v-list-item-subtitle class="business-info">
            <dl>
              <dt>{{ entityTitle }}</dt>
              <dd v-if="getNameRequestNumber">Name Request No:
                <span id="entity-nr-number">{{ getNameRequestNumber }}</span>
              </dd>
              <dd v-else id="entity-numbered-label">{{getNumberedEntityName}}</dd>
            </dl>
          </v-list-item-subtitle>

        </v-list-item-content>

      </v-list-item>
    </v-container>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces & enums
import { GetterIF } from '@/interfaces'
import { CorpTypeCd, FilingNames } from '@/enums'

// Modules
import { EnumMixin } from '@/mixins'

@Component({})
export default class EntityInfo extends Mixins(EnumMixin) {
  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter getEntityType!: CorpTypeCd
  @Getter getNameRequestNumber!: GetterIF
  @Getter getTempId!: GetterIF
  @Getter getApprovedName!: GetterIF

  /** The entity application title  */
  private get entityTitle (): string {
    return `${this.getCorpTypeDescription(this.getEntityType)} ${FilingNames.INCORPORATION_APPLICATION}`
  }

  /** The numbered entity name */
  private get getNumberedEntityName (): string {
    return `${this.getCorpTypeNumberedDescription(this.getEntityType)}`
  }

  /** Get route breadcrumbs. */
  private get breadcrumbs (): Array<any> {
    return [
      {
        text: 'Manage Businesses Dashboard',
        disabled: false,
        href: `${sessionStorage.getItem('AUTH_URL')}business`
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
      color: $BCgovABlue3;
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
  display: flex;
  justify-content: space-between;
}

dl {
  display: inline-block;
  overflow: hidden;
  color: $gray6;
}

dd, dt {
  float: left;
}

// dt {
//   position: relative;
// }

dt + dd:before {
  content: "•";
  display: inline-block;
  margin-right: 0.75rem;
  margin-left: 0.75rem;
}
</style>
