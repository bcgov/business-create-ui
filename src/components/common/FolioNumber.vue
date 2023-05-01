<template>
  <div id="folio-number">
    <!-- EDIT SECTION -->
    <template v-if="isEditing">
      <v-row no-gutters id="folio-number-editing">
        <v-col cols="12" sm="3" class="pr-4">
          <label class="folio-number-title title-label">Folio Number</label>
        </v-col>
        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
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
    </template>

    <!-- SUMMARY SECTION -->
    <template v-else>
      <v-row no-gutters id="folio-number-read-only">
        <v-col cols="12" sm="3" class="pr-4">
          <label class="folio-number-title">Folio or Reference Number</label>
        </v-col>
        <v-col cols="12" sm="9">
          <div id="lbl-folio-number">{{ folioNumber || '(Not entered)' }}</div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { VuetifyRuleFunction } from '@/types'

@Component({})
export default class FolioNumber extends Vue {
  @Prop({ default: null }) readonly initialValue!: string
  @Prop({ default: false }) readonly isEditing!: boolean
  @Prop({ default: false }) readonly showErrors!: boolean

  // Local properties
  folioNumber = null as string
  formValid = false

  // Validation rules
  readonly rules: Array<VuetifyRuleFunction> = [
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitFolioNumber (folioNumber: string): void {}

  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitValid (valid: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.folio-number-title {
  font-weight: bold;
  color: $gray9;
}

// remove extra space taken by error message
:deep(.v-text-field__details) {
  margin-bottom: -8px !important;
}
</style>
