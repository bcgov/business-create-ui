<template>
  <v-form id="correct-nr-form" ref="correctNrForm" v-model="formValid" lazy-validation>
    <!-- Dialogs -->
    <ConfirmDialogShared
      ref="confirm"
      attach="#app"
    />

    <v-row no-gutters>
      <v-col cols="1" class="mt-1">
        <v-btn x-small fab outlined :ripple="false" color="gray7" class="step-icon" tabindex="-1">1</v-btn>
      </v-col>
      <v-col>
        <v-text-field
          v-model="nameRequestNumber"
          class="text-input-field"
          filled
          label="Enter the NR Number"
          hint="Example: NR 1234567"
          persistent-hint
          :rules="done && nrNumRules"
          id="nr-number"
          @keyup="uppercase('nameRequestNumber')"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-4 mb-n1">
      <v-col cols="1" class="mt-1">
        <v-btn x-small fab outlined :ripple="false" color="gray7" class="step-icon" tabindex="-1">2</v-btn>
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="applicantPhone"
          class="text-input-field"
          filled
          label="Applicant's Phone Number"
          hint="Example: 555-555-5555"
          persistent-hint
          type="tel"
          :rules="done && phoneRules"
          id="applicant-phone"
        />
      </v-col>
      <div class="ma-5">or</div>
      <v-col>
        <v-text-field
          v-model="applicantEmail"
          class="text-input-field"
          filled
          label="Applicant's Notification Email"
          hint="Example: name@email.com"
          persistent-hint
          type="email"
          :rules="done && emailRules"
          id="applicant-email"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ConfirmDialog as ConfirmDialogShared } from '@bcrs-shared-components/confirm-dialog/'
import { CommonMixin, NameRequestMixin } from '@/mixins/'
import { ActionBindingIF, ConfirmDialogType, NameRequestIF, NrCorrectionIF, NrResponseIF } from '@/interfaces/'
import { NameChangeOptions } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'

@Component({
  components: {
    ConfirmDialogShared
  },
  mixins: [
    CommonMixin,
    NameRequestMixin
  ]
})
export default class CorrectNameRequest extends Vue {
  // Refs
  $refs!: {
    confirm: ConfirmDialogType
    correctNrForm: HTMLFormElement
  }

  /** The form type. */
  @Prop({ default: null }) readonly formType!: NameChangeOptions

  /** Whether to perform validation. */
  @Prop({ default: false }) readonly validate!: boolean

  @Action setNameRequest!: ActionBindingIF

  @Getter getNameRequest!: NameRequestIF
  @Getter getEntityType!: CorpTypeCd

  // V-model properties
  protected formValid = false
  protected nameRequestNumber = ''
  protected applicantPhone = ''
  protected applicantEmail = ''

  // FUTURE: use this to turn on/off validations
  protected done = true

  // Rules
  readonly nrNumRules = [
    (v: string) => !!v || 'Name Request Number is required',
    (v: string) => this.isValidNrNumber(v) || 'Name Request Number is invalid'
  ]
  readonly phoneRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => !(v?.length > 12) || 'Phone number is invalid'
  ]
  readonly emailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.isValidEmail(v) || 'Email is invalid'
  ]

  // Validations
  get isFormValid (): boolean {
    return this.formValid && !!this.nameRequestNumber &&
      (!!this.applicantPhone || !!this.applicantEmail)
  }

  private isValidEmail (value: string): boolean {
    if (value?.length < 1) return true
    return ((!!this.applicantPhone && !!value) || !!this.validateEmailFormat(value))
  }

  private isValidNrNumber (value: string): boolean {
    const VALID_FORMAT = new RegExp(/^(NR )\d{7}$/)
    return VALID_FORMAT.test(value)
  }

  private validateEmailFormat (value: string): boolean {
    // eslint-disable-next-line max-len
    const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return VALID_FORMAT.test(value)
  }

  @Watch('validate')
  private onValidate (): void {
    this.$refs.correctNrForm.validate()
  }

  /** Watch for form submission and emit results. */
  @Watch('formType')
  private async onSubmit (): Promise<any> {
    // this component should only see correct-new-nr form type
    if (this.formType === NameChangeOptions.CORRECT_NEW_NR) {
      try {
        // Validate and return the name request data
        const nr: NrResponseIF = await this.validateNameRequest(
          this.nameRequestNumber,
          this.applicantPhone,
          this.applicantEmail
        )

        if (this.getEntityType !== nr.legalType) {
          // Invalid NR type, inform parent the process is done and prompt confirm dialog
          this.emitIsSaved()

          const dialogContent = `<p class="info-text">This ${GetCorpFullDescription(nr.entity_type_cd)} ` +
            `Name Request does not match the current business type ` +
            `<b>${GetCorpFullDescription(this.getEntityType)}</b>.\n\n` +
            `The Name Request type must match the business type before you can continue.</p>`
          await this.showConfirmDialog(
            this.$refs.confirm,
            'Name Request Type Does Not Match Business Type',
            dialogContent,
            'OK'
          )
        } else {
          this.parseNameRequest(nr)
          this.emitIsSaved(true)
        }
      } catch {
        // "validateNameRequest" handles its own errors
        // Inform parent process is complete
        this.emitIsSaved()
      }
    }
  }

  /**
   * Parse and Set the Name Request date to Store.
   * @param nr The name request data
   */
  private parseNameRequest (nr: NrResponseIF): void {
    const nrCorrection: NrCorrectionIF = {
      legalType: nr.legalType,
      nrNumber: this.nameRequestNumber,
      legalName: this.getNrApprovedName(nr) || '',
      expiry: nr.expirationDate,
      status: nr.state,
      requestType: nr.request_action_cd,
      applicant: {
        fullName: this.formatFullName(nr.applicants),
        fullAddress: this.formatFullAddress(nr.applicants),
        phoneNumber: nr.applicants.phoneNumber,
        emailAddress: nr.applicants.emailAddress
      }
    }

    // set the new correction NR data
    this.setNameRequest({ ...this.getNameRequest, ...nrCorrection })
  }

  /** Inform parent the process is complete. */
  @Emit('isSaved')
  private emitIsSaved (isSaved = false): boolean {
    if (!isSaved) this.$refs.correctNrForm.resetValidation()
    return isSaved
  }

  /** Inform parent when form is valid and ready for submission. */
  @Watch('formValid')
  @Watch('nameRequestNumber')
  @Watch('applicantPhone')
  @Watch('applicantEmail')
  @Emit('isValid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.step-icon {
  font-size: small;
  font-weight: bold;
  pointer-events: none;
}

:deep(#nr-number) {
  // hide uppercase transformation delay from user
  text-transform: uppercase;
}

:deep(.theme--light.v-label) {
  font-size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
