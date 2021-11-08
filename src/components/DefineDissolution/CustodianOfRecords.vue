<template>
  <div>
    <template v-if="!isSummary">
      <!-- Address Form -->
      <v-card flat class="rounded-4">
        <div class="section-container pt-10" :class="{ 'invalid-section': showErrors }">
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
                <v-row no-gutters class="pt-4">
                  <v-col>
                    <v-text-field
                      filled
                      label="First Name"
                      id="person__first-name"
                      v-model="custodian.officer.firstName"
                      :rules="OfficerRules.firstNameRules"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      class="px-5"
                      label="Middle Name (Optional)"
                      id="person__middle-name"
                      v-model="custodian.officer.middleName"
                      :rules="OfficerRules.middleNameRules"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      label="Last Name"
                      id="person__last-name"
                      v-model="custodian.officer.lastName"
                      :rules="OfficerRules.lastNameRules"
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
                      <span class="person-or-org-option">Person's Name</span>
                    </template>
                  </v-radio>
                  <v-row no-gutters class="pt-4">
                    <v-col>
                      <v-text-field
                        filled
                        label="First Name"
                        id="person__first-name"
                        v-model="custodian.officer.firstName"
                        :rules="isPerson ? OfficerRules.firstNameRules : []"
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
                        :rules="isPerson ? OfficerRules.middleNameRules : []"
                        @input="syncCustodianPartyType(PartyTypes.PERSON)"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        filled
                        label="Last Name"
                        id="person__last-name"
                        v-model="custodian.officer.lastName"
                        :rules="isPerson ? OfficerRules.lastNameRules : []"
                        @input="syncCustodianPartyType(PartyTypes.PERSON)"
                      />
                    </v-col>
                  </v-row>

                  <!-- Org input -->
                  <v-radio :value=PartyTypes.ORGANIZATION class="pt-2">
                    <template slot="label">
                      <span class="person-or-org-option">Corporation or Firm Name</span>
                    </template>
                  </v-radio>
                  <v-row no-gutters class="pt-4">
                    <v-col>
                      <v-text-field
                        filled
                        label="Corporation or Firm Name"
                        id="organization__name"
                        v-model="custodian.officer.organizationName"
                        :rules="isOrg ? OfficerRules.orgNameRules : []"
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
                    :rules="OfficerRules.emailRules"
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
                @update:address="syncAddress('mailingAddress', $event)"
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
                  @update:address="syncAddress('deliveryAddress', $event)"
                />
              </template>
              <!--          @valid="updateAddressValid('mailingAddress', $event)"-->
            </v-col>
          </v-row>
        </div>
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
            <span class="summary-text">{{ getCustodianEmail }}</span>
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
// Libraries
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { OfficeAddressSchema } from '@/schemas'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ActionBindingIF, AddressIF, OrgPersonIF } from '@/interfaces'
import { PartyTypes, RoleTypes } from '@/enums'
import { CommonMixin, EntityFilterMixin } from '@/mixins'
import { OfficerRules } from '@/rules'

@Component({
  components: {
    'delivery-address': BaseAddress,
    'mailing-address': BaseAddress
  }
})
export default class CustodianOfRecords extends Mixins(CommonMixin, EntityFilterMixin) {
  // Refs for sbc common base address components so we can access form validation
  $refs!: {
    mailingAddress: any
    deliveryAddress: any
  }

  @Prop({ default: false })
  private readonly isSummary!: boolean

  @Prop({ default: false })
  private readonly showErrors!: boolean

  @Getter getCustodian!: OrgPersonIF
  @Getter getCustodialRecordsResources!: any // TODO: Update to Custodial Resource IF
  @Getter isTypeCoop!: boolean

  @Action setCustodianOfRecords: ActionBindingIF

  // Local properties
  private defaultAddress: AddressIF = {
    addressCity: '',
    addressCountry: 'CA',
    addressRegion: '',
    deliveryInstructions: '',
    postalCode: '',
    streetAddress: '',
    streetAddressAdditional: ''
  }
  private custodian: OrgPersonIF = null
  private inheritMailingAddress = false

  // Global variables defined locally for the template
  readonly OfficeAddressSchema = OfficeAddressSchema
  readonly OfficerRules = OfficerRules
  readonly PartyTypes = PartyTypes

  created () {
    // Define local model using values initialized in store.
    this.custodian = this.getCustodian
  }

  /** Keep local custodian addresses in sync with base address common component. */
  private syncAddress (addressKey: string, address: AddressIF): void {
    this.setCustodianOfRecords({ ...this.getCustodian, [addressKey]: address })
  }

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

  /** The custodian person or org name to display. */
  private get getCustodianEmail (): string {
    return this.getCustodian?.officer.email || '(Not entered)'
  }

  /** Is true when the party type is a person. */
  private get isPerson (): boolean {
    return this.getCustodian?.officer.partyType === PartyTypes.PERSON
  }

  /** Is true when the party type is an organization. */
  private get isOrg (): boolean {
    return this.getCustodian?.officer.partyType === PartyTypes.ORGANIZATION
  }

  /** Keep local custodian model in sync with store. */
  @Watch('custodian', { deep: true })
  private onCustodianChange (): void {
    this.setCustodianOfRecords(this.custodian)
  }

  /** Sets the Delivery Address to the Mailing Address. */
  @Watch('inheritMailingAddress')
  private setDeliveryAddressToMailingAddress (): void {
    if (this.inheritMailingAddress) {
      this.custodian.deliveryAddress = { ...this.custodian.mailingAddress }
    } else {
      // Clear to default
      this.custodian.deliveryAddress = { ...this.defaultAddress }
    }
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
