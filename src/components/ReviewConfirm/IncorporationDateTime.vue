<template>
  <v-card flat id="incorporation-date-time">
    <v-row>
      <v-col cols="12" sm="5" md="3">
        <label>Incorporation Date and Time</label>
      </v-col>
      <v-col cols="12" sm="8" md="7">
        <v-radio-group
          column
          class="radio-group"
          v-model="selectDate">
          <v-radio
            label="Immediate (Upon Filing)"
            value="isImmediate">
          </v-radio>
          <v-radio
            label="A date / time in the future"
            value="isFutureEffective">
          </v-radio>
        </v-radio-group>
        <div class="date-time-selectors">
          <v-menu
            close-on-content-click
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                id="date-text-field"
                placeholder="Date"
                append-icon="mdi-calendar"
                v-model="dateText"
                :rules="dateRules"
                :disabled="!isFutureEffective"
                v-on="on"
                filled
              />
            </template>
            <v-date-picker
              v-model="datePicker"
              :min=minDate
              :max=maxDate>
            </v-date-picker>
          </v-menu>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-combobox
                id="hour-selector"
                :items="hours"
                label="Hour"
                v-model="selectHour"
                :disabled="!isFutureEffective || !dateText"
                :rules="hourRules"
                filled
              ></v-combobox>
            </v-col>
            <span :class="{ 'disabled': !isFutureEffective, 'time-colon': true }">:</span>
            <v-col cols="12" sm="6" md="3">
              <v-combobox
                id="minute-selector"
                label="Minute"
                :items="minutes"
                v-model="selectMinute"
                :disabled="!isFutureEffective || !dateText"
                :rules="minuteRules"
                filled
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                id="am-pm-selector"
                :items="timePeriod"
                v-model="selectPeriod"
                :disabled="!isFutureEffective || !dateText"
                filled
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2" class="label-col">
              <span class="time-zone-label" :class="{ 'disabled': !isFutureEffective }">Pacific Time</span>
            </v-col>{{isUnderTime}}
          </v-row>
          <v-row>
            <v-col
              class="validation-alert"
              v-show="isFutureEffective && dateText && !isValidDateTime(incorporationDateTime.effectiveDate)"
            >
              <p class="validation-alert-msg">
                <span v-if="isUnderTime">The time must be at least {{minTime()}} for the selected date</span>
                <span v-else>The time can't be greater than {{maxTime()}} for the selected date</span>
              </p>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Watch, Emit, Prop } from 'vue-property-decorator'
import { Action } from 'vuex-class'

// Mixins
import { DateMixin } from '@/mixins'

// Constants
import { ISIMMEDIATE, ISFUTUREEFFECTIVE } from '@/constants'

// Interfaces
import { ActionBindingIF, DateTimeIF } from '@/interfaces'

@Component({})
export default class IncorporationDateTime extends Mixins(DateMixin) {
  @Prop()
  private incorporationDateTime!: DateTimeIF

  // Global Actions
  @Action setIsFutureEffective!: ActionBindingIF

  // Local properties
  private isImmediate: boolean = false
  private isFutureEffective: boolean = false
  private isOverMaxDateTime: boolean = false

  // Date properties
  private selectDate: string = ''
  private dateText: string = ''
  private datePicker: string = ''

  // Time properties
  private selectHour: string[] = []
  private selectMinute: string[] = []
  private selectPeriod: string = 'AM'

  // Date Time Selectors
  private hours: Array<string> = [...Array(12).keys()]
    .map(num => (++num).toLocaleString('en-US'))
  private minutes: Array<string> = [...Array(60).keys()]
    .map(num => num.toLocaleString('en-US', { minimumIntegerDigits: 2 }))
  private timePeriod: Array<string> = ['AM', 'PM']

  /** The array of validations rules for the effective date Date field. */
  private get dateRules (): Array<Function> {
    // Define today and 10 days from now
    const minDate = this.toReadableDate(this.minDate)
    const maxDate = this.toReadableDate((this.maxDate))
    const expectedDateFormat = /^(19|20)\d\d[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/

    return [
      v => this.isFutureEffective && ((expectedDateFormat.test(v) &&
        this.isValidDateTime(this.incorporationDateTime.effectiveDate, true)) ||
        `Date must be between ${minDate} and ${maxDate}`)
    ]
  }

  /** The array of validations rules for effective date hours field. */
  private get hourRules (): Array<Function> {
    return [
      v => this.dateText !== '' && (/^([1-9]|1[012])$/.test(v) || '')
    ]
  }

  /** The array of validations rules for the effective date minutes field. */
  private get minuteRules (): Array<Function> {
    return [
      v => this.dateText !== '' && (/^([0-5]?[0-9])$/.test(v) || '')
    ]
  }

  /** Lifecycle Hook to run when component mounts */
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
    this.setIsFutureEffective(false)
    this.emitDateTime('')
  }

