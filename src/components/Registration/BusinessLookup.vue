<template>
  <div id="business-lookup">
    <div v-if="state !== States.SUMMARY">
      <v-autocomplete
        filled
        no-filter
        autocomplete="chrome-off"
        class="mt-5"
        append-icon=""
        menu-props="{ maxHeight: 380 }"
        :name="Math.random()"
        :rules="showErrors ? businessLookupRules: []"
        :items="searchResults"
        item-text="identifier"
        :loading="state == States.SEARCHING"
        :search-input.sync="searchField"
        :hide-no-data="state != States.NO_RESULTS"
        label="Business or Corporation Name or Incorporation Number"
        return-object
        v-model="selectedBusiness"
      >
        <!-- Empty selection slot will stop re-triggering of searchField @Watch -->
        <template v-slot:selection=""></template>
        <template v-slot:no-data>
          <v-list-item>
            <div>No matches found.</div>
          </v-list-item>
        </template>
        <template v-slot:item="{ item }">
          <v-row class="business-lookup-result pt-1">
            <v-col cols="2">
              <div class="result-identifier">{{item.identifier}}</div>
            </v-col>
            <v-col cols="10">
              <div class="result-name">{{item.name}}</div>
              <div class="result-bn">{{item.bn}}</div>
            </v-col>
          </v-row>
        </template>
      </v-autocomplete>
    </div>

    <div v-if="state === States.SUMMARY && haveBusiness" class="summary-block mt-5">
      <v-row no-gutters>
        <v-col cols="9">
          <v-row no-gutters>
            <v-col cols="12">
              <label>Name: </label>
              <span>{{businessName}}</span>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-1">
            <v-col cols="12">
              <label>Incorporation Number: </label>
              <span>{{identifier}}</span>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-1">
            <v-col cols="12">
              <label>Business Number: </label>
              <span>{{businessNumber}}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <div id="bl-more-actions">
            <v-btn text color="primary" id="bl-undo-btn" @click="emitUndo()">
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { BusinessLookupIF, BusinessLookupResultIF } from '@/interfaces'

enum States {
  INITIAL = 'initial',
  SEARCHING = 'searching',
  SHOW_RESULTS = 'show results',
  NO_RESULTS = 'no results',
  SUMMARY = 'summary'
}

@Component({})
export default class BusinessLookup extends Vue {
  /** Whether to show errors. */
  @Prop({ required: true })
  readonly showErrors: boolean

  /** The BusinessLookup object. */
  @Prop({ required: true })
  readonly businessLookup: BusinessLookupIF
  /** Class for BusinessLookup services. */

  @Prop({ required: true })
  readonly BusinessLookupServices: any
  /** Whether to display Change features. */

  @Prop({ default: false })
  readonly hasBusinessLookupChanges: boolean

  // enum for template
  readonly States = States

  // local variables
  private state = States.INITIAL

  private searchField = ''
  private searchResults: Array<BusinessLookupResultIF> = []
  private selectedBusiness: BusinessLookupResultIF = null

  /** The text field validation rules. */
  readonly businessLookupRules: Array<Function> = [
    v => !!v || 'Business is required'
  ]
  /** The identifier. */
  get identifier (): string {
    return this.businessLookup.identifier
  }
  /** The business name. */
  get businessName (): string {
    return this.businessLookup.name
  }
  /** The business number. */
  get businessNumber (): string {
    return this.businessLookup.bn || ''
  }
  /** Whether we have stored business data. */
  get haveBusiness (): boolean {
    return (!!this.identifier && !!this.businessName)
  }
  /** Whether this form is valid. */
  get isFormValid (): boolean {
    return (this.haveBusiness && this.state === States.SUMMARY)
  }

  /** Called when searchField property has changed. */
  @Watch('searchField')
  @Debounce(600)
  protected async onSearchField (): Promise<void> {
    // safety check
    if (this.searchField && this.searchField.length > 2) {
      this.state = States.SEARCHING
      this.searchResults = await this.BusinessLookupServices.search(this.searchField).catch(() => [])
      // display appropriate section
      this.state = (this.searchResults.length > 0) ? States.SHOW_RESULTS : States.NO_RESULTS
    } else {
      this.searchResults = []
      this.state = States.INITIAL
    }
  }
  /** Called when selectedBusiness property has changed. */
  @Watch('selectedBusiness')
  protected onSelectedBusiness (result: BusinessLookupResultIF): void {
    // safety check
    if (result) {
      // set store value
      this.setBusiness({
        identifier: result.identifier,
        name: result.name,
        bn: result.bn
      })
      this.selectedBusiness = null
    }
  }

  /** Called when haveBusiness property (which is based on this component's props) has changed. */
  @Watch('haveBusiness', { immediate: true })
  private onHaveBusinessChanged (val: boolean): void {
    this.state = val ? States.SUMMARY : States.INITIAL
  }
  /** Called when this form's validity has changed. */
  @Watch('isFormValid')
  private onIsFormValidChanged (val: boolean): void {
    this.emitValid(val)
  }
  /** Emits event to update the Business object. */
  @Emit('setBusiness')
  private setBusiness (val: BusinessLookupIF): void {}
  /** Emits undo event. */
  @Emit('undoBusiness')
  private emitUndo (): void {}
  /** Emits event to update this component's validity. */
  @Emit('valid')
  private emitValid (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}
.business-lookup-result {
  font-size: $px-14;
  color: $gray7;
  &:hover {
    background-color: $gray1;
    color: $app-blue;
  }
}
.result-identifier,
.result-name {
  cursor: pointer;
  font-size: $px-16;
}
#bl-more-actions {
  margin-right: -14px;
  white-space: nowrap;
  #bl-undo-btn {
    min-width: unset;
    float: right;
  }
}
.summary-block {
  label {
    font-weight: bold;
    color: $gray9;
  }
}
// Veutify overrides
::v-deep {
  .v-text-field .v-label {
    font-weight: normal;
  }
}
</style>
