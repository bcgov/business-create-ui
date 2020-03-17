<template>
  <div>

    <confirm-dialog ref="reassignCPDialog" attach="#addEditPersonContainer"/>

    <v-expand-transition id="addEditPersonContainer">
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
                v-on:submit.prevent="addPerson">
                <label class="sub-header" v-if="isPerson">Person's Name</label>
                <label class="sub-header" v-if="isOrg">Corporation or Firm Name</label>
                <div class="form__row three-column" v-if="isPerson">
                  <v-text-field
                    filled
                    class="item"
                    label="First Name"
                    id="person__first-name"
                    v-model="orgPerson.firstName"
                    :rules="firstNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Middle Name"
                    id="person__middle-name"
                    v-model="orgPerson.middleName"
                    :rules="middleNameRules"
                  />
                  <v-text-field
                    filled
                    class="item"
                    label="Last Name"
                    id="person__last-name"
                    v-model="orgPerson.lastName"
                    :rules="lastNameRules"
                  />
                </div>
                <div v-if="isOrg" class="org-name-container">
                  <v-text-field
                    filled
                    class="item"
                    label="Full Legal Corporation or Firm Name"
                    id="firm-name"
                    v-model="orgPerson.orgName"
                    :rules="orgNameRules"
                  />
                </div>
                <label class="sub-header">Roles</label>
                <v-row align="center" justify="center">
                  <v-col cols="4" v-if="isPerson">
                    <div :class="{'highlightedRole': isRoleLocked(Roles.COMPLETING_PARTY)}">
                      <v-checkbox v-model="isCompletingParty"
                      id='cp-checkbox'
                      label="Completing Party"
                      :disabled="isRoleLocked(Roles.COMPLETING_PARTY)"
                      @change="assignCompletingPartyRole()"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div :class="{'highlightedRole':
                      isRoleLocked(Roles.INCORPORATOR) || orgPerson.type === IncorporatorTypes.CORPORATION}">
                      <v-checkbox v-model="isIncorporator"
                      :label="incorporatorLabel"
                      :disabled="isRoleLocked(Roles.INCORPORATOR) || orgPerson.type === IncorporatorTypes.CORPORATION"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" v-if="isPerson">
                    <v-checkbox v-model="isDirector" label="Director"/>
                  </v-col>
                </v-row>

                <label class="sub-header">Mailing Address</label>
                <div class="address-wrapper">
                  <base-address
                    ref="mailingAddressNew"
                    :editing="true"
                    :schema="personAddressSchema"
                    :address="inProgressMailingAddress"
                    @update:address="updateMailingAddress"
                    @valid="updateMailingAddressValidity"/>
                </div>

                <div class="form__row" v-if="isDirector">
                  <v-checkbox
                    class="inherit-checkbox"
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"/>
                  <div v-if="!inheritMailingAddress">
                    <label class="sub-header">Delivery Address</label>
                    <div class="address-wrapper">
                      <base-address
                        ref="deliveryAddressNew"
                        :editing="true"
                        :schema="personAddressSchema"
                        :address="inProgressDeliveryAddress"
                        @update:address="updateDeliveryAddress"
                        @valid="updateDeliveryAddressValidity"/>
                    </div>
                  </div>
                </div>

                <div class="form__row form__btns">
                  <v-btn large color="error" :disabled="activeIndex===-1" @click="removePerson()"
                  id='btn-remove'>Remove</v-btn>
                  <v-btn large class="form-primary-btn" @click="validateAddPersonOrgForm()" color="primary"
                  :disabled="!isFormValid()" id='btn-done'>Done</v-btn>
                  <v-btn large class="form-cancel-btn" @click="resetAddPersonData(true)" id='btn-cancel'>Cancel</v-btn>
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

// Interfaces
import { OrgPersonIF, BaseAddressObjIF, BaseAddressType, FormType, AddressIF, DialogType } from '@/interfaces'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@/components/dialogs'

// Mixins
import { EntityFilterMixin, CommonMixin } from '@/mixins'

// Enums
import { EntityTypes, Roles, IncorporatorTypes } from '@/enums'

