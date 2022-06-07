<template>
  <div id="business-lookup">
    <div v-if="state !== States.SUMMARY">
      <v-autocomplete
        filled
        no-filter
        autocomplete="chrome-off"
        class="mt-5"
        append-icon=""
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
          <v-row class="business-lookup-result">
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

    <div v-if="state === States.SUMMARY && haveBusiness"
      class="summary-block d-flex justify-space-between align-center">
      <v-row no-gutters>
        <v-col cols="9">
          <v-row no-gutters>
            <v-col cols="12" sm="3">
              <label>Name</label>
            </v-col>
            <v-col cols="12" sm="9">
              <span>{{businessName}}</span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" sm="3">
              <label>Incorporation Number</label>
            </v-col>
            <v-col cols="12" sm="9">
              <span>{{identifier}}</span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" sm="3">
              <label>Business Number</label>
            </v-col>
            <v-col cols="12" sm="9">
              <span>{{businessNumber}}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-btn v-if="!hasBusinessLookupChanges" text color="primary" id="bl-change-btn" @click="onChangeClicked()">
            <v-icon small>mdi-pencil</v-icon>
            <span>Change</span>
          </v-btn>

          <div v-else id="bl-more-actions">
            <v-btn text color="primary" id="bl-undo-btn" @click="emitUndo()">
              <v-icon small>mdi-undo</v-icon>
              <span>Undo</span>
            </v-btn>
            <v-menu offset-y left nudge-bottom="4" v-model="dropdown">
              <template v-slot:activator="{ on }">
                <v-btn text small color="primary" id="bl-menu-btn" v-on="on">
                  <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                </v-btn>
              </template>
              <v-btn text color="primary" id="bl-more-changes-btn" class="py-5"
                @click="onChangeClicked(); dropdown = false">
                <v-icon small color="primary">mdi-pencil</v-icon>Change</v-btn>
            </v-menu>
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

  /** V-model for dropdown menu. */
  private dropdown: boolean = null
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
    }
  }
  /** Called when user has clicked the Cancel button. */
  protected onCancelClicked (): void {
    // if we have stored business data then display summary
    // otherwise go back to INITIAL state
    this.state = this.haveBusiness ? States.SUMMARY : States.INITIAL
  }
  /** Called when user has clicked the Change button. */
  protected onChangeClicked (): void {
    // set search to current identifier
    this.searchField = this.identifier
    this.state = States.INITIAL
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
#bl-change-btn {
  margin-right: -14px;
}
#bl-more-actions {
  margin-right: -14px;
  white-space: nowrap;
  #bl-undo-btn {
    min-width: unset;
    border-right: 1px solid $gray1;
  }
}
#result-list {
  background-color: $gray1;
  max-height: 650px;
  overflow-y: auto;
}
.summary-block {
  margin-top: -6px; // compensate for Change button pushing this col down
}
// Veutify overrides
::v-deep {
  .v-text-field .v-label {
    font-weight: normal;
  }
}
</style>
