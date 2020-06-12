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
            <span>{{ getApprovedName || 'Numbered Benefit Company' }}</span>
          </v-list-item-title>

          <!-- Company Number -->
          <v-list-item-subtitle class="business-info">
            <dl>
              <dt>{{ entityTitle() }}</dt>
              <dd v-if="getNameRequestNumber">Name Request No:
                <span id="entity-nr-number">{{ getNameRequestNumber }}</span>
              </dd>
              <dd v-else id="entity-numbered-label">Numbered Benefit Company</dd>
            </dl>
          </v-list-item-subtitle>

        </v-list-item-content>

      </v-list-item>
    </v-container>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Interfaces
import { GetterIF } from '@/interfaces'

@Component({})
export default class EntityInfo extends Vue {
  // Global getters
  @Getter isEntityType!: GetterIF
  @Getter isTypeBcomp!: GetterIF
  @Getter isTypeCoop!: GetterIF
  @Getter getNameRequestNumber!: GetterIF
  @Getter getTempId!: GetterIF
  @Getter getApprovedName!: GetterIF

  /** The entity title  */
  private entityTitle (): string {
    if (this.isTypeBcomp) {
      return 'BC Benefit Company Incorporation Application'
    } else if (this.isTypeCoop) {
      return 'Incorporate a BC Cooperative Association'
    }

    return ''
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
        text: this.getApprovedName || 'Numbered Benefit Company',
        disabled: false,
        href: `${sessionStorage.getItem('DASHBOARD_URL')}${this.getTempId}`
      },
      {
        text: this.entityTitle(),
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