// Schemas
import { personAddressSchema } from '@/schemas'

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
    reassignCPDialog: DialogType
  }

  // Props
  @Prop()
  private initialValue!: OrgPersonIF

  @Prop()
  private activeIndex: number

  @Prop()
  private nextId: number

  @Prop()
  private existingCompletingParty: OrgPersonIF

  // Data Properties
  private orgPerson: OrgPersonIF = null
  private addPersonOrgFormValid: boolean = true

  // Address related properties
  private inProgressMailingAddress:AddressIF
  private inProgressDeliveryAddress:AddressIF
  private inheritMailingAddress: boolean = true
  private personAddressSchema: {} = personAddressSchema
  private mailingAddressValid: boolean = false
  private deliveryAddressValid: boolean = false
  private reassignCompletingParty : boolean = false

  // Roles
  private isCompletingParty: boolean = false
  private isIncorporator: boolean = false
  private isDirector: boolean = false

  readonly EntityTypes = EntityTypes
  readonly Roles = Roles
  readonly IncorporatorTypes = IncorporatorTypes

  // Rules
  private readonly firstNameRules: Array<Function> = [
    v => !!v || 'A first name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => !/^.{30}/.test(v) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly middleNameRules: Array<Function> = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => !/^.{30}/.test(v) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly lastNameRules: Array<Function> = [
    v => !!v || 'A last name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => !/^.{30}/.test(v) || 'Cannot exceed 30 characters' // maximum character count
  ]

  private readonly orgNameRules: Array<Function> = [
    v => !!v || 'A firm name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces', // trailing spaces
    v => !/^.{155}/.test(v) || 'Cannot exceed 155 characters' // maximum character count
  ]

  // Life cycle methods
  private created (): void {
    if (this.initialValue) {
      this.orgPerson = { ...this.initialValue }
      this.isDirector = this.orgPerson.roles.includes(Roles.DIRECTOR)
      this.isIncorporator = this.orgPerson.roles.includes(Roles.INCORPORATOR)
      this.isCompletingParty = this.orgPerson.roles.includes(Roles.COMPLETING_PARTY)
      this.inProgressMailingAddress = { ...this.orgPerson.address.mailingAddress }
      if (this.isDirector) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.address.deliveryAddress }
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
    if (this.isCompletingParty && this.existingCompletingParty &&
      this.orgPerson.id !== this.existingCompletingParty.id) {
      this.confirmReassignPerson()
    }
  }

  // Methods
  private validateAddPersonOrgForm (): void {
    if (this.isFormValid()) {
      if (this.reassignCompletingParty) {
        this.emitReassignCompletingPartyEvent()
      }
      const person: OrgPersonIF = this.addPerson()
      this.emitPersonInfo(person)
      this.resetAddPersonData(false)
    }
  }

  private isFormValid () : boolean {
    let isFormValid: boolean = this.addPersonOrgFormValid && this.mailingAddressValid
    if (this.isDirector && !this.inheritMailingAddress) {
      isFormValid = isFormValid && this.deliveryAddressValid
    }
    return isFormValid
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
      this.isCompletingParty = false
    })
  }

  /**
   * Local helper push the current director data into the list.
   */
  private addPerson (): OrgPersonIF {
    let personToAdd: OrgPersonIF = { ...this.orgPerson }
    if (this.activeIndex === -1) {
      personToAdd.id = this.nextId
    }
    personToAdd.address = this.setPersonAddress()
    personToAdd.roles = this.setPersonRoles()
    return personToAdd
  }

  private setPersonAddress (): BaseAddressObjIF {
    let personAddress: BaseAddressObjIF = {
      mailingAddress: { ...this.inProgressMailingAddress }
    }
    if (this.isDirector) {
      if (this.inheritMailingAddress) {
        this.inProgressDeliveryAddress = this.inProgressMailingAddress
      }
      personAddress = { ...personAddress, deliveryAddress: { ...this.inProgressDeliveryAddress } }
    }
    return personAddress
  }

  private setPersonRoles (): string [] {
    let roles: string[] = []
    if (this.isCompletingParty) {
      roles.push(Roles.COMPLETING_PARTY)
    }
    if (this.isIncorporator) {
      roles.push(Roles.INCORPORATOR)
    }
    if (this.isDirector) {
      roles.push(Roles.DIRECTOR)
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

  private isRoleLocked (role: string) : boolean {
    return this.orgPerson.roles.includes(role) && this.activeIndex === -1
  }

  private removePerson (): void {
    this.emitRemovePersonEvent(this.activeIndex)
  }

  private reassignPersonErrorMessage () : string {
    let errorMessage: string =
    `<p>The Completing Party role is already assigned to ${this.existingCompletingParty.firstName}
     ${this.existingCompletingParty.middleName || ''} ${this.existingCompletingParty.lastName}.</p>
     <p>Selecting "Completing Party" here will change the Completing Party.</p>`
    return errorMessage
  }

  get isPerson (): boolean {
    return this.orgPerson?.type === IncorporatorTypes.PERSON
  }

  get isOrg (): boolean {
    return this.orgPerson?.type === IncorporatorTypes.CORPORATION
  }

  get incorporatorLabel () : string {
    return this.entityFilter(EntityTypes.BCOMP) ? Roles.INCORPORATOR : Roles.SUBSCRIBER
  }

  // Events
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): void { }

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('removePersonEvent')
  private emitRemovePersonEvent (activeIndex: Number): void { }

  @Emit('removeCompletingPartyRole')
  private emitReassignCompletingPartyEvent () : void {}
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
    padding: .25rem;
}
::v-deep .theme--light.v-label--is-disabled {
      color: white !important

 }
</style>
