<template>
  <v-card flat id="transactional-folio-number-container" :class="{ 'invalid-section': !sectionValid }">
    <v-row no-gutters>
      <v-col cols="3">
        <label :class="{ 'error-text': !sectionValid }">
          <strong>Folio or Reference<br>Number</strong>
        </label>
      </v-col>
      <v-col cols="9">
        <v-text-field
          filled persistent-hint validate-on-blur hide-details
          id="folio-number-input"
          ref="folioNumberInput"
          autocomplete="chrome-off"
          label="Folio or Reference Number (Optional)"
          v-model="folioNumber"
          :name="Math.random()"
          :rules="rules"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins'
import { ActionBindingIF, FormFieldType } from '@/interfaces'

@Component({})
export default class TransactionalFolioNumber extends Mixins(CommonMixin) {
  // Add element type to refs
  $refs!: {
    folioNumberInput: FormFieldType
  }

  // Global getters
  @Getter getAccountFolioNumber!: string
  @Getter getTransactionalFolioNumber!: string

  // Global actions
  @Action setTransactionalFolioNumber!: ActionBindingIF
  @Action setTransactionalFolioNumberValidity!: ActionBindingIF

  /** Prop to perform validation. */
  @Prop({ default: false }) readonly validate: boolean

  // Local properties
  private folioNumber = ''

  // Validation rules
  private readonly rules: Array<Function> = [
    v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // assign transactional FN if it exists, otherwise business FN
    this.folioNumber = this.getTransactionalFolioNumber || this.getAccountFolioNumber
  }

  /** True if this section is valid. */
  get sectionValid (): boolean {
    // *** TODO: finish implementation
    return !this.validate
    // return (!this.validate || this.getFlagsReviewCertify.isValidTransactionalFolioNumber)
  }

  // ** TODO: set validity locally?
  @Watch('folioNumber')
  private async onFolioNumberChanged (val: string): Promise<void> {
    this.setTransactionalFolioNumber(val)
    // wait for form field to update itself before checking validity
    await Vue.nextTick()
    this.setTransactionalFolioNumberValidity(this.$refs.folioNumberInput.valid)
  }
}
</script>
