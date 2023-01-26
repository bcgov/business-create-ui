<template>
  <v-radio-group column class="radio-group-two" v-model="selectCustomMonths" mandatory>
    <v-radio label="Two Years" value=24 />
    <v-radio label="18 months" value=18 />
    <v-radio label="12 months" value=12 />
    <v-radio label="6 months" value=6 />
    <v-row>
      <v-radio label="Month(s): " value="customMonths">
      </v-radio>
      <v-col sm="2">
        <v-text-field type="number" min=1 max=24 :rules="Rules.CustomMonthRule" v-model="numberOfMonths"
          :disabled="!customMonths" @change="onMonthsChanged" filled />
      </v-col>
    </v-row>
  </v-radio-group>
</template>
<script lang="ts">

import Vue from 'vue'
import { Component, Watch, Emit, Prop } from 'vue-property-decorator'
import { DateMixin, AddEditOrgPersonMixin } from '@/mixins'
import { CUSTOMMONTHS } from '@/constants'
import { EffectiveDateTimeIF, FormIF, ActionBindingIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'
import { Getter, Action } from 'vuex-class'

@Component({
  mixins: [
    DateMixin,
    AddEditOrgPersonMixin
  ]
})
export default class LimitedRestorationRadioPanel extends Vue {
  @Getter getCurrentDate!: string

  @Action setRestorationExpiry!: ActionBindingIF

  // Local properties
  protected customMonths = false

  // Restoration type properties
  protected selectCustomMonths = ''
  protected numberOfMonths = ''

  /** Called before the component is mounted. */
  beforeMount (): void {
    this.numberOfMonths = 1
  }

  /** Add months to current date and return YYYY-MM-DD */
  addMonthsToDate (month: number): string {
    let temp = this.yyyyMmDdToDate(this.getCurrentDate)
    temp.setMonth(temp.getMonth() + month)
    let dateAfterAddition = this.dateToYyyyMmDd(temp)
    return dateAfterAddition
  }

  /** Update numberOfMonths variable according to user input */
  onMonthsChanged (): void {
    this.setRestorationExpiry(this.addMonthsToDate(this.numberOfMonths))
  }

  /**
   * Set if custom number of months is selected
   * @param val The value of the selected radio button
   */
   @Watch('selectCustomMonths')
  private setCustomMonths (val) {
    this.customMonths = val === CUSTOMMONTHS
    if (val !== CUSTOMMONTHS) {
      this.setRestorationExpiry(this.addMonthsToDate(val))
    } else {
      this.setRestorationExpiry(this.addMonthsToDate(this.numberOfMonths))
    }
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.radio-group-two {
  padding-top: 0;
  margin-top: 0;
  margin-left: 2rem;
}
</style>
