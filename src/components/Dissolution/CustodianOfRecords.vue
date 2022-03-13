<template>
  <div id="custodian-of-records">
    <!-- EDIT SECTION -->
    <template v-if="!isSummary">
      <v-form ref="addCustodianForm" v-model="addCustodianValid">
        <v-row no-gutters class="edit-section">
          <v-col cols="12" sm="3" class="pr-4 pb-4">
            <label class="title-label">
              {{ getCustodialRecordsResources.custodianTitle }}
            </label>
          </v-col>

          <v-col cols="12" sm="9">
            <!-- COOP only name input -->
            <template v-if="isTypeCoop">
              <label class="item-label">Person's Name</label>
              <v-row no-gutters class="pt-4" id="person-input">
                <v-col>
                  <v-text-field
                    filled
                    label="First Name"
                    id="person__first-name"
                    v-model.trim="custodian.officer.firstName"
                    :rules="Rules.FirstNameRules"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    filled
                    class="px-5"
                    label="Middle Name (Optional)"
                    id="person__middle-name"
                    v-model.trim="custodian.officer.middleName"
                    :rules="Rules.MiddleNameRules"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    filled
                    label="Last Name"
                    id="person__last-name"
                    v-model.trim="custodian.officer.lastName"
                    :rules="Rules.LastNameRules"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- Corps name or org input -->
            <template v-else>
              <v-radio-group
                column
                class="person-or-org-radio-group"
                v-model="custodian.officer.partyType"
                @change="syncCustodianPartyType"
              >
                <!-- Person input -->
                <v-radio :value=PartyTypes.PERSON>
                  <template slot="label">
                    <span class="item-label" :class="{ 'title-label': isInError }">
                      Person's Name
                    </span>
                  </template>
                </v-radio>
                <v-row no-gutters class="pt-4">
                  <v-col>
                    <v-text-field
                      filled
                      label="First Name"
                      id="person__first-name"
                      v-model.trim="custodian.officer.firstName"
                      :rules="isPerson ? Rules.FirstNameRules : []"
                      @input="syncCustodianPartyType(PartyTypes.PERSON)"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      class="px-5"
                      label="Middle Name (Optional)"
                      id="person__middle-name"
                      v-model.trim="custodian.officer.middleName"
                      :rules="isPerson ? Rules.MiddleNameRules : []"
                      @input="syncCustodianPartyType(PartyTypes.PERSON)"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      label="Last Name"
                      id="person__last-name"
                      v-model.trim="custodian.officer.lastName"
                      :rules="isPerson ? Rules.LastNameRules : []"
                      @input="syncCustodianPartyType(PartyTypes.PERSON)"
                    />
                  </v-col>
                </v-row>

                <!-- Org input -->
                <v-radio :value=PartyTypes.ORGANIZATION class="pt-2">
                  <template slot="label">
                    <span class="item-label" :class="{ 'title-label': isInError }">
                      Corporation or Firm Name
                    </span>
                  </template>
                </v-radio>
                <v-row no-gutters class="pt-4">
                  <v-col>
                    <v-text-field
                      filled
                      label="Corporation or Firm Name"
                      id="organization__name"
                      v-model.trim="custodian.officer.organizationName"
                      :rules="isOrg ? Rules.OrgNameRules : []"
                      @input="syncCustodianPartyType(PartyTypes.ORGANIZATION)"
                    />
                  </v-col>
                </v-row>
              </v-radio-group>

              <v-divider class="mt-n3 mb-8" />
            </template>

            <label class="item-label">Email Address</label>
            <v-row no-gutters class="pt-4">
              <v-col>
                <v-text-field
                  filled
                  label="Email Address"
                  id="person__email"
                  v-model="custodian.officer.email"
                  :rules="Rules.EmailRules"
                />
              </v-col>
            </v-row>

            <label class="item-label">Mailing Address</label>
            <MailingAddress
              ref="mailingAddress"
              id="mailing-address"
              class="pt-4"
              :editing="true"
              :address="custodian.mailingAddress"
              :schema="getAddressSchema"
              @update:address="syncAddresses(custodian.mailingAddress, $event)"
              @valid="updateAddressValid('mailingAddress', $event)"
            />

            <v-checkbox
              id="delivery-mailing-same-chkbx"
              class="inherit-checkbox mt-0 pt-0"
              label="Delivery Address same as Mailing Address"
              v-model="custodian.inheritMailingAddress"
            />

            <div v-if="!inheritMailingAddress" class="pt-4">
              <label class="item-label">Delivery Address</label>
              <DeliveryAddress
                ref="deliveryAddress"
                id="Delivery-address"
                class="pt-4"
                :editing="true"
                :address="custodian.deliveryAddress"
                :schema="getAddressSchema"
                @update:address="syncAddresses(custodian.deliveryAddress, $event)"
                @valid="updateAddressValid('deliveryAddress', $event)"
              />
            </div>
          </v-col>
        </v-row>
      </v-form>
    </template>

    <!-- SUMMARY SECTION -->
    <template v-else>
      <v-row no-gutters class="summary-section">
        <v-col cols="12" sm="3" class="inner-col-1 pr-4 pb-4">
          <label class="summary-section-title">Custodian of Records</label>
        </v-col>

        <v-col cols="12" sm="9" class="inner-col-2 mt-n4">
          <v-row no-gutters>
            <v-col cols="12" sm="5" class="pt-4 pr-4">
              <label class="summary-sub-label">Name</label>
              <div class="summary-text">{{ getCustodianName }}</div>
            </v-col>

            <v-col cols="12" sm="5" class="pt-4 pr-4">
              <label class="summary-sub-label">Email Address</label>
              <div class="summary-text">{{ getDissolutionCustodianEmail || '(Not entered)' }}</div>
            </v-col>

            <v-col cols="12" sm="5" class="pt-4 pr-4">
              <label class="summary-sub-label">Mailing Address</label>
              <MailingAddress :address="getDissolutionCustodian.mailingAddress" />
            </v-col>

            <v-col cols="12" sm="5" class="pt-4 pr-4">
              <label class="summary-sub-label">Delivery Address</label>
              <div v-if="getDissolutionCustodian.inheritMailingAddress">
                Same as Mailing Address
              </div>
              <DeliveryAddress v-else :address="getDissolutionCustodian.deliveryAddress" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CoopOfficeAddressSchema, OfficeAddressSchema } from '@/schemas'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ActionBindingIF, AddressIF, AddressSchemaIF, CustodianResourceIF, FormIF, OrgPersonIF } from '@/interfaces'
