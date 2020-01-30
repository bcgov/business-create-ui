<template>
  <div>
     <v-layout row v-if="!isEditing">
        <v-flex md4>
          <label><strong>Registered Office Information</strong></label>
        </v-flex>
        <v-flex md4>
          <div><label><strong>Email Address</strong></label></div>
          <div>{{ !!contact.email ? contact.email : 'Not entered'}}</div>
        </v-flex>
        <v-flex md4>
          <div><label><strong>Phone Number</strong></label></div>
          <div>{{ !!contact.phone ? contact.phone : 'Not entered' }}
            Ext: {{ !!contact.phoneExtension ? contact.phoneExtension : 'Not entered' }}
          </div>
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
              v-model="contact.phoneExtension"
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
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

// Interfaces
import { BusinessContactIF } from '@/interfaces'

@Component({
  directives: { mask }
})
export default class BusinessContactInfo extends Vue {
  // Props
  @Prop()
  private initialValue!: BusinessContactIF

  @Prop({ default: false })
  private isEditing!: boolean

  @Prop({ default: false })
  private showErrors!: boolean

  // Properties
  private contact: BusinessContactIF = this.initialValue

  private formValid : boolean = false

  // Rules
  private emailRules = [
    (v: string) => !!v || 'Email address is required',
    (v: string) => /.+@.+\..+/.test(v) || 'Valid email is required'
  ]

  private phoneRules = [
    (v: any) => !v || (v.length === 0 || v.length === 14) || 'Phone number is invalid'
  ]

  private emailMustMatch (): string {
    return (this.contact.email === this.contact.confirmEmail) ? '' : 'Email addresses must match'
  }

  // Life cycle methods
  private mounted (): void {
    if (this.showErrors) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()
    }
  }

  // Watchers
  @Watch('initialValue', { deep: true, immediate: true })
  private onContactPropValueChanged (): void {
    this.contact = this.initialValue
  }

  @Watch('contact', { deep: true, immediate: true })
  private onContactInfoChanged (contactInfo : BusinessContactIF): void {
    this.emitContactInfo(contactInfo)
  }

  @Watch('formValid')
  private onFormValidityChange (val:boolean): void{
    this.emitContactFormState(val)
  }

  // Events
  @Emit('contactInfoChange')
  private emitContactInfo (contactInfo : BusinessContactIF): void { }

  @Emit('contactInfoFormValidityChange')
  private emitContactFormState (validity : boolean): void {}
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
