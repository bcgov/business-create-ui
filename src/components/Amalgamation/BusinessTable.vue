<template>
  <v-simple-table id="business-table">
    <template #default>
      <thead>
        <tr>
          <th>Business Name</th>
          <th>Business Type</th>
          <th>Mailing Address</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!businesses.length">
          <td colspan="6">
            <p class="text-center">
              No businesses added
            </p>
          </td>
        </tr>

        <tr
          v-for="(item, index) in businesses"
          :key="key(item)"
        >
          <td class="business-name">
            <strong>{{ name(item) }}</strong><br>{{ email(item) }}
          </td>

          <td class="business-type">
            {{ type(item) }}
          </td>

          <td class="business-address">
            <template v-if="item.type === AmlTypes.LEAR">
              <BaseAddress
                v-if="item.address"
                :address="item.address"
              />
              <span v-else>Affiliate to view</span>
            </template>

            <template v-if="item.type === AmlTypes.FOREIGN">
              {{ jurisdiction(item) }}
            </template>
          </td>

          <td class="business-role">
            {{ role(item) }}
          </td>

          <td class="business-status">
            <BusinessStatus :status="item.status" />
          </td>

          <td class="business-actions">
            <v-btn
              text
              color="primary"
              @click="removeBusiness(index)"
            >
              <v-icon
                small
                color="primary"
              >
                mdi-delete
              </v-icon>
              <span class="ml-2">Remove</span>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { AmlStatuses, AmlRoles, AmlTypes } from '@/enums'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import BusinessStatus from './BusinessStatus.vue'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { AmalgamationMixin } from '@/mixins'

@Component({
  components: {
    BaseAddress,
    BusinessStatus
  }
})
export default class BusinessTable extends Mixins(AmalgamationMixin) {
  readonly AmlRoles = AmlRoles
  readonly AmlTypes = AmlTypes
  readonly GetCorpFullDescription = GetCorpFullDescription

  @Getter(useStore) getNameRequestApprovedName!: string

  @Action(useStore) spliceAmalgamatingBusiness!: (x: number) => void

  /**
   * This is the list of amalgamating businesses with computed statuses.
   * In other words, this is where the business rules are evaluated.
   */
  get businesses (): AmalgamatingBusinessIF[] {
    return this.getAmalgamatingBusinesses.map(business => {
      // evaluate the rules for the current business
      // assign the value of the first failed rule (if any) else OK
      business.status = this.rules.reduce(
        (status: AmlStatuses, rule: (business: AmalgamatingBusinessIF) => AmlStatuses) => {
          // if we already failed a rule, don't evaluate the current rule
          if (status) return status
          // return the value of the current rule (may be null)
          return rule(business)
        },
        null
      ) || AmlStatuses.OK

      // return updated business object
      return business
    })
  }

  key (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return item.identifier
    if (item?.type === AmlTypes.FOREIGN) return item.corpNumber
    return null // should never happen
  }

  name (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return item.name
    if (item?.type === AmlTypes.FOREIGN) return item.legalName
    return '(Unknown)' // should never happen
  }

  email (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return item.email
    return null // should never happen
  }

  type (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return GetCorpFullDescription(item.legalType)
    if (item?.type === AmlTypes.FOREIGN) return 'Foreign'
    return '(Unknown)' // should never happen
  }

  jurisdiction (item: AmalgamatingBusinessIF): string {
    const fj = (item?.type === AmlTypes.FOREIGN) && item.foreignJurisdiction
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

  removeBusiness (index: number): void {
    // If the company to be deleted is selected as the resulting business name, reset values.
    const business = this.getAmalgamatingBusinesses[index] as any
    if (this.getNameRequestApprovedName && this.getNameRequestApprovedName === business.name) {
      this.resetValues()
    }

    // Delete this item from amalgamating businesses list.
    this.spliceAmalgamatingBusiness(index)
  }

  @Watch('businesses', { deep: true, immediate: true })
  @Emit('valid')
  private emitValidity (): boolean {
    return (
      (this.businesses.length >= 2) &&
      this.businesses.every(business => business.status === AmlStatuses.OK)
    )
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
    }
    & td.business-type {
      max-width: 150px;
    }
    & td.business-address {
      min-width: 200px;
    }
    & td.business-role {
      max-width: 130px;
    }
    & td.business-status {
      max-width: 120px;
    }
    & td.business-actions {
      max-width: 125px;
      .v-btn {
        margin-top: -8px;
        margin-left: -16px;
      }
      .v-icon {
        margin-top: 2px;
      }
    }
    // disable hover color
    &:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background-color: inherit;
    }
  }
}
</style>
