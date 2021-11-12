<template>
  <div id="custodian-of-records">
    <template v-if="!isSummary">
      <!-- Address Form -->
      <v-card flat class="rounded-4">
        <v-form
          ref="addCustodianForm"
          class="add-custodian-form"
          v-model="addCustodianValid"
        >
          <div class="section-container pt-10" :class="{ 'invalid-section': showErrors && !isFormValid }">
            <v-row no-gutters>
              <v-col cols="12" md="3" lg="3">
                <label class="section-label title-label">
                  {{ getCustodialRecordsResources.custodianTitle }}
                </label>
              </v-col>
              <v-col cols="12" md="9" lg="9">
                <!-- COOP only name input -->
                <template v-if="isTypeCoop">
                  <label>Person's Name</label>
                  <v-row no-gutters class="pt-4" id="person-input">
                    <v-col>
                      <v-text-field
                        filled
                        label="First Name"
                        id="person__first-name"
                        v-model="custodian.officer.firstName"
                        :rules="Rules.FirstNameRules"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        filled
                        class="px-5"
                        label="Middle Name (Optional)"
                        id="person__middle-name"
                        v-model="custodian.officer.middleName"
                        :rules="Rules.MiddleNameRules"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        filled
                        label="Last Name"
                        id="person__last-name"
                        v-model="custodian.officer.lastName"
                        :rules="Rules.LastNameRules"
                      />
                    </v-col>
                  </v-row>
                </template>
                <!-- Corps name or org input -->
                <template v-else>
                  <v-radio-group
                    column
                    class="person-or-org-options"
                    v-model="custodian.officer.partyType"
                    @change="syncCustodianPartyType"
                  >
                    <!-- Person input -->
                    <v-radio :value=PartyTypes.PERSON>
                      <template slot="label">
                        <span
                          class="person-or-org-option"
                          :class="{ 'title-label': isInError }"
                        >
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
                          v-model="custodian.officer.firstName"
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
                          v-model="custodian.officer.middleName"
                          :rules="isPerson ? Rules.MiddleNameRules : []"
                          @input="syncCustodianPartyType(PartyTypes.PERSON)"
                        />
                      </v-col>
                      <v-col>
                        <v-text-field
                          filled
                          label="Last Name"
                          id="person__last-name"
                          v-model="custodian.officer.lastName"
                          :rules="isPerson ? Rules.LastNameRules : []"
                          @input="syncCustodianPartyType(PartyTypes.PERSON)"
                        />
                      </v-col>
                    </v-row>

                    <!-- Org input -->
                    <v-radio :value=PartyTypes.ORGANIZATION class="pt-2">
                      <template slot="label">
                        <span
                          class="person-or-org-option"
                          :class="{ 'title-label': isInError }"
                        >
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
                          v-model="custodian.officer.organizationName"
                          :rules="isOrg ? Rules.OrgNameRules : []"
                          @input="syncCustodianPartyType(PartyTypes.ORGANIZATION)"
                        />
                      </v-col>
                    </v-row>
                  </v-radio-group>

                  <v-divider class="mt-n3 mb-8" />
                </template>

                <label>Email Address</label>
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

                <label>Mailing Address</label>
                <mailing-address
                  ref="mailingAddress"
                  id="mailing-address"
                  class="pt-4"
                  :editing="true"
                  :address="custodian.mailingAddress"
                  :schema="OfficeAddressSchema"
                  @update:address="syncAddresses(custodian.mailingAddress, $event)"
                  @valid="updateAddressValid('mailingAddress', $event)"
                />

                <v-checkbox
                  id="delivery-mailing-same-chkbx"
                  class="inherit-checkbox mt-1 mb-2"
                  label="Delivery Address same as Mailing Address"
                  v-model="inheritMailingAddress"
                />

                <template v-if="!inheritMailingAddress">
                  <label>Delivery Address</label>
                  <delivery-address
                    ref="deliveryAddress"
                    id="Delivery-address"
                    class="pt-4"
                    :editing="true"
                    :address="custodian.deliveryAddress"
                    :schema="OfficeAddressSchema"
                    @update:address="syncAddresses(custodian.deliveryAddress, $event)"
                    @valid="updateAddressValid('deliveryAddress', $event)"
                  />
                </template>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card>
    </template>

    <!-- Summary template -->
    <template v-else>
      <div class="summary-section">
        <v-row no-gutters>
          <v-col cols="12" md="6" lg="6">
            <div class="summary-sub-label">Name</div>
            <span class="summary-text">{{ getCustodianName }}</span>
          </v-col>
          <v-col cols="12" md="6" lg="6">
            <div class="summary-sub-label">Email Address</div>
            <span class="summary-text">{{ getCustodianEmail || '(Not entered)' }}</span>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col cols="12" md="6" lg="6">
            <label class="summary-sub-label">Mailing Address</label>
            <mailing-address :address="getCustodian.mailingAddress" />
          </v-col>
          <v-col cols="12" md="6" lg="6">
            <label class="summary-sub-label">Delivery Address</label>
            <div v-if="isSame(getCustodian.mailingAddress, getCustodian.deliveryAddress)">
              Same as Mailing Address
            </div>
            <delivery-address v-else :address="getCustodian.deliveryAddress" />
          </v-col>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { OfficeAddressSchema } from '@/schemas'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ActionBindingIF, AddressIF, FormIF, OrgPersonIF } from '@/interfaces'
