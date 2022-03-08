<template>
  <div
    id="nature-of-business"
    class="ml-n6 pl-6 rounded-0"
    :class="{ 'invalid-section': showErrors && !isFormValid }"
  >
    <v-row>
      <v-col cols="12" sm="2">
        <label>
          <strong>Nature of Business</strong>
        </label>
      </v-col>

      <v-col cols="12" sm="10">
        <template v-if="state !== States.SUMMARY">
          <p>
            Enter one or more keywords that describe the primary nature of your business or enter
            the six-digit NAICS code. Learn more by visiting the
            <a
              href="https://www.statcan.gc.ca/en/subjects/standard/naics/2022/v1/index"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Statistics Canada website</span>
            </a>
            <v-icon small color="primary">mdi-open-in-new</v-icon>.
          </p>

          <v-text-field
            filled
            persistent-hint
            autocomplete="chrome-off"
            label="Keywords or Six-Digit NAICS"
            hint="Example: landscaping, grocery, care repair, etc."
            v-model="searchField"
            :name="Math.random()"
            :rules="showErrors ? natureOfBusinessRules: []"
            @keydown.enter="onSearchClicked()"
          >
            <template #append>
              <v-btn
                id="btn-search"
                color="primary"
                depressed
                :loading="state === States.SEARCHING"
                @click="onSearchClicked()"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </template>

        <div v-if="state === States.SHOW_RESULTS" class="mt-6">
          <p>
            Select an option below that best describes the nature of your business:
          </p>
          <div id="result-list">
            <NaicsResult
              v-for="(result, index) in searchResults"
              :key="index"
              :result="result"
              @click="onResultClicked(result)"
            />
            <div id="naics-help-panel" class="pa-8">
              <NaicsHelpText  />
            </div>
          </div>
          <!-- *** TODO: implement this as per comps -->
          <v-btn large outlined color="primary" class="float-right mt-8" @click="onCancelClicked()">Cancel</v-btn>
        </div>

        <div v-if="state === States.NO_RESULTS" class="mt-6">
          <p class="font-weight-bold">No results found.</p>
          <NaicsHelpText />
          <v-btn large outlined color="primary" class="float-right mt-8" @click="onCancelClicked()">Cancel</v-btn>
        </div>

        <div v-if="state === States.SUMMARY" class="d-flex justify-space-between align-center">
          <span>{{ natureOfBusiness }}</span>
          <v-btn large outlined color="primary" @click="onChangeClicked()">Change</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import NaicsHelpText from './NaicsHelpText.vue'
import NaicsResult from './NaicsResult.vue'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF, EmptyRegistrationNaics, RegistrationStateIF } from '@/interfaces'
import { NaicsServices } from '@/services'

enum States {
  INITIAL,
  SEARCHING,
  SHOW_RESULTS,
  NO_RESULTS,
  SUMMARY
}

@Component({
  components: { NaicsHelpText, NaicsResult }
})
export default class NatureOfBusiness extends Mixins(CommonMixin) {
  /** Whether to show errors. */
  @Prop({ required: true })
  readonly showErrors!: boolean

  @Getter getRegistration!: RegistrationStateIF

  @Action setRegistrationBusinessAddress!: ActionBindingIF
  @Action setRegistrationNaics!: ActionBindingIF

  // enum for template
  readonly States = States

  // local variables
  private state = States.INITIAL
  private searchField = ''
  private searchResults = []

  // validation rules
  readonly natureOfBusinessRules: Array<Function> = [
    v => !!v || 'Nature of Business is required'
  ]

  get natureOfBusiness (): string {
    return this.getRegistration.naics.naicsDescription
  }

  get isFormValid (): boolean {
    return (!!this.natureOfBusiness && this.state === States.SUMMARY)
  }

  created (): void {
    // on init, display summary if NOB exists
    if (this.natureOfBusiness) {
      this.state = States.SUMMARY
    }
  }

  async onSearchClicked (): Promise<void> {
    // remove extra whitespace
    this.searchField = this.searchField.trim().replaceAll(/\s+/g, ' ')

    // safety check
    if (this.searchField) {
      this.state = States.SEARCHING

      this.searchResults = await NaicsServices.search(this.searchField).catch(() => [])

      this.state = (this.searchResults.length > 0) ? States.SHOW_RESULTS : States.NO_RESULTS
    }
  }

  onResultClicked (result: any): void {
    // safety check
    if (result) {
      // set store value
      this.setRegistrationNaics({
        naicsCode: result.code,
        naicsDescription: result.classTitle
      })

      this.state = States.SUMMARY
    }
  }

  onCancelClicked (): void {
    // reset search
    this.searchField = ''

    this.state = States.INITIAL
  }

  onChangeClicked (): void {
    // clear store value
    this.setRegistrationNaics(EmptyRegistrationNaics)

    this.state = States.INITIAL
  }

  @Watch('isFormValid')
  private onIsFormValidChanged (val: boolean): void {
    this.emitValid(val)
  }

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

#btn-search {
  min-width: unset;
  margin-top: -6px;
  padding: 8px;
}

#result-list {
  max-height: 650px;
  overflow-y: scroll;

  #naics-help-panel {
    background-color: $gray1;

    #naics-help-text {
      margin-left: 10rem;
    }
  }
}

</style>
