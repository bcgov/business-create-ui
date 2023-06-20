<template>
  <div id="start-date">
    <!-- EDIT SECTION -->
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
      >
        <label class="start-date-title title-label">Start Date</label>
      </v-col>
      <v-col
        id="start-date-selector"
        cols="12"
        sm="9"
        class="pt-4 pt-sm-0"
      >
        <DatePickerShared
          id="date-picker"
          ref="startDateRef"
          title="Start Date"
          :nudgeRight="40"
          :nudgeTop="85"
          :initialValue="getRegistration.startDate"
          :minDate="startDateMin"
          :maxDate="startDateMax"
          @emitDateSync="startDateHandler($event)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ActionBindingIF, RegistrationStateIF } from '@/interfaces'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { DateMixin } from '@/mixins'

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
  @Action(useStore) setRegistrationStartDate!: ActionBindingIF

  // Global getters
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  protected dateText = ''

  /** The minimum start date that can be entered (up to 10 years before today). */
  get startDateMin (): string {
    // no min date for staff
    if (this.isRoleStaff) return null

    const date = new Date(this.getCurrentJsDate) // make a copy
    date.setFullYear(date.getFullYear() - 10)
    return this.dateToYyyyMmDd(date)
  }

  /** The maximum start date that can be entered (up to 90 days after today). */
  get startDateMax (): string {
    const date = new Date(this.getCurrentJsDate) // make a copy
    date.setDate(date.getDate() + 90)
    return this.dateToYyyyMmDd(date)
  }

  startDateHandler (dateString: string): void {
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
