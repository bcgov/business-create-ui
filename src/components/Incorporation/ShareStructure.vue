<template>
  <div id="share-structure">
    <v-expand-transition>
      <ul>
        <li class="share-structure-container px-6 py-10">
          <div class="meta-container">
            <label class="share-structure-header">
              <span v-if="activeIndex === -1">Add Share {{ shareStructure.type }}</span>
              <span v-else>Edit Share {{ shareStructure.type }}</span>
            </label>

            <div class="meta-container__inner">
              <v-form
                ref="shareStructureForm"
                class="share-structure-form"
                v-model="formValid"
                v-on:submit.prevent="addShareStructure()"
              >
                <v-text-field
                  filled
                  :label="shareStructure.type + ' Name [Shares]'"
                  :hint="'Enter the name of the  '+ shareStructure.type.toLowerCase() +
                  '  - the words &quot;Shares&quot; is automatically added'"
                  id="txt-name"
                  v-model="shareStructure.name"
                  :rules="getNameRule()"
                  suffix="Shares"
                  persistent-hint
                />

                <v-divider class="mt-2 mb-4" />

                <v-radio-group
                  v-model="hasNoMaximumShares"
                  column
                  class="radio-group"
                  @change="changeMaximumShareFlag()"
                >
                  <v-radio :value="false">
                    <template v-slot:label>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            filled
                            label="Maximum Number of Shares"
                            id="txt-max-shares"
                            v-model.number="shareStructure.maxNumberOfShares"
                            persistent-hint
                            :hint="'Enter the maximum number of shares in the ' + shareStructure.type"
                            :rules="getMaximumShareRule()"
                            :disabled="hasNoMaximumShares"
                          />
                        </v-col>
                      </v-row>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="No maximum" id="lbl-no-maximum" v-if="isNoMaxSharesVisible" />
                </v-radio-group>

                <v-divider class="mt-2 mb-4" />

                <v-radio-group
                  v-model="hasNoParValue"
                  column
                  class="radio-group"
                  @change="changeParValueFlag()" v-show="isClass"
                >
                  <v-radio :value="false" id="radio-par-value">
                    <template v-slot:label>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            filled
                            label="Par Value"
                            id="class-par-value"
                            v-model.number="shareStructure.parValue"
                            :rules="getParValueRule()"
                            hint="Enter the initial value of each share"
                            persistent-hint
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-select
                            :items="getCurrencyList()"
                            filled
                            label="Currency"
                            v-model="shareStructure.currency"
                            :rules="getCurrencyRule()"
                            item-text="`${data.item.name}, ${data.item.code}`"
                            item-value="code"
                            id="class-currency"
                          >
                            <template slot="selection" slot-scope="data">
                               {{ data.item.name }} ({{ data.item.code }})
                            </template>
                            <template slot="item" slot-scope="data">
                              {{ data.item.name }} ({{ data.item.code }})
                            </template>
                          </v-select>
                        </v-col>
                      </v-row>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="No par value" id="radio-no-par" />
                </v-radio-group>

                <div v-show="isSeries">
                  <v-row v-if="shareStructure.hasParValue">
                    <v-col cols="6">
                      <v-text-field
                        label="Par Value"
                        id="series-par-value"
                        :value="shareStructure.parValue"
                        :disabled="true"
                        width="10"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        id="series-currency"
                        label="Currency"
                        :value="`${getCurrencyNameByCode(shareStructure.currency)} (${shareStructure.currency})`"
                        :disabled="true"
                      />
                    </v-col>
                  </v-row>
                  <v-label id="lbl-no-par" v-else>No par value</v-label>
                </div>

                <v-divider class="mt-2 mb-4" />

                <div class="form__row">
                  <v-checkbox
                    id="special-rights-check-box"
                    :label="'This share ' + shareStructure.type.toLowerCase() + ' has special rights or restrictions'"
                    v-model="shareStructure.hasRightsOrRestrictions"
                  />
                </div>

                <div class="form__row form__btns">
                  <v-btn large color="error" :disabled="activeIndex === -1"
                    @click="removeShareStructure()" id="btn-remove">Remove</v-btn>

                  <v-btn large color="primary" class="form-primary-btn"
                    @click="validateForm()" :disabled="!formValid" id="btn-done">Done</v-btn>

                  <v-btn large @click="resetFormAndData(true)" id="btn-cancel">Cancel</v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </li>
      </ul>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { ShareClassIF, FormIF } from '@/interfaces'
