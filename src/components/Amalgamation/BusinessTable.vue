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
                v-if="item.addresses"
                :address="registeredOfficeMailingAddress(item)"
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
            <template v-if="showActionsMenu(item)">
              <v-btn
                text
                color="primary"
                class="remove-btn mt-n2 ml-n4"
                @click="removeBusiness(index)"
              >
                <v-icon
                  small
                  color="primary"
                >
                  mdi-delete
                </v-icon>
                <span class="ml-1">Remove</span>
              </v-btn>

              <!-- more actions menu -->
              <v-menu
                offset-y
                left
              >
                <template #activator="{ on }">
                  <v-btn
                    v-if="showMoreActionsMenu(item)"
                    text
                    small
                    color="primary"
                    class="more-actions-btn mt-n2 p0"
                    v-on="on"
                  >
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    class="mark-as-btn"
                    @click="emitHoldingPrimaryBusiness(item)"
                  >
                    <v-list-item-title>
                      <v-icon
                        size="20"
                        color="primary"
                      >
                        mdi-domain
                      </v-icon>
                      <span
                        v-if="isAmalgamationFilingHorizontal"
                        class="ml-1"
                      >
                        Mark as Primary Business
                      </span>
                      <span
                        v-if="isAmalgamationFilingVertical"
                        class="ml-1"
                      >
                        Mark as Holding Business
                      </span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
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
import { AddressIF, AmalgamatingBusinessIF } from '@/interfaces'
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
  // @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  // @Getter(useStore) isAmalgamationFilingVertical!: boolean

  @Action(useStore) spliceAmalgamatingBusiness!: (x: number) => void

  /** Whether to show the actions menu for specified item. */
  showActionsMenu (item: AmalgamatingBusinessIF): boolean {
    // don't show for holding or primary business
    return (item.role !== AmlRoles.HOLDING && item.role !== AmlRoles.PRIMARY)
  }

  /** Whether to show the more actions menu for specified item. */
  showMoreActionsMenu (item: AmalgamatingBusinessIF): boolean {
    // only show for short-form amalgamating LEAR businesses
    return (
      (this.isAmalgamationFilingHorizontal || this.isAmalgamationFilingVertical) &&
      item.role === AmlRoles.AMALGAMATING &&
      item.type === AmlTypes.LEAR
    )
  }

  /**
   * This is the list of amalgamating businesses with computed statuses.
   * In other words, this is where the business rules are evaluated.
   */
  get businesses (): AmalgamatingBusinessIF[] {
    // iterate overall all amalgamating businesses
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
    // make the key depend on whether the more actions menu is shown (for reactivity)
    let x = this.showMoreActionsMenu(item) ? 'y' : 'n'
    return `${item.identifier}-${x}`
  }

  name (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return item.name
    if (item?.type === AmlTypes.FOREIGN) return item.legalName
    return '(Unknown)' // should never happen
  }

  email (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return item.authInfo?.contacts[0]?.email
    return null // should never happen
  }

  type (item: AmalgamatingBusinessIF): string {
    if (item?.type === AmlTypes.LEAR) return GetCorpFullDescription(item.legalType)
    if (item?.type === AmlTypes.FOREIGN) return 'Foreign'
    return '(Unknown)' // should never happen
  }

  registeredOfficeMailingAddress (item: AmalgamatingBusinessIF): AddressIF {
    if (item?.type === AmlTypes.LEAR) return item.addresses?.registeredOffice?.mailingAddress
    return null // should never happen
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
    switch (item.role) {
      case AmlRoles.AMALGAMATING: return 'Amalgamating Business'
      case AmlRoles.HOLDING: return 'Holding Business'
      case AmlRoles.PRIMARY: return 'Primary Business'
      default: return '(Unknown)' // should never happen
    }
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

  @Emit('newHoldingPrimaryBusiness')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitHoldingPrimaryBusiness (item: AmalgamatingBusinessIF): void {}

  @Watch('businesses', { deep: true, immediate: true })
  @Emit('allOk')
  private emitAllOk (): boolean {
    return this.businesses.every(business => business.status === AmlStatuses.OK)
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

  // table body rows and columns
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
      min-width: 180px;

      // nudge icon down a bit to line up with text
      .remove-btn .v-icon {
        margin-top: 2px;
      }

      .more-actions-btn {
        border-left: 1px solid $gray4;
        border-radius: 0 4px 4px 0;
        padding: 0 !important;
        min-width: 28px !important;
      }
    }

    // disable hover color
    &:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
      background-color: inherit;
    }
  }
}

// style the more actions buttons
.v-list-item {
  min-height: 0;
  padding: 0.5rem 1rem;

  .v-list-item__title {
    font-size: $px-14;
    color: $app-blue;
  }

  // nudge icon up a bit to line up with text
  .v-icon {
    margin-top: -2px;
  }
}
</style>
