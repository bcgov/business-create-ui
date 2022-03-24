<template>
  <div id="add-edit-org-person">
    <ConfirmDialog
      ref="reassignCPDialog"
      attach="#add-edit-org-person"
    />

    <v-expand-transition>
      <ul class="add-person pa-0">
        <li class="add-person-container px-6 py-10">
          <div class="meta-container">

            <!-- FUTURE: move header text to resource file so this component is generic -->
            <label class="add-org-header" v-if="isOrg && isTypeBcomp">
              <span v-if="activeIndex === -1">Add Corporation or Firm</span>
              <span v-else>Edit Corporation or Firm</span>
            </label>

            <label class="add-org-header" v-if="isOrg && isTypeCoop">
              <span v-if="activeIndex === -1">Add Organization</span>
              <span v-else>Edit Organization</span>
            </label>

            <label class="add-org-header" v-if="isPerson">
              <span v-if="activeIndex === -1">Add Person</span>
              <span v-else>Edit Person</span>
            </label>

            <div class="meta-container__inner">
              <v-card outlined class="message-box" v-if="isCompletingParty && !isRoleStaff && isTypeCoop">
                <p>
                  <strong>Important:</strong> The Completing Party information below is based on your
                  BC Registries account information. Your name cannot be changed here. Name changes must
                  be made through your account settings.
                </p>
                <p>
                  If you make changes to your address below, please update your address in the account
                  settings after you have completed this filing to ensure your information is up to date.
                </p>
              </v-card>

              <v-form
                ref="addPersonOrgForm"
                class="appoint-form"
                :class="{ 'mt-8': isCompletingParty && !isRoleStaff && isTypeCoop}"
                v-model="addPersonOrgFormValid"
                v-on:submit.prevent
              >
                <!-- Person's Name -->
                <template v-if="isPerson">
                  <div class="font-weight-bold">Person's Name</div>
                  <div class="form__row three-column mt-4">
                    <!-- NB: only staff can change Completing Party names -->
                    <v-text-field
                      filled
                      class="item"
                      label="First Name"
                      id="person__first-name"
                      v-model.trim="orgPerson.officer.firstName"
                      :rules="Rules.FirstNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Middle Name"
                      id="person__middle-name"
                      v-model.trim="orgPerson.officer.middleName"
                      :rules="Rules.MiddleNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Last Name"
                      id="person__last-name"
                      v-model.trim="orgPerson.officer.lastName"
                      :rules="Rules.LastNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                  </div>
                </template>

                <!-- Org's Name -->
                <template v-if="isOrg">
                  <div class="font-weight-bold">Corporation or Firm Name</div>
                  <div class="org-name-container mt-4">
                    <v-text-field
                      filled
                      class="item"
                      label="Full Legal Corporation or Firm Name"
                      id="firm-name"
                      v-model.trim="orgPerson.officer.organizationName"
                      :rules="Rules.OrgNameRules"
                    />
                  </div>
                </template>

                <!-- Roles -->
                <div class="font-weight-bold mt-2">Roles</div>
                <v-card flat rounded="sm" class="gray-card mt-4 px-4">
                  <v-row>
                    <v-col cols="4" v-if="showCompletingPartyRole">
                      <v-checkbox
                        id="cp-checkbox"
                        v-model="selectedRoles"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :disabled="disableCompletingPartyRole"
                        @change="assignCompletingPartyRole()"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showIncorporatorRole">
                      <v-checkbox
                        id="incorporator-checkbox"
                        v-model="selectedRoles"
                        :value="RoleTypes.INCORPORATOR"
                        :label="RoleTypes.INCORPORATOR"
                        :disabled="disableIncorporatorRole"
                        :rules="roleRules"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showDirectorRole">
                      <v-checkbox
                        id="director-checkbox"
                        v-model="selectedRoles"
                        :value="RoleTypes.DIRECTOR"
                        :label="RoleTypes.DIRECTOR"
                        :disabled="disableDirectorRole"
                        :rules="roleRules"
                        @click="updateSameAsMailingChkBox()"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Mailing Address -->
                <div class="font-weight-bold mt-8">Mailing Address</div>
                <MailingAddress
                  ref="mailingAddressNew"
                  class="mt-6"
                  :editing="true"
                  :schema="PersonAddressSchema"
                  :address="inProgressMailingAddress"
                  @update:address="updateMailingAddress"
                  @valid="updateMailingAddressValidity"
                />

                <!-- Delivery Address (for directors only) -->
                <div class="form__row" v-if="isDirector">
                  <v-checkbox
                    class="inherit-checkbox"
                    hide-details
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                  />

                  <template v-if="!inheritMailingAddress">
                    <div class="font-weight-bold mt-4">Delivery Address</div>
                    <DeliveryAddress
                      ref="deliveryAddressNew"
                      class="mt-6"
                      :editing="true"
                      :schema="PersonAddressSchema"
                      :address="inProgressDeliveryAddress"
                      :noPoBox="true"
                      @update:address="updateDeliveryAddress"
                      @valid="updateDeliveryAddressValidity"
                    />
                  </template>
                </div>

                <!-- Action Buttons -->
                <div class="form__row form__btns mt-6">
                  <v-btn
                    id="btn-remove"
                    large outlined color="error"
                    class="btn-outlined-error"
                    :disabled="activeIndex === -1"
                    @click="emitRemovePerson(activeIndex)">Remove</v-btn>
                  <v-btn
                    id="btn-done"
                    large color="primary"
                    class="ml-auto"
                    @click="validateAddPersonOrgForm()">Done</v-btn>
                  <v-btn
                    id="btn-cancel"
                    large outlined color="primary"
                    @click="resetAddPersonData(true)">Cancel</v-btn>
                </div>
              </v-form>
            </div>
          </div>

        </li>
      </ul>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { v4 as uuidv4 } from 'uuid'
