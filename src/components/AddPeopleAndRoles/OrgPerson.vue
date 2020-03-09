<template>
  <v-expand-transition>
    <ul class="list add-person">
      <li class="add-person-container">
        <div class="meta-container">
          <label class="add-person-header" v-if="isPerson">
            <span v-if="activeIndex===-1">Add Person</span>
            <span v-else>Edit Person</span>
          </label>
          <label class="add-person-header" v-if="isOrg">
            <span v-if="activeIndex===-1">Add Corporation or Firm</span>
            <span v-else>Edit Corporation or Firm</span>
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
              <v-row>
                <v-col cols="4" v-if="isPerson">
                  <v-checkbox v-model="isCompletingParty" label="Completing Party"
                  :disabled="isRoleLocked('Completing Party')"
                  v-bind:class="{'highlightedRole': isRoleLocked('Completing Party')}"/>
                </v-col>
                <v-col cols="4">
                  <v-checkbox v-model="isIncorporator" label="Incorporator"
                  :disabled="isRoleLocked('Incorporator')"
                  v-bind:class="{'highlightedRole': isRoleLocked('Incorporator')}"/>
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
                      @update:address="updateDeliveryAddress"
                      @valid="updateDeliveryAddressValidity"/>
                  </div>
                </div>
              </div>

              <div class="form__row form__btns">
                <v-btn color="error" :disabled="activeIndex===-1" @click="removePerson()">Remove</v-btn>
                <v-btn class="form-primary-btn" @click="validateAddPersonOrgForm()" color="primary"
                :disabled="!isFormValid()">Done</v-btn>
                <v-btn class="form-cancel-btn" @click="resetAddPersonData()">Cancel</v-btn>
              </div>
            </v-form>
          </div>
        </div>
      </li>
    </ul>
  </v-expand-transition>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'

// Interfaces
import { OrgPersonIF, BaseAddressObjIF, BaseAddressType, FormType } from '@/interfaces'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

// Schemas
import { addressSchema } from '@/schemas'

@Component({
  components: {
    BaseAddress
  }
})
export default class OrgPerson extends Vue {
   // Refs
   $refs!: {
    addPersonOrgForm: FormType,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType
  }

  // Props
  @Prop()
  private initialValue!: OrgPersonIF

  @Prop()
  private activeIndex: number

  @Prop()
  private nextId: number

  // Data Properties
  private orgPerson: OrgPersonIF = this.initialValue
  private inProgressMailingAddress = null
  private inProgressDeliveryAddress = null
  private inheritMailingAddress: boolean = true
  private personAddressSchema: {} = addressSchema
  private isCompletingParty: boolean = false
  private isIncorporator: boolean = false
  private isDirector: boolean = false
  private addPersonOrgFormValid: boolean = true
  private mailingAddressValid: boolean = false
  private deliveryAddressValid: boolean = false

  // Rules
  private readonly firstNameRules: Array<Function> = [
    v => !!v || 'A first name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
  ]

  private readonly middleNameRules: Array<Function> = [
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
  ]

  private readonly lastNameRules: Array<Function> = [
    v => !!v || 'A last name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
  ]

  private readonly orgNameRules: Array<Function> = [
    v => !!v || 'A firm name is required',
    v => !/^\s/g.test(v) || 'Invalid spaces', // leading spaces
    v => !/\s$/g.test(v) || 'Invalid spaces' // trailing spaces
  ]

  // Life cycle methods
  private mounted (): void {
    if (this.orgPerson) {
      this.isDirector = this.orgPerson.roles.includes('Director')
      this.isIncorporator = this.orgPerson.roles.includes('Incorporator')
      this.isCompletingParty = this.orgPerson.roles.includes('Completing Party')
      this.inProgressMailingAddress = this.orgPerson.address.mailingAddress
      if (this.isDirector) {
        this.inProgressDeliveryAddress = this.orgPerson.address.deliveryAddress
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

  private updateDeliveryAddressValidity (val): void {
    this.deliveryAddressValid = val
  }

  // Methods
  private validateAddPersonOrgForm (): void {
    if (this.isFormValid()) {
      const person: OrgPersonIF = this.addPerson()
      this.resetAddPersonData()
      this.emitPersonInfo(person)
    }
  }

  private isFormValid () : boolean {
    let isFormValid: boolean = this.addPersonOrgFormValid && this.mailingAddressValid
    if (this.isDirector && !this.inheritMailingAddress) {
      isFormValid = isFormValid && this.deliveryAddressValid
    }
    return isFormValid
  }

  /**
   * Local helper push the current director data into the list.
   */
  private addPerson (): OrgPersonIF {
    let personToAdd: OrgPersonIF = { ...this.orgPerson }
    personToAdd.id = this.nextId
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
      roles.push('Completing Party')
    }
    if (this.isDirector) {
      roles.push('Director')
    }
    if (this.isIncorporator) {
      roles.push('Incorporator')
    }
    return roles
  }

  private resetAddPersonData (): void {
    this.$refs.addPersonOrgForm.reset()
    this.$refs.mailingAddressNew.$refs.addressForm.reset()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.reset()
    }

    this.emitResetEvent()
  }

  private isRoleLocked (role: string) : boolean {
    return this.orgPerson.roles.includes(role) && this.activeIndex === -1
  }

  private removePerson (): void {
    this.emitRemovePersonEvent(this.activeIndex)
  }

  get isPerson (): boolean {
    return this.orgPerson && this.orgPerson.type === 'Person'
  }

  get isOrg (): boolean {
    return this.orgPerson && this.orgPerson.type === 'Org'
  }

  // Events
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): void { }

  @Emit('resetEvent')
  private emitResetEvent (): void { }

  @Emit('removePersonEvent')
  private emitRemovePersonEvent (activeIndex: Number): void { }
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
      width: 8rem;
    }
  }
}

.highlightedRole {
    opacity: 0.5;
    mix-blend-mode: normal;
    border-radius: 2px;
    border-color: rgb(140, 140, 140);
    background-color: rgb(55, 164, 71);
    color: rgb(255, 255, 255) s!important;
    font-weight: bold;
    margin-bottom: 1rem;
}
</style>
