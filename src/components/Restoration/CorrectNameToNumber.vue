<template>
  <v-form id="correct-name-to-number-form" lazy-validation>
    <v-row no-gutters>
      <v-col>
        <v-checkbox
          v-model="correctToNumbered"
          id="correct-name-to-number-checkbox"
          class="mb-n5"
          :label="`Change the company name to ${businessId} B.C. Ltd.`"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, NameRequestIF } from '@/interfaces/'
import { NameChangeOptions } from '@/enums/'

@Component({})
export default class CorrectNameToNumber extends Vue {
  /** Form Submission Prop */
  @Prop({ default: null }) readonly formType!: NameChangeOptions

  @Action setNameRequest!: ActionBindingIF

  @Getter getNameRequest!: NameRequestIF
  @Getter getBusinessId!: string

  // Local properties
  correctToNumbered = false

  get businessId (): string {
    return this.getBusinessId && this.getBusinessId.substring(2)
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    // this component should only see correct-name-to-number form type
    if (this.formType === NameChangeOptions.CORRECT_NAME_TO_NUMBER) {
      // delete the current legal name and NR number
      this.setNameRequest({
        ...this.getNameRequest,
        legalName: undefined,
        nrNumber: undefined
      })
      this.emitIsSaved(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('isSaved')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitIsSaved (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('correctToNumbered')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.correctToNumbered
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-input--selection-controls {
  padding: 0;
  margin: 0;
}

:deep(.theme--light.v-label) {
  font-size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