  /** Construct the Date Object for storage */
  private constructDate (): void {
    if (this.isFutureEffective) {
      // Format the selected date string and create Date
      const dateString = this.dateText.replace(/-/g, ', ')
      const dateToValidate = new Date(dateString)

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

      // Set DateTime
      this.emitDateTime(dateToValidate)
    }
    this.emitIsValidDateTime()
  }

  /** Parse the DateTime from store */
  private deconstructDateTime (): void {
    if (this.incorporationDateTime) {
      // Set the chosen filing time option
      this.selectDate = this.incorporationDateTime.isFutureEffective ? ISFUTUREEFFECTIVE : ISIMMEDIATE
      this.isFutureEffective = this.selectDate === ISFUTUREEFFECTIVE

      // Reference Store and create date object
      const effectiveDate = this.incorporationDateTime.effectiveDate
      const dateToParse = effectiveDate && new Date(effectiveDate)

      if (dateToParse) {
        // Parse the Time and display DateTime
        let hour = dateToParse.getHours()
        const minute = dateToParse.getMinutes()
        const amPm = hour >= 12 ? 'PM' : 'AM'

        if (hour > 12) {
          hour -= 12
        } else if (hour === 0) {
          hour = 12
        }

        this.dateText = this.dateToUsableString(dateToParse)
        this.selectHour = [hour.toLocaleString()]
        this.selectMinute = [minute.toLocaleString('en-US', { minimumIntegerDigits: 2 })]
        this.selectPeriod = amPm
      }
    }
  }

  /** The minimum date that can be entered. */
  private get minDate (): string {
    const minDate = new Date()

    return minDate.toISOString()
  }

  /** The maximum date that can be entered. */
  private get maxDate (): string {
    const maxDate = new Date()
    maxDate.setDate(new Date().getDate() + 10)

    return maxDate.toISOString()
  }

  /** The minimum time that can be entered. */
  private minTime (): string {
    return new Date(new Date().getTime() + 180000)
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  /** The maximum time that can be entered. */
  private maxTime (): string {
    const maxDate = new Date(new Date().setDate(new Date().getDate() + 10))
    return new Date(maxDate.getTime())
      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  private get isUnderTime (): boolean {
    if (this.incorporationDateTime.effectiveDate) {
      const startDate = new Date()
      const effectiveDate = this.incorporationDateTime.effectiveDate
      const diff = (effectiveDate.getTime() - startDate.getTime()) / 1000
      return diff <= 0
    }
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
  private onEffectiveDateManual (val: string): void {
    this.constructDate()
  }

  /**
   * Set hour text from selected dropdown.
   * @param val The hour selected
   */
  @Watch('selectHour')
  private onHourUpdate (val: string): void {
    this.constructDate()
  }

  /**
   * Set minute text from selected dropdown.
   * @param val The minute selected
   */
  @Watch('selectMinute')
  private onMinuteUpdate (val: string): void {
    this.constructDate()
  }

  /**
   * Set minute text from selected dropdown.
   * @param val The time period selected
   */
  @Watch('selectPeriod')
  private onPeriodUpdate (val: string): void {
    this.constructDate()
  }

  /**
   * Set the selected DateTime choice
   * @param val The value of the selected radio button
   */
  @Watch('selectDate')
  private setDateTimeChoice (val) {
    this.isFutureEffective = val === ISFUTUREEFFECTIVE
    this.isImmediate = !this.isFutureEffective

    // Clear DateTimes when immediate is selected
    if (this.isImmediate) {
      this.clearDateTimes()
    } else {
      this.isFutureEffective && this.setIsFutureEffective(true)
    }
    this.emitIsValidDateTime()
  }

  /** Re-validate Date Time. */
  @Watch('incorporationDateTime.valid')
  private reValidateDateTime () {
    this.constructDate()
  }

  /** Emit DateTime Valid event. */
  @Emit('valid')
  private emitIsValidDateTime (): boolean {
    return this.isImmediate ? true
      : this.isFutureEffective && this.isValidDateTime(this.incorporationDateTime.effectiveDate)
  }

  /** Emit DateTime. */
  @Emit('dateTime')
  private emitDateTime (val): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#incorporation-date-time {
  padding: 1.25rem;
  line-height: 1.2rem;
  font-size: 0.875rem;
}

label {
  font-weight: 700;
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
  font-size: 25px;
}
@media (max-width: 768px) {
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
    font-size: 12px;
    font-weight: 500;
    color: #ff5252 !important;
  }
}
</style>
