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
          :key="item.businessId"
        >
          <td class="business-name">
            <strong>{{ item.name }}</strong><br>{{ item.email }}
          </td>

          <td class="business-type">
            {{ GetCorpFullDescription(item.type) }}
          </td>

          <td class="business-address">
            <BaseAddress
              v-if="item.address"
              :address="item.address"
            />
            <span v-else-if="item.jurisdiction">{{ item.jurisdiction }}</span>
            <span v-else>Affiliate to view</span>
          </td>

          <td class="business-role">
            {{ item.role }}
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
import { useStore } from '@/store/store'
import { BusinessStatuses } from '@/enums'
import { DefineCompanyIF } from '@/interfaces'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import BusinessStatus from './BusinessStatus.vue'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    BaseAddress,
    BusinessStatus
  }
})
export default class BusinessTable extends Vue {
  readonly GetCorpFullDescription = GetCorpFullDescription

  @Getter(useStore) getAmalgamatingBusinesses!: any[]
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: any[]) => void
  @Action(useStore) setDefineCompanyStepValidity!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  get businesses (): any[] {
    // *** TODO: use "map" to compute status from other info
    //           eg, if business.goodStanding != true then status = ERROR_NIGS
    return this.getAmalgamatingBusinesses.map(business => {
      if (!business.goodStanding) business.status = BusinessStatuses.ERROR_NIGS
      return business
    })
  }

  removeBusiness (index: number): void {
    const temp = this.getAmalgamatingBusinesses
    temp.splice(index, 1)
    this.setAmalgamatingBusinesses(temp)
  }

  @Watch('businesses', { deep: true, immediate: true })
  @Emit('valid')
  private emitValidity (): boolean {
    return this.businesses.every(business => business.status === BusinessStatuses.OK)
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
      min-width: 120px;
      max-width: 200px;
      // show ellipsis when email overflows
      // (doesn't affect name because name breaks on spaces)
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    & td.business-type {
      min-width: 120px;
      max-width: 150px;
    }
    & td.business-address {
      min-width: 200px;
    }
    & td.business-role {
      max-width: 120px;
    }
    & td.business-status {
      max-width: 100px;
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
