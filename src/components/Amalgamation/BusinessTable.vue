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
        <tr
          v-for="(item, index) in businesses"
          :key="(item.type === 'lear' && item.identifier) || (item.type === 'foreign' && item.corpNumber)"
        >
          <td class="business-name">
            <strong>{{ name(item) }}</strong><br>{{ (item.type === 'lear') && item.email }}
          </td>

          <td class="business-type">
            {{ type(item) }}
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
              <span v-if="item.foreignJurisdiction">{{ jurisdiction(item) }}</span>
              <span v-else>(Unknown)</span>
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
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { getName } from 'country-list'
import { useStore } from '@/store/store'
import { AmalgamatingStatuses, AmlRoles } from '@/enums'
import { AmalgamatingBusinessIF, DefineCompanyIF } from '@/interfaces'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import BusinessStatus from './BusinessStatus.vue'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    BaseAddress,
    BusinessStatus
  }
})
export default class BusinessTable extends Vue {
  readonly AmlRoles = AmlRoles
  readonly GetCorpFullDescription = GetCorpFullDescription

  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeBcCcc!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: AmalgamatingBusinessIF[]) => void
  @Action(useStore) setDefineCompanyStepValidity!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  // *** I'M STILL WONDERING IF I WANT TO USE THESE
  // readonly isLear = (item: AmalgamatingBusinessIF): boolean => (item?.type === 'lear')
  // readonly isForeign = (item: AmalgamatingBusinessIF): boolean => (item?.type === 'foreign')

  /** True if there a limited company in the table. */
  get isAnyLimited (): boolean {
    return this.businesses.some(business =>
      (business.type === 'lear' && business.legalType === CorpTypeCd.BC_COMPANY)
    )
  }

  /**
   * This is the list of amalgamating businesses with computed statuses.
   * In other words, these are the business rules.
   */
  get businesses (): AmalgamatingBusinessIF[] {
    return this.getAmalgamatingBusinesses.map(business => {
      /* eslint-disable brace-style */

      // disallow foreign altogether if not staff
      // (could happen if staff added it and regular user resumes draft)
      if (business.type === 'foreign' && !this.isRoleStaff) {
        business.status = AmalgamatingStatuses.ERROR_FOREIGN
      }

      // disallow foreign into ULC if there is also a limited
      else if (business.type === 'foreign' && this.isTypeBcUlcCompany && this.isAnyLimited) {
        business.status = AmalgamatingStatuses.ERROR_FOREIGN
      }

      // assume business is not affiliated if we don't have address (non-staff only)
      else if (business.type === 'lear' && !business.address && !this.isRoleStaff) {
        business.status = AmalgamatingStatuses.ERROR_AFFILIATION
      }

      // identify CCC mismatch
      else if (business.type === 'lear' && business.legalType === CorpTypeCd.BC_CCC && !this.isTypeBcCcc) {
        business.status = AmalgamatingStatuses.ERROR_CCC_MISMATCH
      }

      // disallow NIGS if not staff
      else if (business.type === 'lear' && !business.goodStanding && !this.isRoleStaff) {
        business.status = AmalgamatingStatuses.ERROR_NIGS
      }

      // check if limited restoration
      // *** TODO

      // check for future effective filing
      // *** TODO

      // otherwise, status is OK
      else {
        business.status = AmalgamatingStatuses.OK
      }
      /* eslint-enable brace-style */

      return business
    })
  }

  name (item: AmalgamatingBusinessIF): string {
    if (item?.type === 'lear') return item.name
    if (item?.type === 'foreign') return item.legalName
    return '(Unknown)' // should never happen
  }

  type (item: AmalgamatingBusinessIF): string {
    if (item?.type === 'lear') return GetCorpFullDescription(item.legalType)
    if (item?.type === 'foreign') return 'Foreign'
    return '(Unknown)' // should never happen
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

  removeBusiness (index: number): void {
    const temp = this.getAmalgamatingBusinesses
    temp.splice(index, 1)
    this.setAmalgamatingBusinesses(temp)
  }

  @Watch('businesses', { deep: true, immediate: true })
  @Emit('valid')
  private emitValidity (): boolean {
    return this.businesses.every(business => business.status === AmalgamatingStatuses.OK)
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
