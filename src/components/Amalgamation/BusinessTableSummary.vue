<template>
  <v-simple-table id="business-table-summary">
    <template #default>
      <thead>
        <tr>
          <th>Business Name</th>
          <th>Mailing Address</th>
          <th>Role</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in getAmalgamatingBusinesses"
          :key="key(item)"
        >
          <td class="business-name">
            <v-icon color="gray9">
              mdi-domain
            </v-icon>
            <strong>{{ name(item) }}</strong><br>{{ email(item) }}
          </td>

          <td class="business-address">
            <template v-if="item.type === 'lear'">
              <BaseAddress
                v-if="item.address"
                :address="item.address"
              />
              <span v-else>Affiliate to view</span>
            </template>

            <template v-if="item.type === 'foreign'">
              {{ jurisdiction(item) }}
            </template>
          </td>

          <td class="business-role">
            {{ role(item) }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { AmlRoles } from '@/enums'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { BaseAddress } from '@bcrs-shared-components/base-address'

@Component({
  components: {
    BaseAddress
  }
})
export default class BusinessTableSummary extends Vue {
  readonly AmlRoles = AmlRoles

  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]

  key (item: AmalgamatingBusinessIF): string {
    if (item?.type === 'lear') return item.identifier
    if (item?.type === 'foreign') return item.corpNumber
    return null // should never happen
  }

  name (item: AmalgamatingBusinessIF): string {
    if (item?.type === 'lear') return item.name
    if (item?.type === 'foreign') return item.legalName
    return '(Unknown)' // should never happen
  }

  email (item: AmalgamatingBusinessIF): string {
    if (item?.type === 'lear') return item.email
    return null // should never happen
  }

  jurisdiction (item: AmalgamatingBusinessIF): string {
    const fj = (item?.type === 'foreign') && item.foreignJurisdiction
    if (fj?.country) {
      const country = getName(fj.country)
      const region = (fj.region === 'FEDERAL' ? 'Federal' : fj.region)
      if (region) return `${region}, ${country}`
      return country
    }
    return '(Unknown)' // should never happen
  }

  role (item: AmalgamatingBusinessIF): string {
    if (item.role === AmlRoles.AMALGAMATING) return 'Amalgamating Business'
    if (item.role === AmlRoles.HOLDING) return 'Holding Company'
    return '(Unknown)' // should never happen
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.theme--light.v-data-table > .v-data-table__wrapper > table {
  // table header rows
  & > thead > tr {
    & > th {
      color: $gray9;
      font-size: $px-14;
      padding: 1rem;
    }
    & th:first-of-type {
      padding-left: 2rem;
    }
    & th:last-of-type {
      padding-right: 2rem;
    }
  }

  // table body rows
  & > tbody> tr {
    & > td {
      color: $gray7;
      padding: 1.125rem;
      vertical-align: top;
    }
    & td:first-of-type {
      padding-left: 2rem;
    }
    & td:last-of-type {
      padding-right: 2rem;
    }
    & td.business-name {
      max-width: 200px;
      // show ellipsis when email overflows
      // (doesn't affect name because name breaks on spaces)
      overflow-x: hidden;
      text-overflow: ellipsis;

      .v-icon {
        margin-top: -4px;
        margin-left: -34px;
        padding-right: 8px;
      }
    }
    & td.business-address {
      min-width: 200px;
    }
    & td.business-role {
      max-width: 130px;
    }
    // disable hover color
    &:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background-color: inherit;
    }
  }
}
</style>
