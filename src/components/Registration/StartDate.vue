<template>
  <v-card flat class="rounded-4 py-1" :class="{ 'invalid-section': getShowErrors && !dateText }">
    <div class="section-container step-container">
      <v-row no-gutters>
        <v-col cols="12" md="2" lg="2">
          <label>Start Date</label>
        </v-col>
        <v-col cols="12" md="10" lg="10" id="start-date-selector" class="pl-8">
          <date-picker
            id="date-picker"
            ref="startDateRef"
            title="Start Date"
            :nudgeRight="40"
            :nudgeTop="85"
            :initialValue="initialValue"
            :minDate="startDateMinStr"
            :maxDate="startDateMaxStr"
            :inputRules="startDateRules"
            @emitDateSync="startDateHandler($event)"
          />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF } from '@/interfaces'
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

  /** Initial date string value. */
  @Prop({ default: '' })
  readonly initialValue: string

  // Global actions
  @Action setRegistrationStartDate!: ActionBindingIF

  // Global getters
  @Getter getCurrentJsDate!: Date
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
    this.$refs.startDateRef.validateForm()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

</style>