import { CurrencyLookupMixin } from '@/mixins'
import { VuetifyRuleFunction } from '@/types'

@Component({})
export default class ShareStructure extends Mixins(CurrencyLookupMixin) {
  // Refs
  $refs!: {
    shareStructureForm: FormIF
  }

  @Prop({ default: null }) readonly initialValue!: ShareClassIF
  @Prop({ required: true }) readonly activeIndex!: number
  @Prop({ required: true }) readonly parentIndex!: number
  @Prop({ required: true }) readonly shareId!: string
  @Prop({ required: true }) readonly shareClasses!: ShareClassIF[]

  // Local properties
  protected shareStructure = null as ShareClassIF
  protected formValid = true
  protected hasNoMaximumShares = false
  protected hasNoParValue = false

  readonly excludedWordsListForClass: string [] = ['share', 'shares', 'value']
  readonly excludedWordsListForSeries: string [] = ['share', 'shares']

  // Rules
  protected getNameRule (): Array<VuetifyRuleFunction> {
    const rules: Array<VuetifyRuleFunction> = [
      v => !!v || 'A name is required',
      v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      v => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
    ]
    if (this.isClass) {
      rules.push(
        v => !(this.shareClasses
          .find((s, index) => {
            // Don't apply uniqueness check to self
            return index !== this.activeIndex && s.name.split(' Shares')[0].toLowerCase() === v.toLowerCase()
          })) || 'Class name must be unique')
      rules.push(v => !(v.split(' ').some(r => this.excludedWordsListForClass.includes(r.toLowerCase()))) ||
      'Class name should not contain any of the words share, shares or value')
    } else if (this.isSeries) {
      rules.push(v => !(this.shareClasses[this.parentIndex].series
        .find((s, index) => {
          // Don't apply uniqueness check to self
          return index !== this.activeIndex && s.name.split(' Shares')[0].toLowerCase() === v.toLowerCase()
        })) || 'Series name must be unique')
      rules.push(v => !(v.split(' ').some(r => this.excludedWordsListForSeries.includes(r.toLowerCase()))) ||
      'Series name should not contain any of the words share or shares')
    }
    return rules
  }

