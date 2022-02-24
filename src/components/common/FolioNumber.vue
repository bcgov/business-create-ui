<template>
  <div id="folio-number">
    <!-- Summary mode -->
    <v-row no-gutters v-if="!isEditing" id="folio-number-read-only">
      <v-col md="3" class="mr-n1">
        <label><strong>Folio or Reference<br>Number</strong></label>
      </v-col>
      <v-col md="9">
        <div id="lbl-folio-number">{{ !!folioNumber ? folioNumber : 'Not entered' }}</div>
      </v-col>
    </v-row>

    <!-- Edit mode -->
    <v-row no-gutters v-else id="folio-number-editing">
      <v-col md="2">
        <label><strong>Folio Number</strong></label>
      </v-col>
      <v-col md="10" class="pl-8">
        <v-form v-model="formValid" ref="form">
          <v-text-field
            id="folio-number-text-field"
            label="Folio or Reference Number (Optional)"
            persistent-hint
            v-model="folioNumber"
            filled
            :rules="rules"
          />
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class FolioNumber extends Vue {
  @Prop()
  readonly initialValue: string

  @Prop({ default: false })
  readonly isEditing: boolean

  @Prop({ default: false })
  readonly showErrors!: boolean

  // Local properties
  private folioNumber: string = null
  private formValid: boolean = false

  // Validation rules
  private readonly rules: Array<Function> = [
    v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is created. */
  created (): void {
    if (this.initialValue) {
      this.folioNumber = this.initialValue
    }
  }

  @Watch('initialValue', { deep: true, immediate: true })
  private onFolioNumberPropValueChanged (): void {
    this.folioNumber = this.initialValue
  }

  /**
   * Set folio number on user typed input.
   * @param val The folio number input
   */
  @Watch('folioNumber')
  private onFolioNumberChange (val: string): void {
    this.emitFolioNumber(val)
  }

  @Watch('formValid')
  private onFormValidityChange (val: boolean): void {
    this.emitValid(val)
  }

  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    if (this.showErrors) {
      (this.$refs.form as any).validate()
    }
  }

  // Events
  @Emit('update')
  private emitFolioNumber (folioNumber: string): void {}

  @Emit('valid')
  private emitValid (valid: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.row .col:first-child {
  width: 12rem;
}

label {
  color: $gray9;
}
</style>
