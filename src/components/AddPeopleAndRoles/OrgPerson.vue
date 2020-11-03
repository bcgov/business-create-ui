<template>
  <div id="addEditPersonContainer">
    <confirm-dialog ref="reassignCPDialog" attach="#addEditPersonContainer" />

    <v-expand-transition>
      <ul class="list add-person">
        <li class="add-person-container">
          <div class="meta-container">

            <label class="add-person-header" v-if="isOrg && entityFilter(EntityTypes.BCOMP)">
              <span v-if="activeIndex===-1">Add Corporation or Firm</span>
              <span v-else>Edit Corporation or Firm</span>
            </label>

            <label class="add-person-header" v-if="isOrg && entityFilter(EntityTypes.COOP)">
              <span v-if="activeIndex===-1">Add Organization</span>
              <span v-else>Edit Organization</span>
            </label>

            <div class="meta-container__inner">
              <v-form
                ref="addPersonOrgForm"
                class="appoint-form"
                v-model="addPersonOrgFormValid"
                v-on:submit.prevent
              >
                <!-- Person/Org's Name -->
                <label class="sub-header" v-if="isPerson">Person's Name</label>
                <label class="sub-header" v-if="isOrg">Corporation or Firm Name</label>
                <div class="form__row three-column" v-if="isPerson">
                  <v-text-field
                    filled
                    class="item"
                    label="First Name"
                    id="person__first-name"
                    v-model="orgPerson.officer.firstName"
                    :rules="firstNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Middle Name"
                    id="person__middle-name"
                    v-model="orgPerson.officer.middleName"
                    :rules="middleNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Last Name"
                    id="person__last-name"
                    v-model="orgPerson.officer.lastName"
                    :rules="lastNameRules"
                  />
                </div>
                <div v-if="isOrg" class="org-name-container">
                  <v-text-field
                    filled
                    class="item"
                    label="Full Legal Corporation or Firm Name"
                    id="firm-name"
                    v-model="orgPerson.officer.orgName"
                    :rules="orgNameRules"
                  />
                </div>

                <!-- Roles -->
                <label class="sub-header">Roles</label>
                <v-row>
                  <v-col cols="4" v-if="isPerson">
                    <div :class="{ 'highlightedRole': isRoleLocked(RoleTypes.COMPLETING_PARTY) }">
                      <v-checkbox
                        id="cp-checkbox"
                        v-model="selectedRoles"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :disabled="isRoleLocked(RoleTypes.COMPLETING_PARTY)"
                        :rules="roleRules"
                        @change="assignCompletingPartyRole()"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div :class="{ 'highlightedRole': isRoleLocked(RoleTypes.INCORPORATOR) || isOrg }"
                    >
                      <v-checkbox
                        v-model="selectedRoles"
                        :value="RoleTypes.INCORPORATOR"
                        :label="incorporatorLabel"
                        :disabled="isRoleLocked(RoleTypes.INCORPORATOR) || isOrg"
                        :rules="roleRules"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" v-if="isPerson">
                    <v-checkbox
                      v-model="selectedRoles"
                      :value="RoleTypes.DIRECTOR"
                      :label="RoleTypes.DIRECTOR"
                      :rules="roleRules"
                    />
                  </v-col>
                </v-row>

                <!-- Mailing Address -->
                <label class="sub-header">Mailing Address</label>
                <div class="address-wrapper">
                  <base-address
                    ref="mailingAddressNew"
                    :editing="true"
                    :schema="personAddressSchema"
                    :address="inProgressMailingAddress"
                    @update:address="updateMailingAddress"
                    @valid="updateMailingAddressValidity"
                  />
                </div>

                <!-- Delivery Address (for directors only) -->
                <div class="form__row" v-if="isDirector">
                  <v-checkbox
                    class="inherit-checkbox"
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                  />
                  <div v-if="!inheritMailingAddress">
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper">
                      <base-address
                        ref="deliveryAddressNew"
                        :editing="true"
                        :schema="personAddressSchema"
                        :address="inProgressDeliveryAddress"
                        @update:address="updateDeliveryAddress"
                        @valid="updateDeliveryAddressValidity"
                      />
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="form__row form__btns">
                  <v-btn id="btn-remove" large outline color="error"
                    :disabled="activeIndex === -1"
                    @click="emitRemovePersonEvent(activeIndex)">Remove</v-btn>
                  <v-btn id="btn-done" large color="primary" class="ml-auto"
                    @click="validateAddPersonOrgForm()">Done</v-btn>
                  <v-btn id="btn-cancel" large outlined color="primary"
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
// Libraries
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { v4 as uuidv4 } from 'uuid'

// Interfaces
import { OrgPersonIF, BaseAddressType, FormType, AddressIF, ConfirmDialogType, RolesIF } from '@/interfaces'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@/components/dialogs'

