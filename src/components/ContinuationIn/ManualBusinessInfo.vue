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
      <!-- Jurisdiction + clear button -->
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
        >
          <label>Jurisdiction</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="d-flex justify-space-between"
        >
          <Jurisdiction
            class="home-jurisdiction"
            :showUsaJurisdictions="true"
            label="Jurisdiction"
            :initialValue="business.homeJurisdiction"
            :errorMessages="jurisdictionErrorMessage"
            :showAppendIcon="false"
            @change="onJurisdictionChange($event)"
          />
          <v-tooltip
            top
            content-class="top-tooltip"
            transition="fade-transition"
          >
            <template #activator="{ on }">
              <!-- align clear button on top of jurisdiction component -->
              <v-btn
                class="clear-info-btn float-right mt-3 ml-n10 mr-1"
                color="primary"
                icon
                aria-label="Clear existing business information"
                @click="reset()"
                v-on="on"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            Clear existing business information.
          </v-tooltip>
        </v-col>
      </v-row>

      <v-divider class="mt-8" />

      <v-form
        ref="formRef"
        v-model="formValid"
        @submit.prevent
      >
        <!-- Identifying Number -->
        <v-row
          class="mt-8"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Business Information in Home Jurisdiction</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-text-field
              v-model.trim="business.homeIdentifier"
              class="identifying-number"
              filled
              hide-details="auto"
              label="Identifying Number"
              :rules="getShowErrors ? identifyingNumberRules : []"
            />
          </v-col>
        </v-row>

        <!-- Business Name in Home Jurisdiction -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-text-field
              v-model.trim="business.homeLegalName"
              class="business-name"
              filled
              hide-details="auto"
              label="Business Name in Home Jurisdiction"
              :rules="getShowErrors ? businessNameRules : []"
            />
          </v-col>
        </v-row>

        <!-- Business Number-->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <v-text-field
              v-model="business.taxId"
              v-mask="['#########']"
              class="business-number"
              filled
              hide-details="auto"
              label="Business Number (Optional)"
              hint="First 9 digits of the CRA Business Number if you have one"
              :rules="getShowErrors ? Rules.BusinessNumberRules : []"
            />
          </v-col>
        </v-row>

        <!-- Incorporation Date -->
        <v-row
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <DatePickerShared
              id="incorporation-date"
              ref="incorporationDateRef"
              title="Incorporation Date in Home Jurisdiction"
              :nudgeRight="40"
              :nudgeTop="85"
              :initialValue="getExistingBusinessInfo.homeIncorporationDate"
              :inputRules="getShowErrors ? incorporationDateRules : []"
              :maxDate="getCurrentDate"
              @emitDateSync="$set(business, 'homeIncorporationDate', $event)"
            />
          </v-col>
        </v-row>

        <!-- Upload Affidavit -->
        <v-row
          v-if="isContinuationInAffidavitRequired"
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Upload Affidavit</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <UploadAffidavit
              :business="business"
            />
          </v-col>
        </v-row>

        <!-- message box -->
        <v-row
          class="mt-8"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <MessageBox
              color="gold"
            >
              <strong>Important:</strong> Verify that this information matches exactly the current information
              in the home jurisdiction.
            </MessageBox>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { mask } from 'vue-the-mask'
import { useStore } from '@/store/store'
import { DateMixin } from '@/mixins'
import { ExistingBusinessInfoIF } from '@/interfaces'
import { Rules } from '@/rules'
import { VuetifyRuleFunction } from '@/types'
import MessageBox from '@/components/common/MessageBox.vue'
import { Jurisdiction } from '@bcrs-shared-components/jurisdiction'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'
import { CountriesProvincesMixin } from '@/mixins/'
import { FormIF } from '@bcrs-shared-components/interfaces'
import UploadAffidavit from './UploadAffidavit.vue'

@Component({
  components: {
    DatePickerShared,
    Jurisdiction,
    MessageBox,
    UploadAffidavit
  },
  directives: {
    mask
  }
})
export default class ManualBusinessInfo extends Mixins(CountriesProvincesMixin, DateMixin) {
  // Refs
  $refs!: {
    formRef: FormIF
    incorporationDateRef: DatePickerShared
  }

