<template>
  <div>
    <div v-if="!isEditing">
      <div>Email Address: {{ contact.email }}</div>
      <div>Phone: {{ contact.phone }} ext:{{ contact.phoneExtension }}</div>
    </div>
    <v-card flat class="business-contact-container" v-else>
      <v-form v-model="formValid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field filled label="Email Address" req persistent-hint :rules="emailRules" v-model="contact.email">
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
            >
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
            >
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              filled
              label="Extension"
              persistent-hint
              :rules="extensionRules"
              v-mask="'#####'"
              v-model="contact.phoneExtension"
            >
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
 @Prop({
   default: ():BusinessContactIF => ({
     email: '',
     confirmEmail: '',
     phone: '',
     phoneExtension: ''
   })
 })
  private initialValue: BusinessContactIF

  @Prop({ default: false })
  private isEditing: boolean

  @Prop({ default: false })
  private showErrors: boolean

  // Properties
  private contact: BusinessContactIF = this.initialValue

  private formValid : boolean = false

  // Rules
  private emailRules = [
    (v: any) => !!v || 'Email address is required',
    (v: any) => /.+@.+\..+/.test(v) || 'Valid email is required'
  ]

  private phoneRules = [
    (v: any) => !v || (v.length === 0 || v.length === 14) || 'Phone number is invalid'
  ]

  private extensionRules = [
    (v: any) => !v || (v.length >= 0 || v.length <= 5) || 'Extension is invalid'
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
  private emitContactFormState (validity : boolean): void { }
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
