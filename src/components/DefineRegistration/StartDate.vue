<template>
  <v-card flat class="rounded-4 py-1">
    <div class="section-container step-container">
      <v-row no-gutters>
        <v-col cols="12" md="2" lg="2">
          <label>Start Date</label>
        </v-col>
        <v-col cols="12" md="10" lg="10" id="start-date-selector" class="pl-8">
          <date-picker
            ref="startDateRef"
            title="Start Date"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="null"
            :minDate="startDateMinStr"
            :maxDate="startDateMaxStr"
            :inputRules="startDateRules"
            @emitDateSync="setRegistrationStartDate($event)"
          />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'

// Shared Components
import { DatePicker } from '@bcrs-shared-components/date-picker'
import { RuleHelpers } from '@/rules'
import { DateMixin } from '@/mixins'

@Component({
  components: {
    DatePicker
  }
})
export default class StartDate extends Mixins(DateMixin) {
  // Global actions
  @Action setRegistrationStartDate!: ActionBindingIF

  /** The minimum start date that can be entered (Up to 2 years ago today). */
  private get startDateMin (): Date {
    const startDateMin = new Date()
    startDateMin.setFullYear(startDateMin.getFullYear() - 2)
    return startDateMin
  }

  /** The minimum start date string. */
  private get startDateMinStr (): string {
    const startDateMin = new Date()
    startDateMin.setFullYear(startDateMin.getFullYear() - 2)
    return this.dateToYyyyMmDd(startDateMin)
  }

  /** The maximum start date that can be entered (Up to 90 days from today). */
  private get startDateMax (): Date {
    const startDateMax = new Date()
    startDateMax.setDate(startDateMax.getDay() + 90)
    return startDateMax
  }

  /** The maximum start date string. */
  private get startDateMaxStr (): string {
    const startDateMax = new Date()
    startDateMax.setDate(startDateMax.getDay() + 90)
    return this.dateToYyyyMmDd(startDateMax)
  }

  /** Validations rules for start date field. */
  get startDateRules (): Array<Function> {
    return [
      (v: string) => !!v || 'Start Date is required',
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
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

</style>