import {
  OrgPersonIF, EmptyAddress, FormIF, AddressIF, ConfirmDialogType, RolesIF
} from '@/interfaces'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import { CommonMixin } from '@/mixins'
import { CorpTypeCd, RoleTypes, PartyTypes } from '@/enums'
import { PersonAddressSchema } from '@/schemas'
import { Rules } from '@/rules'
import { cloneDeep } from 'lodash'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class AddEditOrgPerson extends Mixins(CommonMixin) {
  // Refs
  $refs!: {
    addPersonOrgForm: FormIF
    mailingAddressNew: any
    deliveryAddressNew: any
    reassignCPDialog: ConfirmDialogType
  }

  @Prop() readonly initialValue!: OrgPersonIF
  @Prop() readonly activeIndex: number
  @Prop() readonly existingCompletingParty: OrgPersonIF
  @Prop() readonly addIncorporator: boolean

  @Getter getCurrentDate!: string
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getEntityType!: CorpTypeCd

  // Local properties
  private orgPerson: OrgPersonIF = null
  private addPersonOrgFormValid = true

  // Address related properties
  private inProgressMailingAddress: AddressIF
  private inProgressDeliveryAddress: AddressIF
  private inheritMailingAddress = true
  private mailingAddressValid = false
  private deliveryAddressValid = false
  private reassignCompletingParty = false

  /** Model value for roles checboxes. */
  private selectedRoles: Array<RoleTypes> = []

  // Person Address schema for template
  readonly PersonAddressSchema = PersonAddressSchema

  // Enums and rules for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly Rules = Rules

  /** The validation rules for the roles. */
  get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** Whether Completing Party is checked. */
  private get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** Whether Incorporator is checked. */
  private get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** Whether Director is checked. */
  private get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** Whether current data object is a person. */
  private get isPerson (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Whether current data object is an organization (corporation/firm). */
  private get isOrg (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
  }

  /** Whether the Completing Party role should be shown. */
  private get showCompletingPartyRole (): boolean {
    const isRoleCompletingParty = !!this.orgPerson.roles.find(role => role.roleType === RoleTypes.COMPLETING_PARTY)
    // either this is the completing party,
    // or this is staff adding/editing a person
    return (isRoleCompletingParty || (this.isRoleStaff && this.isPerson))
  }

  /** Whether the Incorporator role should be shown. */
  private get showIncorporatorRole (): boolean {
    // show this role according to prop from parent parent component (ie, per resource file)
    return this.addIncorporator
  }

  /** Whether the Director role should be shown. */
  private get showDirectorRole (): boolean {
    // only a person can be a director
    return this.isPerson
  }

  /** Whether the Completing Party role should be disabled. */
  private get disableCompletingPartyRole (): boolean {
    // only staff can edit Completing Party role
    return !this.isRoleStaff
  }

  /** Whether the Incorporator role should be disabled. */
  private get disableIncorporatorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showDirectorRole && this.showIncorporatorRole)
  }

  /** Whether the Director role should be disabled. */
  private get disableDirectorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showIncorporatorRole && this.showDirectorRole)
  }

  /* coop and corp display delivery address by default */
  private get showDeliveryAddressByDefault (): boolean {
    return [
      CorpTypeCd.COOP,
      CorpTypeCd.BENEFIT_COMPANY,
      CorpTypeCd.BC_CCC,
      CorpTypeCd.BC_COMPANY,
      CorpTypeCd.BC_ULC_COMPANY
    ].includes(this.getEntityType)
  }

  /** Called when component is created. */
  created (): void {
    if (this.initialValue) {
      this.orgPerson = { ...this.initialValue }
      this.orgPerson.officer = { ...this.initialValue.officer }

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // set address properties
      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.isDirector) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        // initialize inheritMailingAddress checkbox conditionally
        this.updateSameAsMailingChkBox()
      }
    }
  }

  /** decide if the "Delivery Address same as Mailing Address" check box should be checked */
  private updateSameAsMailingChkBox (): void {
    if (!this.isDirector) {
      return
    }

    // if not already assigned, initialize delivery address to prevent template errors
    if (!this.inProgressDeliveryAddress) this.inProgressDeliveryAddress = cloneDeep(EmptyAddress)

    this.inheritMailingAddress = this.isSame(this.inProgressMailingAddress, this.inProgressDeliveryAddress)

    if (this.inheritMailingAddress && this.showDeliveryAddressByDefault) {
      const isNew = this.isEmptyAddress(this.orgPerson.mailingAddress) &&
                    this.isEmptyAddress(this.orgPerson.deliveryAddress)

      this.inheritMailingAddress = !isNew
    }
  }

  /** Whether the address object is empty or with only with default input values */
  private isEmptyAddress (address: AddressIF): boolean {
    return !address ||
           (!address.addressCity &&
           (!address.addressCountry || address.addressCountry === 'CA') &&
           (!address.addressRegion || address.addressRegion === 'BC') &&
           !address.deliveryInstructions &&
           !address.postalCode &&
           !address.streetAddress &&
           !address.streetAddressAdditional)
  }

  // Event Handlers
  private updateMailingAddress (val): void {
    this.inProgressMailingAddress = val
  }

  private updateDeliveryAddress (val): void {
    this.inProgressDeliveryAddress = val
  }

  private updateMailingAddressValidity (val: boolean): void {
    this.mailingAddressValid = val
  }

  private updateDeliveryAddressValidity (val: boolean): void {
    this.deliveryAddressValid = val
  }

  private assignCompletingPartyRole (): void {
    if (
      this.orgPerson &&
      this.isCompletingParty &&
      this.existingCompletingParty &&
      this.orgPerson.officer.id !== this.existingCompletingParty.officer.id
    ) {
      this.confirmReassignPerson()
    }
  }

  private validateAddPersonOrgForm (): void {
    // validate the main form and address form(s)
    this.$refs.addPersonOrgForm.validate()
    this.$refs.mailingAddressNew.$refs.addressForm.validate()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.validate()
    }

    // only proceed if form is valid
    if (this.isFormValid) {
      if (this.reassignCompletingParty) {
        this.emitReassignCompletingPartyEvent()
      }
      const person = this.setPerson()
      this.emitPersonInfo(person)
      this.resetAddPersonData(false) // don't emit event
    }
  }

  private confirmReassignPerson () {
    // open confirmation dialog and wait for response
    this.$refs.reassignCPDialog.open(
      'Change Completing Party?',
      this.reassignPersonErrorMessage(),
      {
        width: '45rem',
        persistent: true,
        yes: 'Change Completing Party',
        no: null,
        cancel: 'Cancel'
      }
    ).then(async (confirm) => {
      if (confirm) {
        this.reassignCompletingParty = true
      }
    }).catch(() => {
      // remove the role
      this.selectedRoles = this.selectedRoles.filter(r => r !== RoleTypes.COMPLETING_PARTY)
    })
  }

  /** Helper to set the current director data. */
  private setPerson (): OrgPersonIF {
    let person: OrgPersonIF = { ...this.orgPerson }
    person.officer = { ...this.orgPerson.officer }
    if (this.activeIndex === -1) {
      // assign a new (random) ID
      person.officer.id = uuidv4()
    }
    person.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.isDirector) {
      person.deliveryAddress = this.setPersonDeliveryAddress()
    }
    person.roles = this.setPersonRoles()
    return person
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = this.inProgressMailingAddress
    }
    return { ...this.inProgressDeliveryAddress }
  }

  private setPersonRoles (): RolesIF[] {
    let roles: RolesIF[] = []
    if (this.isCompletingParty) {
      roles.push({ roleType: RoleTypes.COMPLETING_PARTY, appointmentDate: this.getCurrentDate })
    }
    if (this.isIncorporator) {
      roles.push({ roleType: RoleTypes.INCORPORATOR, appointmentDate: this.getCurrentDate })
    }
    if (this.isDirector) {
      roles.push({ roleType: RoleTypes.DIRECTOR, appointmentDate: this.getCurrentDate })
    }
    return roles
  }

  private resetAddPersonData (emitEvent: boolean): void {
    this.$refs.addPersonOrgForm.reset()
    this.$refs.mailingAddressNew.$refs.addressForm.reset()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.reset()
    }
    if (emitEvent) {
      this.emitResetEvent()
    }
  }

  private reassignPersonErrorMessage (): string {
    return `The Completing Party role is already assigned to ${this.existingCompletingPartyName}.\n` +
      'Selecting "Completing Party" here will change the Completing Party.'
  }

  /** The formatted, existing completing party name. */
  private get existingCompletingPartyName (): string {
    let name = this.existingCompletingParty.officer.firstName
    if (this.existingCompletingParty.officer.middleName) {
      name += ` ${this.existingCompletingParty.officer.middleName}`
    }
    name += ` ${this.existingCompletingParty.officer.lastName}`
    return name
  }

  /** True if the form is valid. */
  private get isFormValid (): boolean {
    let isFormValid = (this.addPersonOrgFormValid && this.mailingAddressValid)
    if (this.isDirector && !this.inheritMailingAddress) {
      isFormValid = (isFormValid && this.deliveryAddressValid)
    }
    return isFormValid
  }

  // Event emitters
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('removePerson')
  private emitRemovePerson (activeIndex: number): void {}

  @Emit('removeCompletingPartyRole')
  private emitReassignCompletingPartyEvent (): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.people-roles-container {
  margin-top: 1rem;
  padding: 1.25rem;
}

p {
  padding-top: 0.5rem;
}

li {
  list-style: none;
  padding-top: 0.25rem;
}

.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }
}

// Address Block Layout
.address {
  display: flex;
  width: 12rem;
  padding-left: 0.5rem;
  margin-right: 1.35rem;
}

.same-address {
  width: 11.65rem;
}

.address__row {
  flex: 1 1 auto;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }

  &__inner {
    flex: 1 1 auto;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;

    .v-btn {
      min-width: 4rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.add-org-header {
  font-size: $px-16;
  font-weight: bold;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 10rem;
    }
  }
}

.gray-card {
  background-color: rgba(0, 0, 0, 0.06);
}

.inherit-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-left: -3px;
}
</style>
