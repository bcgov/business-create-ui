<template>
  <div id="folio-number">
    <v-row>
      <v-col>
        <label>Folio Number</label>
      </v-col>
      <v-col cols="12" sm="8" md="10">
        <v-form>
              <v-text-field
                id="folio-number-text-field"
                label="Folio or Reference Number"
                persistent-hint
                v-model="folioNumber"
                filled
                maxLength="50"
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
  // Props
  @Prop()
  private initialValue!: string

  // Data variables
  private folioNumber:string = null

  // Life cycle methods
  private created (): void {
    if (this.initialValue) {
      this.folioNumber = this.initialValue
    }
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
  .row .col:first-child {
      width: 12rem;
      max-width: 12rem;
  }
  label {
    font-weight: 700;
  }
</style>
