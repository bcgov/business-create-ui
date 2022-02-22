<template>
  <v-card flat id="document-delivery">
    <v-row no-gutters>
      <v-col cols="3">
        <label class="font-weight-bold">Registered Office</label>
      </v-col>
      <v-col cols="9">
        <v-card-text id="office-email" class="pa-0">
          {{registeredOfficeEmail || 'Not entered'}}
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="3">
        <label class="font-weight-bold" :class="{ 'error-text': invalidSection }">
          Completing Party
        </label>
      </v-col>
      <v-col cols="9" v-if="editableCompletingParty">
        <v-text-field
          filled persistent-hint validate-on-blur
          id="optionalEmail"
          class="text-input-field"
          label="Client Email Address (Optional)"
          hint="Example: name@email.com"
          v-model="optionalEmail"
          :rules="entityEmailRules"
        />
      </v-col>
      <v-col :cols="9" v-else>
        <v-card-text id="completing-party-email" class="pa-0">
          {{completingPartyEmail || 'Not entered'}}
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters v-if="showCustodianEmail">
      <v-col cols="3">
        <label class="font-weight-bold">Custodian of Records</label>
      </v-col>
      <v-col cols="9">
        <v-card-text id="custodian-email" class="pa-0">
          {{custodianEmail || 'Not entered'}}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class DocumentDelivery extends Vue {
  @Prop({ default: null }) readonly registeredOfficeEmail: string
  @Prop({ default: null }) readonly custodianEmail: string
  @Prop({ default: null }) readonly completingPartyEmail: string
  @Prop({ default: null }) readonly documentOptionalEmail: string

  @Prop({ default: false }) readonly editableCompletingParty: boolean
  @Prop({ default: false }) readonly showCustodianEmail: boolean
  @Prop({ default: false }) readonly invalidSection: boolean

  // Local properties
  private optionalEmail: string = ''

  private entityEmailRules = [
    (v: string) => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    (v: string) => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    (v: string) => this.validateEmailFormat(v) || 'Enter valid email address'
  ]

  mounted (): void {
    this.optionalEmail = this.documentOptionalEmail
  }

  private validateEmailFormat (value: string): boolean {
    // allow empty as the email is optional
    if (!value) {
      return true
    } else {
      const VALID_FORMAT = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      return VALID_FORMAT.test(value)
    }
  }

  @Watch('optionalEmail')
  private onOptionalEmailChanged (val: string): void {
    if (this.validateEmailFormat(val)) {
      this.emitOptionalEmail()
      this.emitValid(true)
    } else {
      this.emitValid(false)
    }
  }

  @Emit('update:optionalEmail')
  private emitOptionalEmail (): string {
    return this.optionalEmail
  }

  @Emit('valid')
  private emitValid (valid: boolean): boolean {
    return valid
  }
}
</script>