// Mixins
import { EntityFilterMixin, CommonMixin } from '@/mixins'

// Enums
import { EntityTypes, RoleTypes, IncorporatorTypes } from '@/enums'

// Schemas
import { personAddressSchema } from '@/schemas'
import { Getter } from 'vuex-class'

@Component({
  components: {
    BaseAddress,
    ConfirmDialog
  }
})
export default class OrgPerson extends Mixins(EntityFilterMixin, CommonMixin) {
   // Refs
   $refs!: {
    addPersonOrgForm: FormType,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType,
    reassignCPDialog: ConfirmDialogType
  }

  // Props
  @Prop()
  private initialValue!: OrgPersonIF

  @Prop()
  private activeIndex: number

  @Prop()
  private existingCompletingParty: OrgPersonIF

  @Getter getCurrentDate!: string

  // Data Properties
  private orgPerson: OrgPersonIF = null
  private addPersonOrgFormValid = true

  // Address related properties
  private inProgressMailingAddress: AddressIF
  private inProgressDeliveryAddress: AddressIF
  private inheritMailingAddress = true
  private personAddressSchema: {} = personAddressSchema
  private mailingAddressValid = false
  private deliveryAddressValid = false
  private reassignCompletingParty = false

  /** Model value for roles checboxes. */
  private selectedRoles: Array<RoleTypes> = []

  // enums for template
  readonly EntityTypes = EntityTypes
  readonly RoleTypes = RoleTypes
  readonly IncorporatorTypes = IncorporatorTypes

  // Rules
  private readonly firstNameRules: Array<Function> = [
    v => !!v || 'A first name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly middleNameRules: Array<Function> = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (!v || v.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly lastNameRules: Array<Function> = [
    v => !!v || 'A last name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 30) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly orgNameRules: Array<Function> = [
    v => !!v || 'A firm name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
  ]

  /** True if Completing Party is checked. */
  private get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** True if Incorporator is checked. */
  private get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** True if Director is checked. */
  private get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** The validation rules for the roles. */
  private get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** Called when component is created. */
  private created (): void {
    if (this.initialValue) {
      this.orgPerson = { ...this.initialValue }
      this.orgPerson.officer = { ...this.initialValue.officer }

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.isDirector) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        this.inheritMailingAddress = this.isSame(this.inProgressMailingAddress, this.inProgressDeliveryAddress)
      }
    }
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
    if (this.orgPerson && this.isCompletingParty && this.existingCompletingParty &&
      this.orgPerson.officer.id !== this.existingCompletingParty.officer.id
    ) {
      this.confirmReassignPerson()
    }
  }

  // Methods
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
      const person: OrgPersonIF = this.addPerson()
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

  /**
   * Local helper push the current director data into the list.
   */
  private addPerson (): OrgPersonIF {
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

  private isRoleLocked (role: RoleTypes): boolean {
    return (this.orgPerson.roles.some(party => party.roleType === role) && this.activeIndex === -1)
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

  /** True if current data object is a person. */
  private get isPerson (): boolean {
    return this.orgPerson.officer?.partyType === IncorporatorTypes.PERSON
  }

  /** True if current data object is an organization (corporation/firm). */
  private get isOrg (): boolean {
    return this.orgPerson.officer?.partyType === IncorporatorTypes.CORPORATION
  }

  private get incorporatorLabel (): string {
    return this.entityFilter(EntityTypes.BCOMP) ? RoleTypes.INCORPORATOR : RoleTypes.SUBSCRIBER
  }

  // Event emitters
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('removePersonEvent')
  private emitRemovePersonEvent (activeIndex: number): void {}

  @Emit('removeCompletingPartyRole')
  private emitReassignCompletingPartyEvent (): void {}
}
</script>

<style lang="scss" scoped>
[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

.people-roles-container {
  margin-top: 1rem;
  padding: 1.25rem;
}

ul, p {
  padding-top: 0.5rem;
}

li {
  list-style: None;
  padding-top: 0.25rem;
}

.btn-panel {
  padding-top: 0.5rem;
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

.add-person {
  .add-person-container {
    padding: 1.25rem;

    .meta-container {
      > label:first-child {
        margin-bottom: 1.5rem;
      }
    }
  }
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: 700;
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

.add-person-header {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.name-header {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5rem;
  padding-bottom: 0.5rem;
}

.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
}

.address-wrapper {
  margin-top: 1.5rem;
}

.org-name-container {
  padding-top: 1rem;
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

.highlightedRole {
  opacity: 0.5;
  mix-blend-mode: normal;
  border-radius: 2px;
  border-color: rgb(140, 140, 140);
  background-color: rgb(55, 164, 71);
  color: rgb(255, 255, 255) !important;
  font-weight: bold;
  padding: 0.25rem;
}

::v-deep .theme--light.v-label--is-disabled {
  color: white !important;
 }
</style>
