<template>
  <div id="business-contact-info">
    <!-- EDIT SECTION -->
    <template v-if="isEditing">
      <v-form v-model="formValid" ref="form">
        <v-row no-gutters class="edit-section">
          <!-- Email Address -->
          <v-col cols="12" sm="3" class="pr-4">
            <label class="title-label">Email Address</label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <v-text-field
              filled
              label="Email Address"
              req
              persistent-hint
              :rules="Rules.EmailRules"
              v-model="contact.email"
              id="txt-email"
            />
          </v-col>

          <!-- Confirm Email -->
          <v-col cols="12" sm="3" class="pr-4">
            <label class="title-label">Confirm Email</label>
          </v-col>
          <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
            <v-text-field
              filled
              label="Confirm Email Address"
              req
              persistent-hint
              :error-messages="emailMustMatch()"
              v-model="contact.confirmEmail"
              id="txt-confirm-email"
            />
          </v-col>

          <!-- Phone Number -->
          <v-col cols="12" sm="3" class="pr-4">
            <label class="title-label">Phone Number</label>
          </v-col>
          <v-col cols="6" sm="4" class="pr-2 pt-4 pt-sm-0">
            <v-text-field
              filled
              label="Phone Number"
              persistent-hint
              hint="Example: (555) 555-5555"
              type="tel"
              v-mask="['(###) ###-####']"
              v-model="contact.phone"
              :rules="Rules.PhoneRules"
              id="txt-phone"
            />
          </v-col>
          <v-col cols="6" sm="4" class="pl-2 pt-4 pt-sm-0">
            <v-text-field
              filled
              label="Extension (Optional)"
              persistent-hint
              v-mask="'#####'"
              v-model="contact.extension"
              :disabled="!contact.phone"
              id="txt-phone-extension"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>

    <!-- SUMMARY SECTION -->
    <template v-else>
      <v-row no-gutters class="summary-section">
        <v-col cols="12" sm="3" class="pr-4">
          <label v-if="isIncorporationFiling">Registered Office Contact Information</label>
          <label v-else>Business Contact Information</label>
        </v-col>

        <v-col cols="12" sm="4" class="pr-4 pt-4 pt-sm-0">
          <label class="email-header">Email Address</label>
          <div id="lbl-email">{{ !!contact.email ? contact.email : '(Not entered)' }}</div>
        </v-col>

        <v-col cols="12" sm="4" class="pr-4 pt-4 pt-sm-0">
          <label class="phone-header">Phone Number</label>
          <div id="lbl-phone" v-if="!!contact.phone">{{ contact.phone }}
            <span v-if="!!contact.extension">Ext: {{ contact.extension }}</span>
          </div>
          <div id="lbl-phone" v-else>(Not entered)</div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { mask } from 'vue-the-mask'
import { ContactPointIF, EmptyContactPoint } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { Rules } from '@/rules'

@Component({
  directives: { mask }
})
export default class BusinessContactInfo extends Mixins(CommonMixin) {
  @Prop({ default: () => {} })
  readonly initialValue!: ContactPointIF

  @Prop({ default: false })
  readonly isEditing!: boolean

  @Prop({ default: false })
  readonly showErrors!: boolean

  @Getter isIncorporationFiling!: boolean

  // Rules for template
  readonly Rules = Rules

  private contact: ContactPointIF = this.initialValue
  private formValid: boolean = false

  // Rules
  private emailMustMatch (): string {
    return (this.contact.email === this.contact.confirmEmail) ? '' : 'Email addresses must match'
  }

  // Watchers
  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    if (this.showErrors) {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()
    } else if (this.$refs.form && !this.isSame(this.initialValue, EmptyContactPoint)) {
      (this.$refs.form as any).validate()
    }
  }

  @Watch('initialValue', { deep: true, immediate: true })
  private onContactPropValueChanged (): void {
    this.contact = this.initialValue
  }

  @Watch('contact', { deep: true, immediate: true })
  private onContactChanged (contact: ContactPointIF): void {
    this.emitContactInfo(contact)
  }

  @Watch('formValid')
  private onFormValidityChange (val: boolean): void {
    this.emitValid(val)
  }

  // Events
  @Emit('update')
  private emitContactInfo (contactInfo: ContactPointIF): void {}

  @Emit('valid')
  private emitValid (valid: boolean): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.edit-section {
  font-size: $px-16;
  color: $gray7;
}

.title-label,
.item-label,
.summary-section-title {
  font-weight: bold;
  color: $gray9;
}

.email-header,
.phone-header {
  font-size: $px-14;
  font-weight: bold;
}

// un-bold v-text-field labels
::v-deep .v-label {
  font-weight: normal;
  color: $gray7;
}
</style>
