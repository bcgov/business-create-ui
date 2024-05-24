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
      <!-- Jurisdiction + Undo button -->
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
            class="home-jurisdiction"
            :showUsaJurisdictions="true"
            label="Jurisdiction"
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
        ref="manualFormRef"
        v-model="formValid"
        @submit.prevent
      >
        <!-- Identifying Number -->
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
            sm="7"
          >
            <v-text-field
              v-model="business.homeIdentifier"
              class="identifying-number"
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
          class="mt-6"
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
              v-model="business.homeLegalName"
              class="business-name"
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
            sm="7"
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

          <v-col
            cols="12"
            sm="2"
          >
            <!-- empty column to line up with Undo button above -->
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
            sm="7"
          >
            <DatePickerShared
              id="incorporation-date"
              ref="incorporationDateRef"
              title="Incorporation Date in Home Jurisdiction"
              :nudgeRight="40"
              :nudgeTop="85"
              :persistentHint="true"
              :initialValue="getExistingBusinessInfo.homeIncorporationDate"
              :inputRules="getShowErrors ? incorporationDateRules : []"
              :maxDate="getCurrentDate"
              @emitDateSync="$set(business, 'homeIncorporationDate', $event)"
            />
          </v-col>

          <v-col
            cols="12"
            sm="2"
          >
            <!-- empty column to line up with Undo button above -->
          </v-col>
        </v-row>

        <!-- message box -->
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <!-- empty column -->
          </v-col>

          <v-col
            cols="12"
            sm="7"
          >
            <MessageBox
              color="gold"
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

@Component({
  components: {
    DatePickerShared,
    Jurisdiction,
    MessageBox
  },
  directives: {
    mask
  }
})
export default class ManualBusinessInfo extends Mixins(CountriesProvincesMixin, DateMixin) {
  // Refs
  $refs!: {
    manualFormRef: FormIF
    incorporationDateRef: DatePickerShared
  }

  readonly Rules = Rules

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getExistingBusinessInfo!: ExistingBusinessInfoIF
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setExistingBusinessInfo!: (x: ExistingBusinessInfoIF) => void

  // Local properties
  active = false
  business = {} as ExistingBusinessInfoIF
  formValid = false

  readonly identifyingNumberRules: Array<VuetifyRuleFunction> = [
    (v) => !!v || 'Identifying Number is required'
  ]

  readonly businessNameRules: Array<VuetifyRuleFunction> = [
    (v) => !!v || 'Business Name is required',
    (v) => (v && v.length <= 1000) || 'Cannot exceed 1000 characters'
  ]

  readonly incorporationDateRules: Array<VuetifyRuleFunction> = [
    (v) => !!v || 'Incorporation Date is required'
  ]

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

  /** Jurisdiction initial value for draft. */
  get jurisdictionInitialVal (): any {
    const country = this.getExistingBusinessInfo ? this.getExistingBusinessInfo.homeJurisdiction?.country : ''
    let region = ''

    if (this.getExistingBusinessInfo.homeJurisdiction) {
      if (this.getExistingBusinessInfo.homeJurisdiction?.region === 'FEDERAL') {
        region = JurisdictionLocation.FD
      } else {
        region = this.getExistingBusinessInfo ? this.getExistingBusinessInfo.homeJurisdiction?.region : ''
      }
    }

    if (country && region) return { country, region }

    return null
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
      await this.$nextTick() // wait for form to finish rendering
      this.$refs.manualFormRef?.validate()
      this.$refs.incorporationDateRef?.validateForm()
    }
  }

  /** Emits form validity. */
  @Watch('business.homeJurisdiction')
  @Watch('business.homeIncorporationDate')
  @Watch('formValid')
  @Emit('valid')
  private onComponentValid (): boolean {
    // this form is valid if we have the home jurisdiction (custom component)
    // and we have the home incorporation date (custom component)
    // and the other form (Vuetify) components are valid
    return (
      !!this.business.homeJurisdiction &&
      !!this.business.homeIncorporationDate &&
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
</style>