  readonly Rules = Rules

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isContinuationInAffidavitRequired!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void
  @Action(useStore) setHaveChanges!: (x: boolean) => void

  // Local properties
  active = false
  business = {} as ExistingBusinessInfoIF
  formValid = false

  readonly identifyingNumberRules: Array<VuetifyRuleFunction> = [
    (v) => !!v?.trim() || 'Identifying Number is required',
    (v) => (v && v.trim().length <= 50) || 'Cannot exceed 50 characters'
  ]

  readonly businessNameRules: Array<VuetifyRuleFunction> = [
    (v) => !!v?.trim() || 'Business Name is required',
    (v) => (v && v.trim().length <= 1000) || 'Cannot exceed 1000 characters'
  ]

  get incorporationDateRules (): Array<VuetifyRuleFunction> {
    return [
      (v) => !!v || 'Incorporation Date is required',
      () => (this.business.homeIncorporationDate <= this.getCurrentDate) ||
        'Incorporation Date cannot be in the future'
    ]
  }

  get jurisdictionErrorMessage (): string {
    return (this.getShowErrors && !this.business.homeJurisdiction) ? 'Jurisdiction is required' : ''
  }

  /** Called when this component is mounted. */
  mounted (): void {
    // point business variable to Existing Business Info object from the store, if it exists
    if (this.getExistingBusinessInfo) {
      this.business = this.getExistingBusinessInfo
    }

    // if mode is MANUAL, set this component to active (which hides the other component)
    if (this.business.mode === 'MANUAL') this.active = true
  }

  /** Called when user clicks to enter business info manually. */
  onClick (): void {
    this.business.mode = 'MANUAL'
    this.active = true
  }

  /** Resets this component back to its initial state. */
  reset () {
    this.business = {} as ExistingBusinessInfoIF
    this.setExistingBusinessInfo(this.business)
    // set this component to inactive (which shows the other component)
    this.active = false
  }

  /** Called when Jurisdiction value has changed. */
  onJurisdictionChange (jurisdiction: any): void {
    if (jurisdiction?.group === 0) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: JurisdictionLocation.CA,
        region: (jurisdiction.value === JurisdictionLocation.FD) ? 'FEDERAL' : jurisdiction.value
      })
    }

    if (jurisdiction?.group === 1) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: JurisdictionLocation.US,
        region: jurisdiction.value
      })
    }

    if (jurisdiction?.group === 2) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'homeJurisdiction', {
        country: jurisdiction.value,
        region: ''
      })
    }
  }

  /** Validates the form and other components. */
  @Watch('active')
  @Watch('getShowErrors')
  private async onGetShowErrors (): Promise<void> {
    if (this.active && this.getShowErrors) {
      // wait for form to finish rendering
      await this.$nextTick()
      // validate the form and our custom component that doesn't support form validation
      this.$refs.formRef.validate()
      this.$refs.incorporationDateRef.validateForm()
    }
  }

  /** Emits form validity. */
  @Watch('business', { deep: true })
  @Watch('formValid')
  @Watch('getShowErrors')
  @Emit('valid')
  private onComponentValid (): boolean {
    // if we're here it's because the user has changed something
    this.setHaveChanges(true)

    // this form is valid if we have the home jurisdiction (custom component)
    // and we have the home incorporation date (custom component)
    // and we have the affidavit file, if required (custom component)
    // and the other form (Vuetify) components are valid
    // show tick mark only when user visits Review Page
    if (this.getShowErrors) {
      return (
        !!this.business.homeJurisdiction &&
      !!this.business.homeIncorporationDate &&
      (!this.isContinuationInAffidavitRequired || !!this.business.affidavitFileKey) &&
      this.formValid
      )
    }
    return false
  }

  /** Emit whether we have become active or inactive. */
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

#incorporation-date {
  // show pointer on hover
  :deep(.v-input__slot) {
    pointer-events: auto;
    cursor: pointer;
  }

  // set icon color
  :deep(.v-input__icon--append .v-icon) {
    color: $app-blue !important;
  }
}
</style>
