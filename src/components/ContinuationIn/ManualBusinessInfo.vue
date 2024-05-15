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
          <div
            class="font-14 ml-3"
          >
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
            class="mb-n3"
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
      <v-form
        v-if="jurisdiction && !isMrasJurisdiction"
        ref="manualFormRef"
        lazy-validation
        @submit.prevent
      >
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
              hide-details="auto"
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
        <v-row
          class="mt-4"
          no-gutters
        >
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
              hide-details="auto"
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
        <v-row
          class="mt-4"
          no-gutters
        >
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
              hide-details="auto"
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
        <v-row
          class="mt-4"
          no-gutters
        >
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
              ref="incorporationDateRef"
              title="Incorporation Date in Home Jurisdiction"
              :nudgeRight="40"
              :nudgeTop="85"
              :initialValue="getExistingBusinessInfo.incorporationDate"
              :inputRules="getShowErrors ? incorporationDateRules : []"
              :maxDate="getCurrentDate"
              @emitDateSync="business.incorporationDate = $event"
            />
          </v-col>

          <v-col
            cols="12"
            sm="2"
          >
            <!-- empty column to line up with Undo button above -->
          </v-col>
        </v-row>

        <v-row
          class="mt-4 hide-details"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          />

          <v-col
            cols="12"
            sm="7"
          >
            <MessageBox
              color="gold"
              class="mt-n6"
            >
              <strong>Important:</strong> Verify that this information matches exactly the current information
              in the home jurisdiction.
            </MessageBox>
          </v-col>
          <v-col
            cols="12"
            sm="2"
          >
            <!-- empty column to line up with Undo button above -->
          </v-col>
        </v-row>
      </v-form>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { DateMixin } from '@/mixins'
import { cloneDeep, isEqual } from 'lodash'
import { EmptyBusinessLookup, EmptyExistingBusinessInfoIF, ExistingBusinessInfoIF } from '@/interfaces'
import MessageBox from '@/components/common/MessageBox.vue'
import { Jurisdiction } from '@bcrs-shared-components/jurisdiction'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'
import { CountriesProvincesMixin } from '@/mixins/'
import { FormIF } from '@bcrs-shared-components/interfaces'
import { MrasJurisdictions } from '@bcrs-shared-components/jurisdiction/list-data'

@Component({
  components: {
    DatePickerShared,
    Jurisdiction,
    MessageBox
  }
})
export default class ManualBusinessInfo extends Mixins(CountriesProvincesMixin, DateMixin) {
  // Refs
  $refs!: {
    manualFormRef: FormIF
    incorporationDateRef: DatePickerShared
  }

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void
  @Action(useStore) setShowErrors!: (x: boolean) => void

  // Local properties
  active = false
  businessLookup = null
  business = {} as ExistingBusinessInfoIF
  jurisdiction = null
  isMrasJurisdiction = false
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
    this.isMrasJurisdiction = false
    this.jurisdiction = null
    this.business = cloneDeep(EmptyExistingBusinessInfoIF)
    this.active = true
  }

  /** Jurisdiction initial value for draft. */
  get jurisdictionInitialVal (): any {
    let country = this.getExistingBusinessInfo ? this.getExistingBusinessInfo.homeJurisdiction?.country : ''
    let regions
    let region = ''
    let jurisdictionText = ''
    let jur

    if (this.getExistingBusinessInfo.homeJurisdiction) {
      if (this.getExistingBusinessInfo.homeJurisdiction?.region === 'Federal') {
        region = JurisdictionLocation.FD
      } else {
        region = this.getExistingBusinessInfo ? this.getExistingBusinessInfo.homeJurisdiction?.region : ''
      }
    }

    if (country && region) {
      jur = {
        country: country,
        region: region
      }

      // set local jurisdiction property
      this.jurisdiction = jur || ''

      regions = this.getCountryRegions(country) as any[]
      jurisdictionText = regions.find(p => p.short === region).name

      // set local property based on jurisdiction value
      this.isMrasJurisdiction = MrasJurisdictions.includes(jurisdictionText.toLowerCase())
    }

    return jur
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.businessLookup = { ...EmptyBusinessLookup }
    this.setExistingBusinessInfo(this.businessLookup)
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  /** When Jurisdiction value changes */
  onJurisdictionChange (jurisdiction: any): void {
    this.jurisdiction = jurisdiction
    this.isMrasJurisdiction = MrasJurisdictions.includes(
      this.jurisdiction?.text.toLowerCase()
    )
    if (jurisdiction?.group === 0) {
      this.business.homeJurisdiction.country = JurisdictionLocation.CA
      if (jurisdiction.value === JurisdictionLocation.FD) {
        this.business.homeJurisdiction.region = 'FEDERAL'
      } else {
        this.business.homeJurisdiction.region = jurisdiction.value
      }
    }

    if (jurisdiction?.group === 1) {
      this.business.homeJurisdiction.country = JurisdictionLocation.US
      this.business.homeJurisdiction.region = jurisdiction.value
    }

    if (jurisdiction?.group === 2) {
      this.business.homeJurisdiction.country = jurisdiction.value
      this.business.homeJurisdiction.region = ''
    }

    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Home jurisdiction is required'
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

  @Watch('business', { deep: true })
  private async onBusinessChanged (): Promise<void> {
    this.setExistingBusinessInfo(this.business)
    this.active = true
  }

  @Watch('getShowErrors')
  @Watch('business.homeJurisdiction')
  @Watch('business.incorporationDate')
  private onShowErrors (): void {
    if (!this.jurisdiction && this.getShowErrors) {
      this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Home jurisdiction is required'
    }

    if (this.jurisdiction && !this.isMrasJurisdiction && this.getShowErrors) {
      this.$refs.manualFormRef.validate()
      this.$refs.incorporationDateRef.validateForm()
    }
  }

  @Watch('business', { deep: true })
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onComponentValid (val: boolean): boolean {
    return (
      !!this.business.homeJurisdiction &&
      !!this.business.identifier &&
      !!this.business.legalName &&
      !!this.business.incorporationDate
    )
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

// add whitespace between first and second columns
.col-sm-3 {
  padding-right: 1rem !important;
}
</style>
