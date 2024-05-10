<template>
  <div id="manual-business-info">
    <!-- inactive = ready to click link to start -->
    <template v-if="!active">
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <!-- empty column to line up with ExtraproRegistration label -->
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <div class="font-14 ml-3">
            Not extraprovincially registered in B.C.?
            &nbsp; &nbsp;
            <a @click="onClick()">Enter your business information manually</a>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <!-- Jurisdiction -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Jurisdiction</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          <Jurisdiction
            :showUsaJurisdictions="true"
            :initialValue="jurisdictionInitialVal"
            :errorMessages="jurisdictionErrorMessage"
            @change="onJurisdictionChange($event)"
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

      <!-- Identifying Number -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        />

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            id="business-name"
            v-model="business.identifier"
            filled
            label="Identifying Number"
            :rules="getShowErrors ? identifyingNumberRules : []"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>

      <!-- Business Name -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Business Name in Home Jurisdiction</label>
        </v-col>

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            id="business-name"
            v-model="business.legalName"
            filled
            label="Business Name in Home Jurisdiction"
            :rules="getShowErrors ? businessNameRules : []"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>

      <!-- Business Number-->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        />

        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            id="business-number"
            v-model="business.taxId"
            filled
            label="Business Number (Optional)"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>

      <!-- Incorporation Date -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        />

        <v-col
          cols="12"
          sm="7"
        >
          <DatePickerShared
            id="incorporation-date"
            title="Incorporation Date in Home Jurisdiction"
            :initialValue="getExistingBusinessInfo.incorporationDate"
            :inputRules="getShowErrors ? incorporationDateRules : []"
            @emitDateSync="startDateChanged($event)"
          />
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        />

        <v-col
          cols="12"
          sm="7"
        >
          <MessageBox color="gold">
            <strong>Important:</strong> Verify that this information matches exactly the current information
            in the home jurisdiction.
          </MessageBox>
        </v-col>
        <pre>{{ business }}</pre>
        <v-col
          cols="12"
          sm="2"
        >
          <!-- empty column to line up with Undo button above -->
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DateMixin } from '@/mixins'
import { isEqual } from 'lodash'
import { ExistingBusinessInfoIF } from '@/interfaces'
import MessageBox from '@/components/common/MessageBox.vue'
import { Jurisdiction } from '@bcrs-shared-components/jurisdiction'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'

@Component({
  components: {
    DatePickerShared,
    Jurisdiction,
    MessageBox
  }
})
export default class ManualBusinessInfo extends Mixins(DateMixin) {
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void

  // Local properties
  active = false
  business = {} as ExistingBusinessInfoIF
  jurisdiction = null
  dateText = ''
  jurisdictionErrorMessage = ''
  manualBusinessInfoValid = false

  /** Whether to show this component. */
  get showComponent (): boolean {
    return true
  }

  /** Whether we have a looked-up business. */
  get haveLookupBusiness (): boolean {
    return !isEqual(this.business, {})
  }

  mounted (): void {
    // get the business info object from the store or initialize it
    if (this.getExistingBusinessInfo) this.business = this.getExistingBusinessInfo

    // if mode is MANUAL, set this component to active (which hides the other component)
    if (this.business.mode === 'MANUAL') this.active = true
  }

  onClick (): void {
    this.active = true
  }

  get jurisdictionInitialVal (): any {
    let jur = {
      country: this.getExistingBusinessInfo.homeJurisdiction.country,
      region: this.getExistingBusinessInfo.homeJurisdiction.region
    }
    return jur
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.business = {} as unknown as ExistingBusinessInfoIF
    this.setExistingBusinessInfo(this.business)
    this.dateText = ''
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  onJurisdictionChange (jurisdiction: any): void {
    if (jurisdiction?.group === 0) {
      this.business.homeJurisdiction.country = JurisdictionLocation.CA
      this.business.homeJurisdiction.region = jurisdiction.value
    }

    if (jurisdiction?.group === 1) {
      this.business.homeJurisdiction.country = JurisdictionLocation.US
      this.business.homeJurisdiction.region = jurisdiction.value
    }

    if (jurisdiction?.group === 2) {
      this.business.homeJurisdiction.country = jurisdiction.value
      this.business.homeJurisdiction.region = ''
    }
  }

  startDateChanged (dateString: string): void {
    this.dateText = dateString
    this.business.incorporationDate = this.dateText
  }

  get identifyingNumberRules (): Array<(v: string) => boolean | string> {
    return [
      v => !!v || 'Identifying Number is required'
    ]
  }

  get businessNameRules (): Array<(v: string) => boolean | string> {
    return [
      v => !!v || 'Business Name is required'
    ]
  }

  get incorporationDateRules (): Array<(v: string) => boolean | string> {
    return [
      v => !!v || 'Incorporation Date is required'
    ]
  }

  private validatePage (): void {
    this.manualBusinessInfoValid = (
      !!this.jurisdiction &&
      !!this.business.identifier &&
      !!this.business.legalName &&
      !!this.business.incorporationDate
    )
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Home jurisdiction is required'
  }

  @Watch('business', { deep: true })
  private async onBusinessChanged (): Promise<void> {
    this.setExistingBusinessInfo(this.business)
    this.active = true
  }

  @Watch('manualBusinessInfoValid', { immediate: true })
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onComponentValid (val: boolean): void {}

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

// add whitespace between first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}
</style>
