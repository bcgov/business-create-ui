<template>
  <v-card
    id="incorporation-date-time"
    flat
  >
    <v-row>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label>{{ label }}</label>
      </v-col>

      <v-col
        cols="12"
        sm="9"
      >
        <v-radio-group
          v-model="selectDate"
          column
          class="radio-group"
        >
          <v-radio
            label="Immediate (Upon Filing)"
            value="isImmediate"
          />
          <v-radio
            label="A date / time in the future"
            value="isFutureEffective"
          />
        </v-radio-group>

        <v-form
          ref="dateTimeForm"
          class="date-time-selectors"
        >
          <v-menu
            close-on-content-click
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                id="date-text-field"
                v-model="dateText"
                placeholder="Date"
                append-icon="mdi-calendar"
                :rules="dateRules"
                :disabled="!isFutureEffective"
                filled
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="datePicker"
              landscape
              :min="minDate"
              :max="maxDate"
            />
          </v-menu>

          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-combobox
                id="hour-selector"
                v-model="selectHour"
                :items="hours"
                label="Hour"
                :disabled="!isFutureEffective || !dateText"
                :rules="hourRules"
                filled
              />
            </v-col>
            <span
              class="time-colon"
              :class="{ 'disabled': !isFutureEffective }"
            >:</span>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-combobox
                id="minute-selector"
                v-model="selectMinute"
                label="Minute"
                :items="minutes"
                :disabled="!isFutureEffective || !dateText"
                :rules="minuteRules"
                filled
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-select
                id="am-pm-selector"
                v-model="selectPeriod"
                :items="timePeriod"
                :disabled="!isFutureEffective || !dateText"
                filled
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="2"
              class="label-col"
            >
              <span
                class="time-zone-label"
                :class="{ 'disabled': !isFutureEffective }"
              >Pacific time</span>
            </v-col>
          </v-row>

          <v-row v-if="isFutureEffective && dateText && !isValidDateTime(effectiveDateTime.effectiveDate)">
            <v-col class="validation-alert">
              <p
                v-if="isUnderTime"
                class="validation-alert-msg"
              >
                The time must be at least {{ minTime() }} for the selected date
              </p>
              <p
                v-else
                class="validation-alert-msg"
              >
                The time must be at most {{ maxTime() }} for the selected date
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
//
// FUTURE: replace this with EffectiveDateTime.vue
//