import { PartyTypes } from '@/enums'
import { CommonMixin, EntityFilterMixin } from '@/mixins'
import { Rules } from '@/rules'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    'delivery-address': BaseAddress,
    'mailing-address': BaseAddress
  }
})
export default class CustodianOfRecords extends Mixins(CommonMixin, EntityFilterMixin) {
  // Refs for root form and base address components to access form validation
  $refs!: {
    addCustodianForm: FormIF,
    mailingAddress: FormIF
    deliveryAddress: FormIF
  }

  @Prop({ default: false })
  private readonly isSummary!: boolean

  @Prop({ default: false })
  private readonly showErrors!: boolean

  @Getter getCustodian!: OrgPersonIF
  @Getter getCustodianEmail!: string
  @Getter getCustodialRecordsResources!: any // TODO: Update to Custodial Resource IF
  @Getter isTypeCoop!: boolean

  @Action setCustodianOfRecords: ActionBindingIF

  // Local properties
  private addCustodianValid = true
  private custodian: OrgPersonIF = null
  private inheritMailingAddress = false
  private defaultAddress: AddressIF = {
    addressCity: '',
    addressCountry: 'CA',
    addressRegion: '',
    deliveryInstructions: '',
    postalCode: '',
    streetAddress: '',
    streetAddressAdditional: ''
  }

  // Validation events from BaseAddress:
  private mailingAddressValid: boolean = true
  private deliveryAddressValid: boolean = true

  // Schema and rules for template
  readonly OfficeAddressSchema = OfficeAddressSchema
  readonly Rules = Rules
  readonly PartyTypes = PartyTypes

  created () {
    // Define local model using values initialized in store.
    this.custodian = this.getCustodian

    // Corps are required to choose a party type, where coops are pre-determined to be of person type.
    if (this.isTypeCoop) this.custodian.officer.partyType = PartyTypes.PERSON
  }

  /** Keep local custodian addresses in sync with base address common component. */
  private syncAddresses (baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    if (this.inheritMailingAddress) {
      this.custodian.deliveryAddress = { ...newAddress }
    }
  }

  /** Sync party type selection with store and reset the unselected party type fields. */
  syncCustodianPartyType (partyType: PartyTypes): void {
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

  /** The custodian person or org name to display. */
  private get getCustodianName (): string {
    const { firstName, middleName, lastName, organizationName } = this.getCustodian?.officer
    if (this.isPerson && firstName && lastName) {
      return `${firstName} ${middleName} ${lastName}`
    }
    if (this.isOrg && organizationName) {
      return organizationName
    }
    return '(Not entered)'
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
    return this.getCustodian.officer.partyType && this.addCustodianValid && this.mailingAddressValid && deliveryValid
  }

  /** Is true when the party type is a person. */
  private get isPerson (): boolean {
    return this.getCustodian?.officer.partyType === PartyTypes.PERSON
  }

  /** Is true when the party type is an organization. */
  private get isOrg (): boolean {
    return this.getCustodian?.officer.partyType === PartyTypes.ORGANIZATION
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
      this.custodian.deliveryAddress = cloneDeep(this.getCustodian.mailingAddress)
    } else {
      // Clear to default
      this.custodian.deliveryAddress = { ...this.defaultAddress }
    }
  }

  /** Handle validation event from parent. */
  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    this.$refs.addCustodianForm.validate()
    this.$refs.mailingAddress && this.$refs.mailingAddress.$refs.addressForm.validate()
    this.$refs.deliveryAddress && this.$refs.deliveryAddress.$refs.addressForm.validate()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  color: $gray7;
}

.section-label {
  font-size: 1rem;
  font-weight: bold;
  color: $gray9;
}

.person-or-org-options {
  padding-top: 0;
  margin-top: 0;

  .person-or-org-option {
    font-size: 1rem;
    font-weight: bold;
    color: $gray9;
  }

  ::v-deep .v-input--selection-controls__input {
    margin-right: 1rem;
  }

  .v-radio {
    align-items: start;
  }

  .v-radio:not(:first-child) {
    padding-top: 1.5rem;
  }
}

.summary-section {
  font-size: 1rem;
  color: $gray7;

  .summary-sub-label {
    font-size: 0.875rem;
    font-weight: bold;
    color: $gray9;
  }

  .summary-text {
    font-size: 1rem;
    color: $gray7;
  }
}

::v-deep .v-text-field .v-label {
  font-weight: normal;
  font-size: 1rem;
  color: $gray7;
  letter-spacing: -0.2px;
}

::v-deep .v-input--selection-controls .v-input__slot > .v-label {
  size: 1rem;
  color: $gray7;
  font-weight: normal;
}
</style>
