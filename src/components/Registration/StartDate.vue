<template>
  <div id="start-date">
    <!-- EDIT SECTION -->
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4 pb-4">
        <label class="start-date-title title-label">Start Date</label>
      </v-col>
      <v-col cols="12" sm="9" id="start-date-selector">
        <date-picker
          id="date-picker"
          ref="startDateRef"
          title="Start Date"
          :nudgeRight="40"
          :nudgeTop="85"
          :initialValue="getRegistration.startDate"
          :minDate="startDateMinStr"
          :maxDate="startDateMaxStr"
          :inputRules="startDateRules"
          @emitDateSync="startDateHandler($event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'
import { DatePicker } from '@bcrs-shared-components/date-picker'
import { RuleHelpers } from '@/rules'
import { DateMixin } from '@/mixins'

@Component({
  components: {
    DatePicker
  }
})
export default class StartDate extends Mixins(DateMixin) {
  // Refs
  $refs!: {
    startDateRef: DatePicker
  }

  // Global actions
  @Action setRegistrationStartDate!: ActionBindingIF

  // Global getters
  @Getter getRegistration!: RegistrationStateIF
  @Getter getShowErrors!: boolean

  private dateText = ''

  /** The minimum start date that can be entered (Up to 2 years ago today). */
  private get startDateMin (): Date {
    const startDateMin = new Date(this.getCurrentJsDate)
    startDateMin.setFullYear(startDateMin.getFullYear() - 2)
    startDateMin.setHours(0, 0, 0) // Set time to 0 for accurate Date Rules comparison

    return startDateMin
  }

  /** The minimum start date string. */
  private get startDateMinStr (): string {
    return this.dateToYyyyMmDd(this.startDateMin)
  }

  /** The maximum start date that can be entered (Up to 90 days from today). */
  private get startDateMax (): Date {
    const startDateMax = new Date(this.getCurrentJsDate)
    startDateMax.setDate(startDateMax.getDay() + 90)
    return startDateMax
  }

  /** The maximum start date string. */
  private get startDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.startDateMax)
  }

  /** Validations rules for start date field. */
  get startDateRules (): Array<Function> {
    // apply rules when app validations are triggered
    if (this.getShowErrors) {
      return [
        (v: string) => !!v || 'Business start date is required',
        (v: string) =>
          RuleHelpers.DateRuleHelpers
            .isBetweenDates(this.startDateMin,
              this.startDateMax,
              v) ||
          `Date should be between ${this.dateToPacificDate(this.startDateMin, true)} and
         ${this.dateToPacificDate(this.startDateMax, true)}`
      ]
    }
  }

  private startDateHandler (dateString: string): void {
    this.dateText = dateString
    this.setRegistrationStartDate(dateString)
  }

  @Watch('getShowErrors')
  validateForm (): void {
    (this.$refs.startDateRef as any).validateForm()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.start-date-title {
  font-weight: bold;
  color: $gray9;
}

// remove extra space taken by error message
::v-deep .v-text-field__details {
  margin-bottom: -8px !important;
}
</style>
