<template>
  <div id="business-contact-info">
     <v-layout row v-if="!isEditing">
        <v-flex md4>
          <label><strong>Registered Office Contact Information</strong></label>
        </v-flex>
        <v-flex md4>
          <div><label><strong>Email Address</strong></label></div>
          <div id="lbl-email">{{ !!contact.email ? contact.email : '(Not entered)' }}</div>
        </v-flex>
        <v-flex md4>
          <div><label><strong>Phone Number</strong></label></div>
          <div id="lbl-phone" v-if="!!contact.phone">{{ contact.phone }}
            <span v-if="!!contact.extension">Ext: {{ contact.extension }}</span>
          </div>
          <div id="lbl-phone" v-else>(Not entered)</div>
        </v-flex>
    </v-layout>
    <v-card flat class="business-contact-container" v-else>
      <v-form v-model="formValid" ref="form" name="business-contact-form">
       <v-row>
          <v-col cols="12">
            <v-text-field
              filled
              label="Email Address"
              req
              persistent-hint
              :rules="emailRules"
              v-model="contact.email"
              id="txt-email">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              filled
              label="Confirm Email Address"
              req
              persistent-hint
              :error-messages="emailMustMatch()"
              v-model="contact.confirmEmail"
              id="txt-confirm-email">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              filled
              label="Phone Number"
              persistent-hint
              hint="Example: (555) 555-5555"
              type="tel"
              v-mask="['(###) ###-####']"
              v-model="contact.phone"
              :rules="phoneRules"
              id="txt-phone">
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              filled
              label="Extension"
              persistent-hint
              v-mask="'#####'"
              v-model="contact.extension"
              :disabled="!contact.phone"
              id="txt-phone-extension">
            </v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

// Interfaces
import { BusinessContactIF } from '@/interfaces'

// Mixins
import { CommonMixin } from '@/mixins'

@Component({
  directives: { mask }
})
export default class BusinessContactInfo extends Mixins(CommonMixin) {
  @Prop()
  private readonly initialValue!: BusinessContactIF

  @Prop({ default: false })
  private readonly isEditing!: boolean

  @Prop({ default: false })
  private readonly showErrors!: boolean

  private contact: BusinessContactIF = this.initialValue
  private formValid: boolean = false

  // Used as an initial comparison to re-validate the form.
  // This is so we don't flag errors for a new application right away.
  private defaultBusinessContact: BusinessContactIF = {
    email: '',
    confirmEmail: '',
    phone: '',
    extension: ''
  }

  // Rules
  private emailRules = [
    (v: string) => !!v || 'Email address is required',
    (v: string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(v) || 'Valid email is required'
    }
  ]

  private phoneRules = [
    (v: any) => !v || (v.length === 0 || v.length === 14) || 'Phone number is invalid'
  ]

  private emailMustMatch (): string {
    return (this.contact.email === this.contact.confirmEmail) ? '' : 'Email addresses must match'
  }

  // Watchers
  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    if (this.showErrors) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()
    } else if (this.$refs.form && !this.isSame(this.initialValue, this.defaultBusinessContact)) {
      (this.$refs.form as any).validate()
    }
  }

  @Watch('initialValue', { deep: true, immediate: true })
  private onContactPropValueChanged (): void {
    this.contact = this.initialValue
  }

  @Watch('contact', { deep: true, immediate: true })
  private onContactInfoChanged (contactInfo : BusinessContactIF): void {
    this.emitContactInfo(contactInfo)
  }

  @Watch('formValid')
  private onFormValidityChange (val: boolean): void {
    this.emitContactFormState(val)
  }

  // Events
  @Emit('contactInfoChange')
  private emitContactInfo (contactInfo: BusinessContactIF): void { }

  @Emit('contactInfoFormValidityChange')
  private emitContactFormState (valid: boolean): void { }
}
</script>

<style lang="scss" scoped>
[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.business-contact-container {
  margin-top: 1rem;
  padding: 1.25rem;
}
</style>
