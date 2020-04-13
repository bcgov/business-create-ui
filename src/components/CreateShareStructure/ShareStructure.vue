<template>
  <div>
    <v-expand-transition id="addShareStructureContainer">
      <ul class="list add-share-structure">
        <li class="add-share-structure-container">
          <div class="meta-container">
            <label class="add-share-structure-header">
              <span v-if="activeIndex === -1">Add Share {{shareStructure.type}}</span>
              <span v-else>Edit Share {{shareStructure.type}}</span>
            </label>

            <div class="meta-container__inner">
              <v-form
                ref="shareStructureForm"
                class="share-structure-form"
                v-model="formValid"
                v-on:submit.prevent="addShareStructure">
                <v-text-field
                  filled
                  :label="shareStructure.type + ' Name [Shares]'"
                  :hint="'Enter the name of the  '+ shareStructure.type.toLowerCase() +
                  '  - the words &quot;Shares&quot; is automatically added'"
                  id="txt-name"
                  v-model="shareStructure.name"
                  :rules="getNameRule()"
                  suffix="Shares"
                  persistent-hint/>

                <v-divider class="separator" />

                <v-radio-group
                  v-model="hasNoMaximumShares"
                  column
                  class="radio-group"
                  @change="changeMaximumShareFlag()">
                  <v-radio :value="false">
                    <template v-slot:label>
                      <v-row><v-col cols="6">
                      <v-text-field
                        filled
                        label="Maximum Number of Shares"
                        id="txt-max-shares"
                        v-model="shareStructure.maxNumberOfShares"
                        persistent-hint
                        :hint="'Enter the maximum number of shares in the ' + shareStructure.type"
                        :rules="getMaximumShareRule()"
                        :disabled="hasNoMaximumShares"/>
                    </v-col></v-row>
                    </template>
                  </v-radio>
                  <v-radio :value="true" label="No maximum" id="lbl-no-maximum"/>
                </v-radio-group>

                <v-divider class="separator" />

                <v-radio-group
                  v-model="hasNoParValue"
                  column
                  class="radio-group"
                  @change="changeParValueFlag()" v-show="isClass">
                  <v-radio :value="false">
                    <template v-slot:label>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            filled
                            label="Par Value"
                            id="txt-par-value"
                            v-model="shareStructure.parValue"
                            :rules="getParValueRule()"
                            hint="Enter the initial value of each share"
                            persistent-hint/>
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
                            id='txt-currency'>
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
                  <v-radio :value="true" label="No par value" id="no-par"/>
                </v-radio-group>

                <div v-show="isSeries">
                    <v-row v-if="shareStructure.hasParValue">
                        <v-col cols="6">
                            <v-text-field
                            label="Par Value"
                            id="txt-par-value"
                            :value="shareStructure.parValue"
                            :disabled="true"
                            width="10"/>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                            id="txt-currency"
                            label="Currency"
                            :value="`${getCurrencyNameByCode(shareStructure.currency)} (${shareStructure.currency})`"
                            :disabled="true"/>
                        </v-col>
                    </v-row>
                    <v-label id='lbl-no-par' v-else>No par value</v-label>
                </div>

                <v-divider class="separator" />

                <div class="form__row">
                  <v-checkbox
                     id="special-rights-check-box"
                    :label="'This share ' + shareStructure.type.toLowerCase() + ' has special rights or restrictions'"
                    v-model="shareStructure.hasRightsOrRestrictions"/>
                </div>

                <div class="form__row form__btns">
                  <v-btn large color="error" :disabled="activeIndex === -1"
                    @click="removeShareStructure()" id="btn-remove">Remove</v-btn>

                  <v-btn large color="primary" class="form-primary-btn"
                    @click="validateForm()" :disabled="!formValid" id="btn-done">Done</v-btn>

                  <v-btn large class="form-cancel-btn" @click="resetFormAndData(true)" id="btn-cancel">Cancel</v-btn>
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
// Libraries
import { Component, Prop, Emit, Mixins, Vue } from 'vue-property-decorator'

// Interfaces
import { ShareClassIF, FormType } from '@/interfaces'

// Mixins
import { CurrencyLookupMixin } from '@/mixins'

@Component({})
export default class ShareStructure extends Mixins(CurrencyLookupMixin) {
  // Refs
  $refs!: {
    shareStructureForm: FormType
  };

  // Props
  @Prop()
  private initialValue!: ShareClassIF

