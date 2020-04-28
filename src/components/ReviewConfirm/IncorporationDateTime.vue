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
            :close-on-content-click="true"
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
                :disabled="!isFutureEffective"
                v-on="on"
                readonly
                filled
              />
            </template>
            <v-date-picker
              v-model="datePicker"
              :min=minDate
              :max=maxDate>
            </v-date-picker>
          </v-menu>
          <v-row class>
            <v-col cols="12" sm="6" md="3">
              <v-combobox
                id="hour-selector"
                :items="hours"
                label="Hour"
                v-model="selectHour"
                :disabled="!isFutureEffective"
                :rules="hourRules"
                filled
                dense
              ></v-combobox>
            </v-col>
            <span :class="{ 'disabled': !isFutureEffective, 'time-colon': true }">:</span>
            <v-col cols="12" sm="6" md="3">
              <v-combobox
                id="minute-selector"
                label="Minute"
                :items="minutes"
                v-model="selectMinute"
                :disabled="!isFutureEffective"
                :rules="minuteRules"
                filled
                dense
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                id="am-pm-selector"
                :items="timePeriod"
                v-model="selectPeriod"
                :disabled="!isFutureEffective"
                filled
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2" class="label-col">
              <span class="time-zone-label" :class="{ 'disabled': !isFutureEffective }">Pacific Time</span>
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

  /** The array of validations rules for the AGM Date text field. */
  private get hourRules (): Array<Function> {
    return [
      v => this.isFutureEffective && (/^([1-9]|1[012])$/.test(v) || 'An hour between 1 and 12 is required.')
    ]
  }

  /** The array of validations rules for the AGM Date text field. */
  private get minuteRules (): Array<Function> {
    return [
      v => this.isFutureEffective && (/^([0-5]?[0-9])$/.test(v) || 'A second between 1 and 59 is required.')
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
      let hours = +this.selectHour
      const minutes = +this.selectMinute

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
        // Parse the Date
        const year = dateToParse.getFullYear()
        const month = dateToParse.getMonth()
        const day = dateToParse.getDate()

        // Parse the Time and display DateTime
        if (year && month && day) {
          let hour = dateToParse.getHours()
          const minute = dateToParse.getMinutes()
          const amPm = hour >= 12 ? 'PM' : 'AM'

          if (hour > 12) {
            hour -= 12
          } else if (hour === 0) {
            hour = 12
          }

          this.dateText = `${year}-${month + 1}-${day}`
          this.selectHour = [hour.toLocaleString()]
          this.selectMinute = [minute.toLocaleString('en-US', { minimumIntegerDigits: 2 })]
          this.selectPeriod = amPm
        }
      }
    }
  }

  /** Validate the DateTime is within the allowed range */
  private isValidDateTime (): boolean {
    if (this.incorporationDateTime.effectiveDate) {
      const effectiveDate = this.incorporationDateTime.effectiveDate
      const dateToParse = new Date(effectiveDate)
      const startDate = new Date()

      const timeDiff = dateToParse.getTime() - startDate.getTime()
      const timeDiffInMinutes = Math.floor(timeDiff / 1000 / 60)

      // Time set must be more than 2 minutes and less than 10 days
      return timeDiffInMinutes >= 2 && timeDiffInMinutes <= 14400
    }
    return false
  }

  /** The maximum date that can be entered. */
  private get minDate (): string {
    const minDate = new Date()

    return this.dateToUsableString(minDate)
  }

  /** The maximum date that can be entered. */
  private get maxDate (): string {
    const maxDate = new Date()
    maxDate.setDate(new Date().getDate() + 10)

    return this.dateToUsableString(maxDate)
  }

  /**
   * Set date text to date chosen in date picker.
   * @param val The date selected
   */
  @Watch('datePicker')
  private onEffectiveDate (val: string): void {
    this.dateText = val
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

  /** Emit DateTime Valid event. */
  @Emit('valid')
  private emitIsValidDateTime (): boolean {
    return this.isImmediate ? true
      : this.isFutureEffective && this.isValidDateTime()
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
</style>
