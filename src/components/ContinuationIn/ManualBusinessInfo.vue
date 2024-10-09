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
          <p class="font-14 ml-3 mb-1">
            Not extraprovincially registered in B.C.?<br>
          </p>
          <a
            class="font-weight-bold text-decoration-underline font-14 ml-3"
            @click="onClick()"
          >
            Enter your business information manually
          </a>
        </v-col>
      </v-row>
    </template>

    <!-- active = display/edit mode -->
    <template v-if="active">
      <v-form
        ref="formRef"
        v-model="formValid"
        @submit.prevent
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <label>Previous Jurisdiction Information</label>
            <p class="mt-2 font-15">
              The legal authority or region where your business was originally registered or where it
              previously operated.
            </p>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <!-- message box -->
            <MessageBox color="gold">
              <strong>Important:</strong> Make sure this information is identical to the current information
              in your previous jurisdiction.
            </MessageBox>

            <!-- Previous Jurisdiction + clear button -->
            <div class="d-flex justify-space-between mt-6">
              <Jurisdiction
                class="previous-jurisdiction"
                :showUsaJurisdictions="true"
                label="Previous Jurisdiction"
                :initialValue="business.previousJurisdiction"
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
                    aria-label="Clear previous business information"
                    @click="reset()"
                    v-on="on"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                Clear previous business information.
              </v-tooltip>
            </div>

            <!-- Identifying Number -->
            <v-text-field
              v-model.trim="business.prevIncorporationNumber"
              class="incorporation-number mt-6"
              filled
              persistent-hint
              label="Identifying Number"
              hint="This number identifies your business in its previous jurisdiction."
              :rules="getShowErrors ? identifyingNumberRules : []"
            />

            <!-- Business Name in Previous Jurisdiction -->
            <v-text-field
              v-model.trim="business.prevBusinessName"
              class="business-name mt-4"
              filled
              hide-details="auto"
              label="Business Name in Previous Jurisdiction"
              :rules="getShowErrors ? businessNameRules : []"
            />

            <!-- Business Number-->
            <v-text-field
              v-model="business.businessNumber"
              v-mask="['#########']"
              class="business-number mt-6"
              filled
              persistent-hint
              label="Business Number (Optional)"
              hint="First 9 digits of the CRA Business Number if you have one"
              :rules="getShowErrors ? Rules.BusinessNumberRules : []"
            />

            <!-- Incorporation Date -->
            <DatePickerShared
              id="incorporation-date"
              ref="incorporationDateRef"
              class="mt-4 mb-n1"
              title="Date of Incorporation"
              :nudgeRight="40"
              :nudgeTop="85"
              hint="Date of Incorporation, Continuation or Amalgamation in previous jurisdiction"
              :persistentHint="true"
              :initialValue="getExistingBusinessInfo.prevIncorporationDate"
              :inputRules="getShowErrors ? incorporationDateRules : []"
              :maxDate="getCurrentDate"
              @emitDateSync="$set(business, 'prevIncorporationDate', $event)"
            />
          </v-col>
        </v-row>

        <!-- Alberta Unlimited Liability Corporation Information -->
        <v-row
          v-if="isContinuationInAffidavitRequired"
          class="mt-6"
          no-gutters
        >
          <v-col
            cols="12"
            sm="3"
          >
            <label>Alberta Unlimited Liability Corporation Information</label>
          </v-col>

          <v-col
            cols="12"
            sm="9"
          >
            <UploadAffidavit
              :business="business"
              @valid="affidavitValid = $event"
            />
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
  affidavitValid = false

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
      () => (this.business.prevIncorporationDate <= this.getCurrentDate) ||
        'Incorporation Date cannot be in the future'
    ]
  }

  get jurisdictionErrorMessage (): string {
    return (this.getShowErrors && !this.business.previousJurisdiction) ? 'Jurisdiction is required' : ''
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
      this.$set(this.business, 'previousJurisdiction', {
        country: JurisdictionLocation.CA,
        region: (jurisdiction.value === JurisdictionLocation.FD) ? 'FEDERAL' : jurisdiction.value
      })
    }

    if (jurisdiction?.group === 1) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'previousJurisdiction', {
        country: JurisdictionLocation.US,
        region: jurisdiction.value
      })
    }

    if (jurisdiction?.group === 2) {
      // set property reactively (in case it was null)
      this.$set(this.business, 'previousJurisdiction', {
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
  @Watch('affidavitValid')
  @Watch('getShowErrors')
  @Emit('valid')
  private onComponentValid (): boolean {
    // if we're here it's because the user has changed something
    this.setHaveChanges(true)

    // this form is valid if we have the previous jurisdiction (custom component)
    // and we have the incorporation date (custom component)
    // and we have the affidavit file, if required (custom component)
    // and the other form (Vuetify) components are valid
    // show tick mark only when user visits Review Page
    return (
      this.getShowErrors &&
      !!this.business.previousJurisdiction &&
      !!this.business.prevIncorporationDate &&
      (!this.isContinuationInAffidavitRequired || this.affidavitValid) &&
      this.formValid
    )
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