import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { DateMixin } from '@/mixins'
import { ISIMMEDIATE, ISFUTUREEFFECTIVE } from '@/constants'
import { EffectiveDateTimeIF, FormIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'

@Component({})
export default class EffectiveDateTime extends Mixins(DateMixin) {
  // Refs
  $refs!: {
    dateTimeForm: FormIF
  }

  @Prop({ required: true }) readonly effectiveDateTime!: EffectiveDateTimeIF
  @Prop({ default: 'Incorporation Date and Time' }) readonly label!: string

  // Local properties
  isImmediate = false
  isFutureEffective = false

  // Date properties
  selectDate = ''
  dateText = ''
  datePicker = ''

  // Time properties
  selectHour = [] as string[]
  selectMinute = [] as string[]
  selectPeriod = 'AM'

  // Date Time Selectors
  readonly hours: Array<string> = [...Array(12).keys()]
    .map(num => (++num).toLocaleString('en-US'))

  readonly minutes: Array<string> = [...Array(60).keys()]
    .map(num => num.toLocaleString('en-US', { minimumIntegerDigits: 2 }))

  readonly timePeriod: Array<string> = ['AM', 'PM']

  /** The array of validations rules for the effective date Date field. */
  get dateRules (): Array<VuetifyRuleFunction> {
    const expectedDateFormat = /^(19|20)\d\d[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/

    return [
      v => this.isFutureEffective && ((expectedDateFormat.test(v) &&
        this.isValidDateTime(this.effectiveDateTime.effectiveDate, true)) ||
        `Date must be between ${this.minDate} and ${this.maxDate}`)
    ]
  }

  /** The array of validations rules for effective date hours field. */
  get hourRules (): Array<VuetifyRuleFunction> {
    return [
      v => this.dateText !== '' && (/^([1-9]|1[012])$/.test(v) || '')
    ]
  }

  /** The array of validations rules for the effective date minutes field. */
  get minuteRules (): Array<VuetifyRuleFunction> {
    return [
      v => this.dateText !== '' && (/^([0-5]?[0-9])$/.test(v) || '')
    ]
  }

  /** Called when component is mounted. */
  mounted (): void {
    this.deconstructDateTime()
  }

  /**  Clear the selected Date and time */
  private clearDateTimes (): void {
    // Clear Date
    this.dateText = ''
    this.datePicker = ''

    // Clear Times
    this.selectHour = []
    this.selectMinute = []
    this.selectPeriod = 'AM'

    // Clear Future Effective from store / fee summary
    this.emitIsFutureEffective(false)
    this.emitEffectiveDate(null)
  }

  /** Construct the Date Object for storage */
  private constructDate (): void {
    if (this.isFutureEffective && this.dateText) {
      // Format the selected date string and create Date
      const dateToValidate = this.yyyyMmDdToDate(this.dateText)

      // Create references & Apply time period
      let hours = this.selectHour && +this.selectHour
      const minutes = this.selectMinute && +this.selectMinute

      if (this.selectPeriod === 'AM' && +this.selectHour === 12) {
        dateToValidate.setDate(dateToValidate.getDate() - 1)
        hours = +this.selectHour + 12
      } else if (this.selectPeriod === 'PM' && +this.selectHour !== 12) {
        hours = +this.selectHour + 12
      }

      // Apply selected hours and minutes
      dateToValidate.setHours(hours, minutes)

      // Set Effective Date
      this.emitEffectiveDate(dateToValidate)
    }
    this.emitValid()
  }

  /** Parse the DateTime from store */
  private deconstructDateTime (): void {
    if (this.effectiveDateTime) {
      // Set the chosen filing time option
      this.selectDate = this.effectiveDateTime.isFutureEffective ? ISFUTUREEFFECTIVE : ISIMMEDIATE
      this.isFutureEffective = (this.selectDate === ISFUTUREEFFECTIVE)

      const effectiveDate = this.effectiveDateTime.effectiveDate
      if (effectiveDate) {
        // Parse the Time and display DateTime
        let hour = effectiveDate.getHours()
        const minute = effectiveDate.getMinutes()
        const amPm = hour >= 12 ? 'PM' : 'AM'

        if (hour > 12) {
          hour -= 12
        } else if (hour === 0) {
          hour = 12
        }

        this.dateText = this.dateToYyyyMmDd(effectiveDate)
        this.selectHour = [hour.toLocaleString()]
        this.selectMinute = [minute.toLocaleString('en-US', { minimumIntegerDigits: 2 })]
        this.selectPeriod = amPm
      }
    }
  }

  /** The minimum date that can be entered (today). */
  get minDate (): string {
    return this.dateToYyyyMmDd(this.getCurrentJsDate)
  }

  /** The maximum date that can be entered (today + 10 days). */
  get maxDate (): string {
    const date = new Date(this.getCurrentJsDate) // make a copy
    date.setDate(date.getDate() + 10)
    return this.dateToYyyyMmDd(date)
  }

  /** The minimum time that can be entered (now + 3 minutes). */
  minTime (): string {
    const date = this.getCurrentJsDate
    return new Date(date.getTime() + 180000)
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  /** The maximum time that can be entered (now + 10 days at current time). */
  maxTime (): string {
    const date = new Date(this.getCurrentJsDate) // make a copy
    date.setDate(date.getDate() + 10)
    return new Date(date.getTime())
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  get isUnderTime (): boolean {
    const effectiveDate = this.effectiveDateTime.effectiveDate
    if (effectiveDate) {
      // Calculate time diff (in minutes)
      const diff = Math.floor((effectiveDate.getTime() - Date.now()) / 1000 / 60)
      return (diff <= 2)
    }
    return false
  }

  /**
   * Set date text to Date chosen in date picker.
   * @param val The date selected
   */
  @Watch('datePicker')
  private onEffectiveDate (val: string): void {
    this.dateText = val
    this.constructDate()
  }

  /**
   * Set Date based on user typed input.
   * @param val The date input
   */
  @Watch('dateText')
  private onEffectiveDateManual (): void {
    this.constructDate()
  }

  /**
   * Set hour text from selected dropdown.
   * @param val The hour selected
   */
  @Watch('selectHour')
  private onHourUpdate (): void {
    this.constructDate()
  }

  /**
   * Set minute text from selected dropdown.
   * @param val The minute selected
   */
  @Watch('selectMinute')
  private onMinuteUpdate (): void {
    this.constructDate()
  }

  /**
   * Set minute text from selected dropdown.
   * @param val The time period selected
   */
  @Watch('selectPeriod')
  private onPeriodUpdate (): void {
    this.constructDate()
  }

  /**
   * Set the selected DateTime choice
   * @param val The value of the selected radio button
   */
  @Watch('selectDate')
  private setDateTimeChoice (val: string) {
    this.isFutureEffective = (val === ISFUTUREEFFECTIVE)
    this.isImmediate = !this.isFutureEffective

    // Clear DateTimes when immediate is selected
    if (this.isImmediate) {
      this.clearDateTimes()
    } else if (this.isFutureEffective) {
      this.emitIsFutureEffective(true)
    }
    this.emitValid()
  }

  /** Re-validate Date Time. */
  @Watch('effectiveDateTime.valid')
  private reValidateDateTime () {
    this.constructDate()
    this.$refs.dateTimeForm.validate()
  }

  @Emit('isFutureEffective')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitIsFutureEffective (val: boolean): void {}

  @Emit('effectiveDate')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitEffectiveDate (val: Date): void {}

  @Emit('valid')
  private emitValid (): boolean {
    if (this.isImmediate) return true
    return (this.isFutureEffective && this.isValidDateTime(this.effectiveDateTime.effectiveDate))
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#incorporation-date-time {
  padding: 1.25rem;
  line-height: 1.2rem;
  font-size: $px-14;
}

label {
  font-weight: bold;
}

.radio-group {
  padding-top: 0;
  margin-top: 0;

  .v-radio {
    padding-bottom: .5rem;
  }
}

.date-time-selectors {
  margin-left: 2rem;
}

.time-colon {
  padding-top: 2rem;
  font-size: $px-24;
}

@media (max-width: 959px) {
  .time-colon {
    display: none;
  }
}

.label-col {
  position: relative;
}

.time-zone-label {
  position: absolute;
  bottom: 40%;
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
    font-size: $px-12;
    font-weight: normal;
    color: $app-red !important;
  }
}
</style>