import { PartyTypes } from '@/enums'
import { CommonMixin } from '@/mixins'
import { Rules } from '@/rules'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class CustodianOfRecords extends Mixins(CommonMixin) {
  // Refs for root form and base address components to access form validation
  $refs!: {
    addCustodianForm: FormIF,
    mailingAddress: FormIF
    deliveryAddress: FormIF
  }

  @Prop({ default: false })
  readonly isSummary!: boolean

  @Prop({ default: false })
  readonly showErrors!: boolean

  @Getter getDissolutionCustodian!: OrgPersonIF
  @Getter getDissolutionCustodianEmail!: string
  @Getter getCustodialRecordsResources!: CustodianResourceIF
  @Getter isTypeCoop!: boolean

  @Action setCustodianOfRecords: ActionBindingIF

  // Local properties
  private addCustodianValid = true
  private custodian: OrgPersonIF = null
  private defaultAddress: AddressIF = null

  // Validation events from BaseAddress:
  private mailingAddressValid: boolean = true
  private deliveryAddressValid: boolean = true

  // Schema and rules for template
  readonly OfficeAddressSchema = OfficeAddressSchema
  readonly CoopOfficeAddressSchema = CoopOfficeAddressSchema
  readonly Rules = Rules
  readonly PartyTypes = PartyTypes

  created (): void {
    // Define local model using values initialized in store.
    this.custodian = this.getDissolutionCustodian

    // Corps are required to choose a party type, where coops are pre-determined to be of person type.
    if (this.isTypeCoop) this.custodian.officer.partyType = PartyTypes.PERSON

    // Define default address using resource values
    this.defaultAddress = {
      addressCity: '',
      addressCountry: this.getCustodialRecordsResources?.baseAddressValues?.country,
      addressRegion: this.getCustodialRecordsResources?.baseAddressValues?.region,
      deliveryInstructions: '',
      postalCode: '',
      streetAddress: '',
      streetAddressAdditional: ''
    }

    // Assign default address values if none selected
    // We only need to check this single property once as there will always be a value if a draft is saved
    if (!this.custodian?.mailingAddress?.addressCountry) {
      this.custodian.mailingAddress = { ...this.defaultAddress }
      this.custodian.deliveryAddress = { ...this.defaultAddress }
    }
  }

  /** The custodian person or org name to display. */
  private get getCustodianName (): string {
    const { firstName, middleName, lastName, organizationName } = this.getDissolutionCustodian?.officer
    if (this.isPerson && firstName && lastName) {
      return `${firstName} ${middleName} ${lastName}`
    }
    if (this.isOrg && organizationName) {
      return organizationName
    }
    return '(Not entered)'
  }

  /** The address schema. */
  private get getAddressSchema (): AddressSchemaIF {
    return this.isTypeCoop ? CoopOfficeAddressSchema : OfficeAddressSchema
  }

  /** Is true when the form requirements are not met for party type. */
  private get isInError (): boolean {
    switch (this.custodian.officer.partyType) {
      case PartyTypes.PERSON:
        return !(this.custodian.officer.firstName && this.custodian.officer.lastName)
      case PartyTypes.ORGANIZATION:
        return !this.custodian.officer.organizationName
      default:
        return true
    }
  }

  /** Whether the add custodian form is valid. */
  private get isFormValid (): boolean {
    const deliveryValid = this.inheritMailingAddress ? true : this.deliveryAddressValid
    return (
      !!this.getDissolutionCustodian.officer.partyType &&
      this.addCustodianValid &&
      this.mailingAddressValid &&
      deliveryValid
    )
  }

  /** Is true when the party type is a person. */
  private get isPerson (): boolean {
    return (this.getDissolutionCustodian?.officer.partyType === PartyTypes.PERSON)
  }

  /** Is true when the party type is an organization. */
  private get isOrg (): boolean {
    return (this.getDissolutionCustodian?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  /** Is true when the user selects to inherit the mailing address. */
  private get inheritMailingAddress (): boolean {
    return this.getDissolutionCustodian?.inheritMailingAddress
  }

  /** Keep local custodian addresses in sync with base address common component. */
  private syncAddresses (baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    if (this.inheritMailingAddress) {
      this.custodian.deliveryAddress = { ...newAddress }
    }
  }

  /** Sync party type selection with store and reset the unselected party type fields. */
  private syncCustodianPartyType (partyType: PartyTypes): void {
    this.custodian.officer.partyType = partyType
    switch (partyType) {
      case PartyTypes.PERSON:
        this.custodian.officer.organizationName = ''
        break
      case PartyTypes.ORGANIZATION:
        this.custodian.officer.firstName = ''
        this.custodian.officer.middleName = ''
        this.custodian.officer.lastName = ''
        break
    }
  }

  /**
   * Keeps track of the validity of the specified address.
   * @param addressToValidate the address to set the validity of
   * @param isValid a boolean indicating the validity of the address
   */
  private updateAddressValid (addressToValidate: string, isValid: boolean): void {
    switch (addressToValidate) {
      case 'mailingAddress':
        this.mailingAddressValid = isValid
        break
      case 'deliveryAddress':
        this.deliveryAddressValid = isValid
        break
      default:
        console.log(`Error: Address- ${addressToValidate} not found`)
    }
  }

  @Watch('$route')
  private validateAddressForms (): void {
    this.$refs.mailingAddress && this.$refs.mailingAddress.$refs.addressForm.validate()
    this.$refs.deliveryAddress && this.$refs.deliveryAddress.$refs.addressForm.validate()
  }

  /** Emits the valid state of the add custodian form. */
  @Watch('isFormValid')
  @Emit('valid')
  private emitValid (): boolean {
    return this.isFormValid
  }

  /** Keep local custodian model in sync with store. */
  @Watch('custodian', { deep: true })
  private onCustodianChange (): void {
    this.setCustodianOfRecords(this.custodian)
    this.emitValid()
  }

  /** Sets the Delivery Address to the Mailing Address. */
  @Watch('inheritMailingAddress')
  private setDeliveryAddressToMailingAddress (): void {
    if (this.inheritMailingAddress) {
      this.custodian.deliveryAddress = cloneDeep(this.getDissolutionCustodian.mailingAddress)
    } else {
      // Clear to default
      this.custodian.deliveryAddress = { ...this.defaultAddress }
    }
  }

  /** Handle validation event from parent. */
  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    this.$refs.addCustodianForm.validate()
    this.validateAddressForms()
  }
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

.person-or-org-radio-group {
  padding-top: 0;
  margin-top: 0;

  .v-radio {
    align-items: start;
  }

  .v-radio:not(:first-child) {
    padding-top: 1.5rem;
  }

  ::v-deep .v-input--selection-controls__input {
    margin-right: 1rem;
  }
}

.inherit-checkbox {
  ::v-deep .v-messages {
    display: none !important;
  }
}

.summary-section {
  font-size: $px-16;
}

.inner-col-1 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, decrease width by 1/2 container margin + padding
  flex: 0 0 calc(25% - 1rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1rem);
  max-width: calc(75% + 1rem);
}

.summary-sub-label {
  font-size: $px-14;
  font-weight: bold;
  color: $gray9;
}

.summary-text,
.base-address {
  color: $gray7;
}

// Vuetify styling overrides
::v-deep .v-text-field .v-label {
  font-weight: normal;
  font-size: $px-16;
  color: $gray7;
  letter-spacing: -0.2px;
}

::v-deep .v-input--selection-controls .v-input__slot > .v-label {
  font-size: $px-16;
  color: $gray7;
  font-weight: normal;
}

// italicize delivery instructions
::v-deep .base-address .address-block .delivery-instructions {
  font-style: italic;
}
</style>
