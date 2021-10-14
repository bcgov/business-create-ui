<template>
  <v-card flat id="effective-date-time-box">
    <v-radio-group column class="pt-0 mt-0" v-model="effectiveDateType">
      <v-radio label="Immediate (date and time of filing)" :value=EffectiveDateTypes.IMMEDIATE />
      <v-radio label="A date and time in the future" :value=EffectiveDateTypes.FUTUREEFFECTIVE />
    </v-radio-group>

    <v-form ref="form" class="date-time-selectors">
      <DatePicker
        ref="datePickerRef"
        title="Date"
        nudge-right="40"
        :inputRules="dateRules"
        :disablePicker="effectiveDateType !== EffectiveDateTypes.FUTUREEFFECTIVE"
        :minDate="dateToYyyyMmDd(minDate)"
        :maxDate="dateToYyyyMmDd(maxDate)"
        @emitDate="dateText = $event"
        @emitCancel="dateText = ''"
      />

      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-combobox
            id="hour-selector"
            ref="hourSelector"
            filled
            class="mr-1"
            v-model="selectHour"
            label="Hour"
            :items="hours"
            :disabled="!isFutureEffective"
            :rules="hourRules" />
        </v-col>
        <span class="time-colon" :class="{ 'disabled': !isFutureEffective }">:</span>
        <v-col cols="12" sm="6" md="3">
          <v-combobox
            id="minute-selector"
            ref="minuteSelector"
            filled
            class="ml-1"
            v-model="selectMinute"
            label="Minute"
            :items="minutes"
            :disabled="!isFutureEffective"
            :rules="minuteRules" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            id="period-selector"
            filled
            v-model="selectPeriod"
            :items="timePeriod"
            :disabled="!isFutureEffective" />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="label-col">
          <span class="time-zone-label" :class="{ 'disabled': !isFutureEffective }">Pacific time</span>
        </v-col>
      </v-row>

      <!-- display validation alert only after date and time have been entered -->
      <v-row v-if="isFutureEffective && dateText && (selectHour.length > 0) && (selectMinute.length > 0)">
        <v-col class="validation-alert">
          <p class="validation-alert-msg" v-if="isUnderTime">
            The time must be at least {{ dateToTimeString(minDate) }} for the selected date
          </p>
          <p class="validation-alert-msg" v-if="isOverTime">
            The time must be at most {{ dateToTimeString(maxDate) }} for the selected date
          </p>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts">
//
// FUTURE: move this to BCRS Shared Components
//

