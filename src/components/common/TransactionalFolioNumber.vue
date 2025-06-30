<template>
  <div
    id="transactional-folio-number"
    :class="{ 'invalid-section': !isValid }"
  >
    <header>
      <h2>Folio or Reference Number (Optional)</h2>
      <p class="mt-4">
        This is meant for your own tracking purposes and will appear on your receipt.
      </p>
    </header>
    <v-card flat>
      <v-row
        no-gutters
        class="pl-4 pr-4 pt-4"
      >
        <v-col
          cols="12"
          sm="3"
        >
          <label
            class="title-label"
            :class="{ 'error-text': !isValid }"
          >
            <strong>Folio or Reference Number</strong>
          </label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
        >
          <v-text-field
            id="folio-number-input"
            ref="folioNumberInput"
            v-model.trim="localFolioNumber"
            filled
            persistent-hint
            autocomplete="chrome-off"
            label="Folio or Reference Number (Optional)"
            :name="Math.random()"
            :rules="doValidate ? Rules.FolioNumberRules: []"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { CommonMixin } from '@/mixins'
import { FormFieldType } from '@/interfaces'
import { Rules } from '@/rules'

@Component({})
export default class TransactionalFolioNumber extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    folioNumberInput: FormFieldType
  }

  // Props
  @Prop({ default: null }) readonly transactionalFolioNumber!: string
  @Prop({ default: false }) readonly doValidate!: boolean

  // Rules for template
  readonly Rules = Rules

  // Local properties
  localFolioNumber = ''

  /** Called when component is mounted. */
  mounted (): void {
    // assign transactional FN from draft if it exists, otherwise leave field empty
    this.localFolioNumber = this.transactionalFolioNumber || ''
  }

  /** True if this component is valid. */
  get isValid (): boolean {
    return (!this.doValidate || !this.$refs.folioNumberInput || this.$refs.folioNumberInput.valid)
  }

  /** Called when user has changed the Local Folio Number. */
  @Watch('localFolioNumber')
  @Emit('change')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitChange (localFolioNumber: string): void {}

  @Watch('isValid', { immediate: true })
  @Emit('valid')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitValid (isValid: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

h2 {
  margin-bottom: 0.25rem;
  margin-top: 3rem;
  font-size: 1.125rem;
}

#transactional-folio-number {
  font-size: $px-16;
  color: $gray7;
}

.v-card {
  margin-top: 1rem;
  padding-bottom: 1.25rem;
  padding-top: 1rem;
  line-height: 1.2rem;
  font-size: $px-16;
}

.title-label {
  font-weight: bold;
  color: $gray9;
}

.v-input {
  margin-bottom: -8px;
}

.v-input:not(.error--text) {
  margin-bottom: -30px;
}
</style>
