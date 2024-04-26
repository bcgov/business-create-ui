<template>
  <div id="extrapro-registration">
    <!-- inactive = ready to search to start -->
    <template v-if="!active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <ExtraproBusinessLookup
            class="mr-2"
            @business="setBusiness($event)"
          />
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Extraprovincial Registration in B.C.</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            class="identifier-textfield"
            filled
            hide-details
            label="B.C. Extraprovincial Incorporation Number"
            readonly
            :value="identifier"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <v-btn
            id="undo-button"
            class="float-sm-right float-none"
            text
            color="primary"
            @click="reset()"
          >
            <v-icon small>
              mdi-undo
            </v-icon>
            <span>Undo</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        class="mt-8"
        no-gutters
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label>Business Information</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <p id="jurisdiction">
            <label>Jurisdiction: </label>
            <span>{{ jurisdiction || '[Unknown]' }}</span>
          </p>

          <p id="business-name">
            <label>Business Name: </label>
            <span>{{ businessName }}</span>
          </p>

          <p id="business-number">
            <label>Business Number: </label>
            <span>{{ businessNumber || '' }}</span>
          </p>

          <p id="incorporation-date">
            <label>Incorporation Date: </label>
            <span>{{ incorporationDate || '[Unknown]' }}</span>
          </p>
        </v-col>
      </v-row>

      <template v-if="isBusinessActive">
        <!-- ** Upload affidavit goes here ** -->

        <v-row
          class="mt-2"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column to line up with Business Information above -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="gold">
              <strong>Important:</strong> Verify that this information matches exactly the current information
              in the home jurisdiction.
            </MessageBox>
          </v-col>
        </v-row>

        <v-row
          class="mt-8"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Confirmation</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-checkbox
              id="extrapro-registration-checkbox"
              v-model="checkbox"
              class="pt-0 mt-0"
              hide-details
              :label="checkboxLabel"
            />
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row
          class="mt-2"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column to line up with Business Information above -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox color="red">
              <strong>Important:</strong> This extraprovincial registration is historical.
              Please contact BC Registries staff.
            </MessageBox>

            <RegistriesContactInfo class="mt-6" />
          </v-col>
        </v-row>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { isEqual } from 'lodash'
import { getName } from 'country-list'
import { BusinessLookupResultIF, EmptyBusinessLookup } from '@/interfaces'
import ExtraproBusinessLookup from './ExtraproBusinessLookup.vue'
import MessageBox from '@/components/common/MessageBox.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

@Component({
  components: {
    ExtraproBusinessLookup,
    MessageBox,
    RegistriesContactInfo
  }
})
export default class ExtraproRegistration extends Vue {
  @Getter(useStore) getContinuationInBusinessInfo!: any
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setContinuationInBusinessInfo!: (x: any) => void

  // Local properties
  active = false
  business = null // FUTURE: update BusinessLookupResultIF with new properties
  checkbox = false

  readonly checkboxLabel = 'I understand and acknowledge that the extraprovincial registration of this' +
    ' business will be cancelled and made historical in the B.C. Registry once the continuation in' +
    ' application has been submitted.'

  /** Whether we have a looked-up business. */
  get haveLookupBusiness (): boolean {
    return !isEqual(this.business, EmptyBusinessLookup)
  }

  /** The identifier. */
  get identifier (): string {
    return this.business.identifier
  }

  /** The jurisdiction. */
  get jurisdiction (): string {
    const hj = this.business.homeJurisdiction
    if (hj?.country) {
      const country = getName(hj.country)
      const region = (hj.region === 'FEDERAL' ? 'Federal' : hj.region)
      if (region) return `${region}, ${country}`
      return country
    }
    return null
  }

  /** The business name. */
  get businessName (): string {
    return this.business.name
  }

  /** The business number. */
  get businessNumber (): string {
    return this.business.bn
  }

  /** The incorporation date. */
  get incorporationDate (): string {
    // FUTURE: format date if needed
    return this.business.registrationDate
  }

  /** Whether business is Active (otherwise it's Historical). */
  get isBusinessActive (): boolean {
    return (this.business.status === 'ACTIVE')
  }

  mounted (): void {
    // get the business info object from the store or initialize it
    this.business = this.getContinuationInBusinessInfo || { ...EmptyBusinessLookup }

    // if mode is LOOKUP, set this component to active (which hides the other component)
    if (this.business.mode === 'LOOKUP') this.active = true
  }

  setBusiness (business: BusinessLookupResultIF) {
    this.business = { ...business } // for reactivity
    this.business.mode = 'LOOKUP'
    this.setContinuationInBusinessInfo(this.business)
    this.active = true
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.business = { ...EmptyBusinessLookup }
    this.setContinuationInBusinessInfo(this.business)
    // set this component to inactive (which shows the other component)
    this.active = false
    this.checkbox = false
  }

  // *** TODO: add watchers for jurisdiction and affidavit
  @Watch('business')
  @Watch('checkbox')
  @Emit('valid')
  private onComponentValid (): boolean {
    // this component is active if we have an active business
    return (this.haveLookupBusiness && this.isBusinessActive && this.checkbox)
  }

  @Watch('active', { immediate: true })
  @Emit('active')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onActiveChanged (val: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// set style for all root labels
label {
  font-weight: bold;
  color: $gray9;
}

// add whitespace between the first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}

// disable the clickable v-textfield label
:deep(.identifier-textfield label) {
  pointer-events: none;
}

// raise the checkbox input to align with the label
:deep(.v-input--checkbox .v-input--selection-controls__input) {
  margin-top: -1rem;
}

// style the checkbox label
:deep(.v-input--checkbox label) {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}
</style>