  @Prop()
  private activeIndex: number

  @Prop()
  private parentIndex: number

  @Prop()
  private nextId: number

  @Prop()
  private shareClasses: ShareClassIF[]

  // Data Properties
  private shareStructure: ShareClassIF = null
  private formValid: boolean = true
  private hasNoMaximumShares: boolean = false
  private hasNoParValue: boolean = false

  private excludedWordsList: string [] = ['share', 'shares', 'value']

  // Rules
  private getNameRule (): Array<Function> {
    let rules: Array<Function> = [
      v => !!v || 'A name is required',
      v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
      v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
      v => !(v.split(' ').some(r => this.excludedWordsList.includes(r.toLowerCase()))) ||
      'Name should not contain any of the words share, shares or value'
    ]
    if (this.isClass && this.activeIndex === -1) {
      rules.push(
        v => !(this.shareClasses.find(s => s.name.split(' Shares')[0].toLowerCase() === v.toLowerCase())) ||
        'Share class name nust be unique')
    }
    return rules
  }

  private getMaximumShareRule (): Array<Function> {
    let rules: Array<Function> = []
    if (!this.hasNoMaximumShares) {
      rules = [v => !!v || 'Maximum share value is required', v => /^\d+$/.test(v) || 'Must be a number']
      if (this.isSeries && this.shareClasses[this.parentIndex].hasMaximumShares) {
        rules.push(v => Number(v) <= Number(this.shareClasses[this.parentIndex].maxNumberOfShares) ||
        'Value must be less than or equal to maximum shares of the class')
      }
    }
    return rules
  }

  private getParValueRule (): Array<Function> {
    if (!this.hasNoParValue) {
      return [v => !!v || 'Par value is required',
        v => (v < 1 && /^\d+(\.\d{0,3})?$/.test(v)) || 'Amounts less than 1 can be entered with up to 3 decimal place']
    }
    return []
  }

  private getCurrencyRule (): Array<Function> {
    if (!this.hasNoParValue) {
      return [v => !!v || 'Currency is required']
    }
    return []
  }

  // Life cycle methods
  private created (): void {
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
  private validateForm (): void {
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

  private addShareStructure (): ShareClassIF {
    let shareStructureToAdd: ShareClassIF = { ...this.shareStructure }
    if (this.activeIndex === -1) {
      shareStructureToAdd.id = this.nextId
    }
    shareStructureToAdd.name = `${shareStructureToAdd.name} Shares`
    shareStructureToAdd.hasMaximumShares = !this.hasNoMaximumShares
    shareStructureToAdd.hasParValue = !this.hasNoParValue
    return shareStructureToAdd
  }

  private removeShareStructure (): void {
    if (this.isClass) {
      this.emitRemoveShareClassEvent(this.activeIndex)
    } else if (this.isSeries) {
      this.emitRemoveShareSeriesEvent(this.parentIndex, this.activeIndex)
    }
  }

  private resetFormAndData (emitEvent: boolean): void {
    this.$refs.shareStructureForm.reset()
    if (emitEvent) {
      this.emitResetEvent()
    }
  }

  private changeMaximumShareFlag () {
    if (this.hasNoMaximumShares) {
      this.shareStructure.maxNumberOfShares = null
    }
  }

  private changeParValueFlag () {
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

  // Events
  @Emit('addEditClass')
  private emitAddEditShareClassEvent (shareClass: ShareClassIF): void {}

  @Emit('addEditSeries')
  private emitAddEditShareSeriesEvent (shareSeries: ShareClassIF): void {}

  @Emit('removeClass')
  private emitRemoveShareClassEvent (shareClassIndex: number): void {}

  @Emit('removeSeries')
  private emitRemoveShareSeriesEvent (parentIndex:number, shareSeriesIndex: number): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}
}
</script>

<style lang="scss" scoped>
ul{
  padding-top: 0.5rem;
}
li {
  list-style: None;
  padding-top: 0.25rem;
}
.add-share-structure {
  .add-share-structure-container {
    padding: 1.25rem;

    .meta-container {
      > label:first-child {
        margin-bottom: 1.5rem;
      }
    }
  }
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: 700;
  }

  &__inner {
    flex: 1 1 auto;
  }
}

.add-share-structure-header {
  font-size: 1rem;
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

.separator {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.radio-group {
  padding-top:0.875rem
}
</style>