  protected getMaximumShareRule (): Array<VuetifyRuleFunction> {
    let rules = [] as Array<VuetifyRuleFunction>
    if (!this.hasNoMaximumShares) {
      rules = [
        (v: string) => (v !== '' && v !== null && v !== undefined) || 'Number of shares is required',
        (v: string) => /^-?\d+$/.test(v) || 'Must be a whole number',
        (v: string) => (+v > 0) || 'Number must be greater than 0',
        (v: string) => (v && v.toString().length < 16) || 'Number must be less than 16 digits'
      ]
      // To prevent changing share class value to a lower value after adding series.
      if (this.isClass && this.activeIndex !== -1 && !this.hasNoMaximumShares &&
       this.shareStructure.series.length > 0) {
        const seriesSum = this.shareStructure.series.reduce((a, b) => +a + +b.maxNumberOfShares, 0)
        rules.push(v => +v >= seriesSum ||
        'The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
      }
      if (this.isSeries && this.shareClasses[this.parentIndex].hasMaximumShares) {
        let filteredSeries = this.shareClasses[this.parentIndex].series
        // The series is in edit mode and should be avoided from the calculating the total
        if (this.activeIndex !== -1) {
          filteredSeries = filteredSeries.filter((series) => (
            series.id !== this.shareClasses[this.parentIndex].series[this.activeIndex].id))
        }
        const currentSum = filteredSeries.reduce((a, b) => +a + +b.maxNumberOfShares, 0)
        rules.push(v => +v + currentSum <= +this.shareClasses[this.parentIndex].maxNumberOfShares ||
        'The number for the series (or all series combined, if there are multiple under ' +
        'a class) cannot exceed the number for the class')
      }
    }
    return rules
  }

  protected getParValueRule (): Array<VuetifyRuleFunction> {
    if (!this.hasNoParValue) {
      return [
        v => (v !== '' && v !== null && v !== undefined) || 'Par value is required',
        v => v > 0 || 'Amount must be greater than 0',
        v => (v < 1)
          ? (/^(\d+(\.\d{0,3})?|\.\d{0,3})$/.test(v) || 'Amounts less than 1 can be entered with up to 3 decimal place')
          : (/^\d+(\.\d{1,2})?$/.test(v) || 'Amounts greater than 1 can be entered with up to 2 decimal place')]
    }
    return []
  }

  protected getCurrencyRule (): Array<VuetifyRuleFunction> {
    if (!this.hasNoParValue) {
      return [v => !!v || 'Currency is required']
    }
    return []
  }

  /** Called when component is created. */
  created (): void {
    if (this.initialValue) {
      this.shareStructure = { ...this.initialValue }
      this.hasNoMaximumShares = !this.shareStructure.hasMaximumShares
      this.hasNoParValue = !this.shareStructure.hasParValue

      if (this.activeIndex !== -1) {
        const name = this.shareStructure.name
        this.shareStructure.name = name.substr(0, name.indexOf(' Shares'))
      }
    }
  }

  // Methods
  protected validateForm (): void {
    if (this.formValid) {
      const shareStructure: ShareClassIF = this.addShareStructure()
      this.emitAddShareStructureEvent(shareStructure)
      this.resetFormAndData(false)
    }
  }

  private emitAddShareStructureEvent (shareStructure: ShareClassIF): void {
    if (this.isClass) {
      this.emitAddEditShareClassEvent(shareStructure)
    } else if (this.isSeries) {
      this.emitAddEditShareSeriesEvent(shareStructure)
    }
  }

  protected addShareStructure (): ShareClassIF {
    const shareStructureToAdd: ShareClassIF = { ...this.shareStructure }
    if (this.activeIndex === -1) {
      shareStructureToAdd.id = this.shareId
    }
    shareStructureToAdd.name = `${shareStructureToAdd.name} Shares`
    shareStructureToAdd.hasMaximumShares = !this.hasNoMaximumShares
    shareStructureToAdd.hasParValue = !this.hasNoParValue
    return shareStructureToAdd
  }

  protected removeShareStructure (): void {
    if (this.isClass) {
      this.emitRemoveShareClassEvent(this.activeIndex)
    } else if (this.isSeries) {
      this.emitRemoveShareSeriesEvent(this.parentIndex, this.activeIndex)
    }
  }

  protected resetFormAndData (emitEvent: boolean): void {
    this.$refs.shareStructureForm.reset()
    if (emitEvent) {
      this.emitResetEvent()
    }
  }

  protected changeMaximumShareFlag (): void {
    if (this.hasNoMaximumShares) {
      this.shareStructure.maxNumberOfShares = null
    }
  }

  protected changeParValueFlag (): void {
    if (this.hasNoParValue) {
      this.shareStructure.currency = null
      this.shareStructure.parValue = null
    }
  }

  // Getters
  get isClass (): boolean {
    return this.shareStructure.type === 'Class'
  }

  get isSeries (): boolean {
    return this.shareStructure.type === 'Series'
  }

  get isNoMaxSharesVisible (): boolean {
    return this.isSeries ? !(this.shareClasses[this.parentIndex].hasMaximumShares) : true
  }

  // Events
  @Emit('addEditClass')
  private emitAddEditShareClassEvent (shareClass: ShareClassIF): void {}

  @Emit('addEditSeries')
  private emitAddEditShareSeriesEvent (shareSeries: ShareClassIF): void {}

  @Emit('removeClass')
  private emitRemoveShareClassEvent (shareClassIndex: number): void {}

  @Emit('removeSeries')
  private emitRemoveShareSeriesEvent (parentIndex: number, shareSeriesIndex: number): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  padding-top: 0.25rem;
}

.share-structure-container {
  padding: 1.25rem;

  .meta-container {
    > label:first-child {
      margin-bottom: 1.5rem;
    }
  }
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }

  &__inner {
    flex: 1 1 auto;
  }
}

.share-structure-header {
  font-size: $px-16;
  font-weight: bold;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 10rem;
    }
  }
}

.radio-group {
  padding-top: 0.875rem;
}
</style>
