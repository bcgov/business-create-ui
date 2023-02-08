<template>
  <v-form id="correct-name-form" ref="correctNameForm" v-model="valid" lazy-validation>
    <v-row no-gutters>
      <v-col>
        <v-text-field
          v-model="companyName"
          id="company-name-input"
          class="mb-n3"
          filled
          :rules="companyNameRules"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CommonMixin } from '@/mixins/'
import { ActionBindingIF, NameRequestIF } from '@/interfaces/'
import { NameChangeOptions } from '@/enums/'

@Component({
  mixins: [
    CommonMixin
  ]
})
export default class CorrectCompanyName extends Vue {
  /** Form Submission Prop */
  @Prop({ default: null }) readonly formType!: NameChangeOptions

  @Action setNameRequest!: ActionBindingIF

  @Getter getNameRequestLegalName!: string
  @Getter getNameRequest!: NameRequestIF

  // Local properties
  protected valid = false
  protected companyName = ''

  // Form Ref
  $refs: { correctNameForm: HTMLFormElement }

  // Rules
  readonly companyNameRules = [
    (v: string) => !!v || ' A company name is required'
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // Set the current company name to the form
    if (this.getNameRequestLegalName) {
      this.companyName = this.getNameRequestLegalName
    }
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private onSubmit (): void {
    // this component should only see correct-name form type
    if (this.formType === NameChangeOptions.CORRECT_NAME) {
      // set the new company name
      this.setNameRequest({
        ...this.getNameRequest,
        legalName: this.companyName
      })
      this.emitIsSaved(true)
    }
  }

  /** Inform parent the process is complete. */
  @Emit('isSaved')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitIsSaved (isSaved: boolean): void {}

  /** Inform parent when form is valid and ready for submission. */
  @Watch('valid')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.valid
  }
}
</script>
