<template>
  <div id="start-date">
    <!-- EDIT SECTION -->
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label class="start-date-title title-label">Start Date</label>
      </v-col>
      <v-col cols="12" sm="9" class="pt-4 pt-sm-0" id="start-date-selector">
        <DatePickerShared
          id="date-picker"
          ref="startDateRef"
          title="Start Date"
          :nudgeRight="40"
          :nudgeTop="85"
          :initialValue="getRegistration.startDate"
          :minDate="startDateMinStr"
          :maxDate="startDateMaxStr"
          :inputRules="getShowErrors ? startDateRules : []"
          @emitDateSync="startDateHandler($event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { RuleHelpers } from '@/rules'
import { DateMixin } from '@/mixins'
import { VuetifyRuleFunction } from '@/types'

@Component({
  components: {
    DatePickerShared
  }
})
export default class StartDate extends Mixins(DateMixin) {
  // Refs
  $refs!: {
    startDateRef: DatePickerShared
  }

  // Global actions
  @Action setRegistrationStartDate!: ActionBindingIF

  // Global getters
  @Getter getRegistration!: RegistrationStateIF
  @Getter getShowErrors!: boolean

  protected dateText = ''

  /** The minimum start date that can be entered (Up to 2 years ago today). */
  get startDateMin (): Date {
    const startDateMin = new Date(this.getCurrentJsDate) // make a copy
    startDateMin.setFullYear(startDateMin.getFullYear() - 2)
    startDateMin.setHours(0, 0, 0) // Set time to 0 for accurate Date Rules comparison

    return startDateMin
  }

  /** The minimum start date string. */
  get startDateMinStr (): string {
    return this.dateToYyyyMmDd(this.startDateMin)
  }

  /** The maximum start date that can be entered (Up to 90 days from today). */
  get startDateMax (): Date {
    const startDateMax = new Date(this.getCurrentJsDate) // make a copy
    startDateMax.setDate(startDateMax.getDay() + 90)
    return startDateMax
  }

  /** The maximum start date string. */
  get startDateMaxStr (): string {
    return this.dateToYyyyMmDd(this.startDateMax)
  }

  /** Validations rules for start date field. */
  get startDateRules (): Array<VuetifyRuleFunction> {
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

  protected startDateHandler (dateString: string): void {
    this.dateText = dateString
    this.setRegistrationStartDate(dateString)
    this.emitValid()
  }

  @Watch('getShowErrors')
  private validateForm (): void {
    (this.$refs.startDateRef as any).validateForm()
  }

  @Emit('valid')
  private emitValid (): boolean {
    return !!this.dateText
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
:deep(.v-text-field__details) {
  margin-bottom: -8px !important;
}
</style>
