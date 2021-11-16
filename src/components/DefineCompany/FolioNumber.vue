<template>
  <div id="folio-number">
    <v-layout row v-if="!isEditing" id="folio-number-read-only">
      <v-flex md4>
        <label><strong>Folio Information</strong></label>
      </v-flex>
      <v-flex md8>
        <label><strong>Folio Number</strong></label>
        <div id="lbl-folio-number">{{ !!folioNumber ? folioNumber : 'Not entered' }}</div>
      </v-flex>
    </v-layout>
    <v-row v-else id="folio-number-editing">
      <v-col>
        <label><strong>Folio Number</strong></label>
      </v-col>
      <v-col cols="12" sm="8" md="10">
        <v-form>
          <v-text-field
            id="folio-number-text-field"
            label="Folio or Reference Number"
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
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class FolioNumber extends Vue {
  @Prop()
  private readonly initialValue: string

  @Prop({ default: false })
  private readonly isEditing: boolean

  // Local property
  private folioNumber: string = null

  // Validation rules
  private readonly rules: Array<Function> = [
    v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is created. */
  private created (): void {
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

  // Events
  @Emit('folioNumberChange')
  private emitFolioNumber (folioNumber: string): void { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.row .col:first-child {
  width: 12rem;
  max-width: 12rem;
}

label {
  color: $gray9;
}
</style>