import { Component, Emit, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { DatePicker } from '@bcrs-shared-components/date-picker'
import { DateMixin } from '@/mixins'
import { EffectiveDateTypes } from '@/enums'
import { EffectiveDateTimeIF, FormFieldType, FormIF } from '@/interfaces'

enum PeriodTypes {
  AM = 'am',
  PM = 'pm'
}

@Component({
  components: {
    DatePicker
  }
})
export default class EffectiveDateTime extends Mixins(DateMixin) {
  readonly MIN_DIFF_MINUTES = 3
  readonly MAX_DIFF_DAYS = 10

  // Add element types to refs
  $refs!: {
    form: FormIF,
    datePickerRef: DatePicker,
    hourSelector: FormFieldType, // used in unit tests
    minuteSelector: FormFieldType // used in unit tests
  }

  /** Current JS date, expected to be passed in periodically. */
  @Prop() readonly currentJsDate: Date

  /** Effective Date Time object, for initial config. */
  @Prop() readonly effectiveDateTime: EffectiveDateTimeIF

  /** Whether to perform validation. */
  @Prop() readonly isAppValidate!: boolean

  // Declaration for template
  readonly EffectiveDateTypes = EffectiveDateTypes

  /** Whether Is Immediate is selected. */
  private isImmediate = false

  /** Whether Is Future Effective is selected. */
  private isFutureEffective = false

  /** The minimum date that can be entered (ie, now + 3 minutes). */
  private minDate: Date = null

  /** The maximum date that can be entered (ie, 10 days from now). */
  private maxDate: Date = null

  // V-model values
  private effectiveDateType: EffectiveDateTypes = null
  private datePicker: string = ''
  private dateText: string = ''
  private selectHour: string[] = []
  private selectMinute: string[] = []
  private selectPeriod = PeriodTypes.AM

  // Combobox items
  private hours = [...Array(12).keys()].map(num => (num + 1).toString())
  private minutes = [...Array(60).keys()].map(num => num.toString().padStart(2, '0'))
  private timePeriod = [PeriodTypes.AM, PeriodTypes.PM]

  /** Validations rules for date text field. */
  get dateRules (): Array<Function> {
    // only apply rules when Future Effective is selected
    if (this.isFutureEffective && this.isAppValidate) {
      const expectedDateFormat = /^(19|20)\d\d[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/
      const minDateStr = this.dateToYyyyMmDd(this.minDate)
      const maxDateStr = this.dateToYyyyMmDd(this.maxDate)
      return [
        (v: string) => !!v || 'Select date',
        (v: string) => expectedDateFormat.test(v) || 'Date format should be YYYY-MM-DD',
        (v: string) => this.isValidDateRange(v) || `Date must be between ${minDateStr} and ${maxDateStr}`
      ]
    }
    return []
  }

  /**
   * True if date is >= the minimum (ie, today) and <= the maximum (ie, the 10th day).
   * This is used for Vue form validation (in Date Rules above).
   */
  private isValidDateRange (v: string): boolean {
    let date = new Date(v)
    // only compare year/month/day (ignore time)
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    const minDay = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate())
    const maxDay = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate())
    return (date >= minDay && date <= maxDay)
  }

  /** Validations rules for hour selector. */
  get hourRules (): Array<Function> {
    // only apply rules when Future Effective is selected
    if (this.isFutureEffective && this.isAppValidate) {
      return [
        (v: string[]) => (v.length > 0) || 'Select hour',
        (v: string) => (/^([1-9]|1[012])$/.test(v)) || ''
      ]
    }
    return []
  }

  /** Validations rules for minute selector. */
  get minuteRules (): Array<Function> {
    // only apply rules when Future Effective is selected
    if (this.isFutureEffective && this.isAppValidate) {
      return [
        (v: string[]) => (v.length > 0) || 'Select minute',
        (v: string) => (/^([0-5]?[0-9])$/.test(v)) || ''
      ]
    }
    return []
  }

  /**
   * True if time is under the minimum (ie, for today).
   * This is a non-form validation - it needs to be checked for overall component validity.
   */
  private get isUnderTime (): boolean {
    if (this.effectiveDateTime.effectiveDate) {
      const date = new Date(this.effectiveDateTime.effectiveDate)
      // use max seconds and milliseconds for comparison
      date.setSeconds(59, 999)
      return (date.getTime() < this.minDate.getTime())
    }
    return false
  }

  /**
   * True if time is over the maximum (ie, for 10th day).
   * This is a non-form validation - it needs to be checked for overall component validity.
   */
  private get isOverTime (): boolean {
    if (this.effectiveDateTime.effectiveDate) {
      const date = new Date(this.effectiveDateTime.effectiveDate)
      // use min seconds and milliseconds for comparison
      date.setSeconds(0, 0)
      return (date.getTime() > this.maxDate.getTime())
    }
    return false
  }

  /** Called when component is mounted. */
  mounted (): void {
    /** It was decided not doing it for now */
    // this.parseInitialEffectiveDateTime()
  }

  /** Parses initial Effective Date Time and sets state. */
  private parseInitialEffectiveDateTime (): void {
    // set the chosen effective date option
    this.isFutureEffective = this.effectiveDateTime.isFutureEffective
    if (this.isFutureEffective === true) {
      this.effectiveDateType = EffectiveDateTypes.FUTUREEFFECTIVE
    } else if (this.isFutureEffective === false) {
      this.effectiveDateType = EffectiveDateTypes.IMMEDIATE
    } else {
      this.effectiveDateType = null
    }

    // try to create Date object
    const effectiveDate = this.effectiveDateTime.effectiveDate
    const date = effectiveDate && new Date(effectiveDate)

    if (date) {
      // set model properties
      let hour = date.getHours()
      const minute = date.getMinutes()
      const period = hour < 12 ? PeriodTypes.AM : PeriodTypes.PM

      // convert 24h -> 12h and 0h -> 12h
      if (hour > 12) {
        hour -= 12
      } else if (hour === 0) {
        hour = 12
      }

      // set model values
      this.dateText = this.dateToYyyyMmDd(date)
      this.selectHour = [hour.toString()]
      this.selectMinute = [minute.toString().padStart(2, '0')]
      this.selectPeriod = period
    }
  }

  /** Constructs the effective date and updates the parent. */
  private async constructAndUpdate (): Promise<void> {
    // wait for form to update itself before checking validity
    await Vue.nextTick()

    const isDateValid = this.$refs.datePickerRef.validateForm()
    const isTimeValid = this.$refs.form.validate()
    if (isDateValid && isTimeValid && !!this.selectHour.length && !!this.selectMinute.length) {
      const year = +this.dateText.slice(0, 4)
      const month = (+this.dateText.slice(5, 7) - 1) // zero-relative
      const date = +this.dateText.slice(8, 10)
      let hours = +this.selectHour
      const minutes = +this.selectMinute

      // convert 12 am -> 0
      if (this.selectPeriod === PeriodTypes.AM && +this.selectHour === 12) {
        hours = 0
      }

      // convert 1-11 pm -> 13-23
      if (this.selectPeriod === PeriodTypes.PM && +this.selectHour !== 12) {
        hours += 12
      }

      // construct date in UTC using parameters in Pacific time
      const dateTime = this.createUtcDate(year, month, date, hours, minutes)

      // Set Effective Date
      this.emitEffectiveDate(dateTime)
    }

    // update validity every time
    this.emitValid()
  }

  @Watch('currentJsDate', { immediate: true })
  onCurrentJsDateChanged (val: Date) {
    // safety check (val may be null)
    if (val) {
      // set new min date
      const minDate = new Date()
      // add 3 minutes
      minDate.setTime(val.getTime() + this.MIN_DIFF_MINUTES * 60 * 1000)
      this.minDate = minDate

      // set new max date
      const maxDate = new Date()
      // add 10 days
      maxDate.setTime(val.getTime() + this.MAX_DIFF_DAYS * 24 * 60 * 60 * 1000)
      this.maxDate = maxDate

      // check if form is still valid
      this.emitValid()
    }
  }

  @Watch('datePicker')
  onDatePickerChanged (val: string): void {
    this.dateText = val
    // the watcher for dateText will fire next
  }

  @Watch('dateText')
  onDateTextChanged (val: string): void {
    if (this.isFutureEffective) {
      this.constructAndUpdate()
    }
  }

  @Watch('selectHour')
  onSelectHourChanged (val: string): void {
    if (this.isFutureEffective) {
      this.constructAndUpdate()
    }
  }

  @Watch('selectMinute')
  onSelectMinuteChanged (val: string): void {
    if (this.isFutureEffective) {
      this.constructAndUpdate()
    }
  }

  @Watch('selectPeriod')
  onSelectPeriodChanged (val: string): void {
    if (this.isFutureEffective) {
      this.constructAndUpdate()
    }
  }

  @Watch('effectiveDateType')
  onEffectiveDateTypeChanged (val: EffectiveDateTypes): void {
    this.isImmediate = (val === EffectiveDateTypes.IMMEDIATE)
    this.isFutureEffective = (val === EffectiveDateTypes.FUTUREEFFECTIVE)

    // if we changed to IMMEDIATE then clear the model values (otherwise retain them)
    if (this.isImmediate) {
      this.datePicker = ''
      this.dateText = ''
      this.selectHour = []
      this.selectMinute = []
      this.selectPeriod = PeriodTypes.AM
      this.$refs.datePickerRef.clearDate()
    }

    // update the parent
    this.emitIsFutureEffective(this.isFutureEffective)
    this.emitEffectiveDate(null)
    this.emitValid()
  }

  @Emit('isFutureEffective')
  private emitIsFutureEffective (val: boolean): void {}

  @Emit('effectiveDate')
  private emitEffectiveDate (val: Date): void {}

  @Emit('valid')
  private async emitValid (): Promise<boolean> {
    // localized dateText check for future effective selections
    const validDateText = this.isFutureEffective ? !!this.dateText : true

    // wait for form to update itself before checking validity
    await Vue.nextTick()
    const isDateValid = this.$refs.datePickerRef.validateForm()
    const isTimeValid = this.$refs.form.validate()
    return this.isImmediate || (!!this.effectiveDateType &&
      isDateValid && isTimeValid &&
      !!this.selectHour.length && !!this.selectMinute.length &&
      !this.isUnderTime &&
      !this.isOverTime &&
      validDateText
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#effective-date-time-box {
  padding: 2rem 2rem 0.5rem;
  line-height: 1.2rem;
}

::v-deep .v-label {
  color: $gray7;
  font-weight: normal;
}

.v-radio {
  padding-bottom: .5rem;
}

.date-time-selectors {
  margin-left: 2rem;
}

.time-colon {
  margin-left: -4px;
  margin-right: -4px;
  padding-top: 2rem;
  font-size: 25px;
}

@media (max-width: 768px) {
  .time-colon {
    display: none;
  }
}

.label-col {
  position: relative;
  align-self: center;
}

.time-zone-label {
  position: absolute;
  top: -10px;
  color: $gray7;
}

.disabled {
  color: $gray6;
}

.validation-alert {
  position: relative;

  .validation-alert-msg {
    line-height: 12px;
    position: absolute;
    top: -2rem;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 500;
    color: $BCgovInputError !important;
  }
}
::v-deep {
  .v-icon.v-icon.v-icon--disabled {
    color: $app-blue !important;
  }
  .v-input--is-disabled {
    opacity: 0.4;
  }
  .v-input--is-disabled .v-input__control > .v-input__slot:before {
    border-image: none;
  }
}
</style>
