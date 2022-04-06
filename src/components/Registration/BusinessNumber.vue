<template>
  <div id="business-number">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pr-4">
        <label class="d-block">Business Number</label>
        <v-chip
          v-if="hasBusinessNumberChanged"
          id="changed-chip"
          x-small label
          color="primary"
          text-color="white"
        >
          Changed
        </v-chip>
      </v-col>

      <v-col cols="12" sm="9">
        <p class="mb-0">
          If you have an existing business number, enter it below and we will contact
          Canada Revenue Agency and ask them to link it to this registration.
        </p>
        <HelpBusinessNumber class="mt-4" />
        <v-text-field
          filled
          persistent-hint
          ref="textField"
          class="item mt-4 mb-n2"
          label="Business Number (Optional)"
          hint="First 9 digits of the CRA Business Number"
          v-model="value"
          :error="!valid"
          :error-messages="errorMessages"
          @blur="onBlur()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { FormIF } from '@/interfaces'
import { Rules } from '@/rules'
import HelpBusinessNumber from '@/components/Registration/HelpBusinessNumber.vue'

/**
 * Implements custom validation logic as follows:
 * - if there is an initial business number then enables validation right away
 * - if there is no initial business number then does not show errors while typing
 * - enables validation after leaving text field if the value is truthy
 * - disables validation after leaving text field if the value is falsy
 */
@Component({
  components: { HelpBusinessNumber }
})
export default class BusinessNumber extends Vue {
  $refs!: {
    textField: FormIF
  }

  /** The registration business number. */
  @Prop({ required: true })
  readonly businessNumber!: string

  /** Whether to display Change features. */
  @Prop({ default: false })
  readonly hasBusinessNumberChanged!: boolean

  // Local variables
  protected enableRules = false
  protected errorMessages = []
  protected valid = true
  protected value = null as string

  /** Called when component is mounted. */
  protected mounted (): void {
    // init model variable + validate
    this.value = this.businessNumber
    this.onBlur()
  }

  /** Called on init and when user leaves the text field. */
  protected onBlur (): void {
    // enable or disable validation + validate
    this.enableRules = Boolean(this.value) // false if value has been cleared
    this.valid = this.validate()
    this.emitValid()
  }

  /** Watches for changes to the text field value. */
  @Watch('value')
  private onValueChanged (): void {
    // update business number + validate
    this.emitBusinessNumber()
    this.valid = this.validate()
    this.emitValid()
  }

  /** Watches for changes to the business number prop. */
  @Watch('businessNumber')
  private onBusinessNumberChanged (val: string): void {
    this.value = val
  }

  /** Emits updated business number event. */
  @Emit('update:businessNumber')
  private emitBusinessNumber (): string {
    return this.value
  }

  /** Emits component validity event. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.valid
  }

  /** Validates the business number. */
  private validate (): boolean {
    // evaluate only when rules are enabled
    if (this.enableRules) {
      // execute all rules and find the first failed one
      const result = Rules.BusinessNumberRules
        .map(rule => rule(this.value))
        .find(result => (result !== true))
      // display error messages, if any
      this.errorMessages = result || []
      return !result
    }
    return true
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#business-number {
  .col-sm-3 {
    color: $gray9;
    font-weight: bold;
  }

  .col-sm-9 {
    color: $gray7;
  }
}

.v-icon.mdi-open-in-new {
  margin-top: -2px;
  padding-left: 2px;
}
</style>
