<template>
  <div id="extrapro-business-lookup">
    <v-autocomplete
      v-model="selectedBusiness"
      filled
      no-filter
      append-icon=""
      return-object
      autocomplete="chrome-off"
      menu-props="{ maxHeight: 380 }"
      hint="Enter at least 3 characters"
      hide-details="auto"
      item-text="identifier"
      :disabled="state === States.SUMMARY"
      :label="businessLookupLabel"
      :name="Math.random()"
      :items="searchResults"
      :loading="state == States.SEARCHING"
      :hide-no-data="state != States.NO_RESULTS"
      @update:search-input="onSearchInput($event)"
    >
      <!-- Empty selection slot will stop re-triggering of search-input event -->
      <template #selection="" />

      <template #no-data>
        <v-list-item>
          <div>No matches found.</div>
        </v-list-item>
      </template>

      <template #item="{ item }">
        <v-row class="business-lookup-result pt-1">
          <v-col
            cols="3"
            class="result-identifier d-inline-flex"
          >
            <span>{{ item.identifier }}</span>
            <span v-if="showBusinessSearchStatus">&nbsp;({{ item.status?.charAt(0) }})</span>
          </v-col>

          <v-col
            cols="7"
            class="result-name flex-1-1"
          >
            {{ item.name }}
          </v-col>

          <v-col
            cols="2"
            class="result-action"
          >
            Select
          </v-col>
        </v-row>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Watch } from 'vue-property-decorator'
import { debounce } from 'lodash'
import { BusinessLookupResultIF } from '@/interfaces'
import { BusinessLookupServices } from '@/services'
import { GetFeatureFlag } from '@/utils/feature-flag-utils'

/* eslint-disable no-unused-vars */
enum States {
  INITIAL = 'initial',
  SEARCHING = 'searching',
  SHOW_RESULTS = 'show results',
  NO_RESULTS = 'no results',
  SUMMARY = 'summary'
}
/* eslint-enable no-unused-vars */

//
// This component is a hybrid between the shared BusinessLookup component
// and the Auth Web BusinessLookup component.
//
@Component({})
export default class ExtraproBusinessLookup extends Vue {
  // enum for template
  readonly States = States

  // local variables
  state = States.INITIAL
  searchResults: Array<BusinessLookupResultIF> = []
  selectedBusiness: BusinessLookupResultIF = null

  readonly businessLookupLabel = 'Extraprovincial registration number or name of the business in B.C.'

  get showBusinessSearchStatus (): boolean {
    return Boolean(GetFeatureFlag('show-business-search-status'))
  }

  /** Called when Search Input has been updated. */
  onSearchInput (searchInput: string) {
    this.onSearchInputDebounced(this, searchInput)
  }

  /** The search method that waits for 600ms debounce timeout to prevent excessive calls to the API. */
  private onSearchInputDebounced = debounce(async (that: this, searchInput: string) => {
    // don't search until we have at least 3 characters
    if (searchInput?.length > 2) {
      that.state = States.SEARCHING
      that.searchResults = await BusinessLookupServices.search(searchInput, '', 'A').catch(() => [])
      // display appropriate section
      that.state = (that.searchResults.length > 0) ? States.SHOW_RESULTS : States.NO_RESULTS
    } else {
      that.searchResults = []
      that.state = States.INITIAL
    }
  }, 600)

  /** Called when a business has been selected. */
  @Watch('selectedBusiness')
  private onSelectedBusiness (result: BusinessLookupResultIF): void {
    // safety check
    if (result) {
      this.emitBusiness(result)
      this.selectedBusiness = null
      this.state = States.SUMMARY
    }
  }

  /** Emits event to update the Business object. */
  @Emit('business')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitBusiness (val: BusinessLookupResultIF): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

:deep() {
  // Remove details field bottom margin and an extra 4px for the combobox
  // bottom margin when the details field is displayed.
  // This is so there is no bottom whitespace either way.
  .v-text-field__details {
    margin-bottom: -4px !important
  }
}

.business-lookup-result {
  font-size: $px-14;
  color: $gray7;

  &:hover {
    background-color: $gray1;
    color: $app-blue;
  }

  .result-identifier,
  .result-name {
    // cursor: pointer;
    font-size: $px-16;

    // limit col width and show an ellipsis for long names:
    max-width: 700px;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  .result-action {
    text-align: right;
    font-size: $px-14;
    color: $app-blue;
  }
}
</style>
