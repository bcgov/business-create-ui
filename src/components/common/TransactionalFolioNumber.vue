<template>
  <div
    id="transactional-folio-number"
    :class="{ 'invalid-section': !isValid }"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        sm="3"
        class="pr-4"
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
        class="pt-4 pt-sm-0"
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
  @Prop({ default: null }) readonly accountFolioNumber!: string
  @Prop({ default: null }) readonly transactionalFolioNumber!: string
  @Prop({ default: false }) readonly doValidate!: boolean

  // Rules for template
  readonly Rules = Rules

  // Local properties
  localFolioNumber = ''

  /** Called when component is mounted. */
  mounted (): void {
    // restore transactional FN if it exists, otherwise use account FN
    this.localFolioNumber = this.transactionalFolioNumber || this.accountFolioNumber
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

#transactional-folio-number {
  font-size: $px-16;
  color: $gray7;
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
