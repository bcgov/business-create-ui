<template>
  <v-card flat class="px-5 py-6" id="document-delivery">
    <v-row class="py-3" no-gutters>
      <v-col :cols="3">
        <label class="font-weight-bold">Registered Office</label>
      </v-col>
      <v-col :cols="9">
        <v-card-text id="office-email" class="pa-0">{{getBusinessContact.email || 'Not entered'}}</v-card-text>
      </v-col>
    </v-row>
    <v-row class="py-3" no-gutters>
      <v-col :cols="3">
        <label class="font-weight-bold" :class="{ 'error-text': invalidSection }">Completing Party</label>
      </v-col>
      <v-col cols="9" class="pr-1" v-if="editableCompletingParty">
        <v-text-field
          v-model="optionalEmail"
          id="optionalEmail"
          class="text-input-field"
          filled
          label="Client Email Address (Optional)"
          hint="Example: name@email.com"
          persistent-hint
          validate-on-blur
          :rules="entityEmailRules"
        />
      </v-col>
      <v-col :cols="9" v-else>
        <v-card-text id="completing-party-email" class="pa-0">{{getUserEmail || 'Not entered'}}</v-card-text>
      </v-col>
    </v-row>
    <v-row class="py-3" no-gutters v-if="showCustodianEmail">
      <v-col :cols="3">
        <label class="font-weight-bold">Custodian of Records</label>
      </v-col>
      <v-col :cols="9">
        <v-card-text id="custodian-email" class="pa-0">{{getCustodianEmail || 'Not entered'}}</v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, BusinessContactIF, DocumentDeliveryIF } from '@/interfaces'

@Component({})
export default class DocumentDelivery extends Vue {
  @Getter getBusinessContact!: BusinessContactIF
  @Getter getCustodianEmail!: string
  @Getter getDocumentDelivery!: DocumentDeliveryIF
  @Getter getUserEmail!: string

  // Global actions
  @Action setDocumentOptionalEmail!: ActionBindingIF
  @Action setDocumentOptionalEmailValidity!: ActionBindingIF

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

  mounted () {
    this.optionalEmail = this.getDocumentDelivery.documentOptionalEmail
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
  onOptionalEmailChanged (val: string): void {
    if (this.validateEmailFormat(val)) {
      this.setDocumentOptionalEmail(val)
      this.setDocumentOptionalEmailValidity(true)
    } else {
      this.setDocumentOptionalEmailValidity(false)
    }
  }

  @Emit('valid')
  private async emitValid (): Promise<boolean> {
    // wait for form to update itself before checking validity
    await Vue.nextTick()
    return (this.validateEmailFormat(this.optionalEmail))
  }
}
</script>
