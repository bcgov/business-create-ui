<template>
  <div>
    <p>
      Add the people and corporations/firms who will have a role in your company. People can have multiple roles;
      Corporation/firms can only be Incorporators.
    </p>
    Your application must include the following:
    <ul>
      <li>
        <v-icon color='blue' v-if="hasRole(Roles.COMPLETING_PARTY, 1, 'EXACT')">mdi-check</v-icon>
        <span v-else><v-icon color='red' v-if="showErrors">mdi-close</v-icon></span>
        <span class='chk-list-item-txt'>The Completing Party</span>
      </li>
      <li>
        <v-icon color='blue' v-if="hasRole(Roles.INCORPORATOR, 1, 'ATLEAST')">mdi-check</v-icon>
        <span v-else><v-icon color='red' v-if="showErrors">mdi-close</v-icon></span>
        <span class='chk-list-item-txt'>At least one Incorporator</span>
      </li>
      <li>
        <v-icon color='blue' v-if="hasRole(Roles.DIRECTOR, 1, 'ATLEAST')">mdi-check</v-icon>
        <span v-else><v-icon color='red' v-if="showErrors">mdi-close</v-icon></span>
        <span class='chk-list-item-txt'>At least one Director</span>
      </li>
    </ul>
    <div class="btn-panel" v-show="orgPersonList.length === 0">
      <v-btn outlined color="primary" @click="addOrgPerson([ Roles.COMPLETING_PARTY ], IncorporatorTypes.PERSON)"
      :disabled="showOrgPersonForm">
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>
    <div class="btn-panel"  v-show="orgPersonList.length > 0">
      <v-btn outlined color="primary" @click="addOrgPerson([], IncorporatorTypes.PERSON)"
      :disabled="showOrgPersonForm">
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>
      <v-btn outlined color="primary" :disabled="showOrgPersonForm" class="spacedButton"
      @click="addOrgPerson([Roles.INCORPORATOR], IncorporatorTypes.CORPORATION)">
        <v-icon>mdi-domain-plus</v-icon>
        <span>Add a Corporation or Firm</span>
      </v-btn>
      <v-btn outlined color="primary" @click="addOrgPerson([Roles.COMPLETING_PARTY], IncorporatorTypes.PERSON)"
      :disabled="showOrgPersonForm"  class="spacedButton" v-if="!hasRole(Roles.COMPLETING_PARTY, 1, 'ATLEAST')">
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>
    <v-card flat class="people-roles-container" v-if="showOrgPersonForm">
      <OrgPerson v-show="showOrgPersonForm"
      :initialValue="currentOrgPerson"
      :activeIndex="activeIndex"
      :nextId="nextId"
      :existingCompletingParty="completingParty"
      @addEditPerson="onAddEditOrgPerson($event)"
      @removePersonEvent="onRemovePerson($event)"
      @resetEvent="resetData()"
      @removeCompletingPartyRole="removeCompletingPartyAssignment()" />
    </v-card>

    <v-card flat v-if="orgPersonList.length > 0" :disabled="showOrgPersonForm" >
      <ListPeopleAndRoles
        v-if="orgPersonList.length > 0"
        :personList="orgPersonList"
        :isSummary="false"
        @editPerson="editOrgPerson($event)"
        @removePerson="onRemovePerson($event)"/>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { OrgPersonIF, BaseAddressObjIF, BaseAddressType, FormType, ActionBindingIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes, Roles, IncorporatorTypes } from '@/enums'

// Components
import OrgPerson from './OrgPerson.vue'
import ListPeopleAndRoles from './ListPeopleAndRoles.vue'

// Schemas
import { addressSchema } from '@/schemas'

@Component({
  components: {
    OrgPerson,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(EntityFilterMixin) {
   $refs!: {
    addPersonForm: FormType,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType
  }

   // State
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList: OrgPersonIF[]

  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  private newOrgPerson: OrgPersonIF = {
    id: null,
    firstName: '',
    lastName: '',
    middleName: '',
    orgName: '',
    type: '',
    roles: [],
    address: {
      mailingAddress: {
        streetAddress: '',
        streetAddressAdditional: '',
        addressCity: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: '',
        deliveryInstructions: ''
      }
    }
  }

  private showOrgPersonForm: boolean = false
  private activeIndex: number = -1
  private addEditInProgress: boolean = false
  private currentOrgPerson: OrgPersonIF | null = null
  private nextId: number = -1

  readonly EntityTypes: {} = EntityTypes
  readonly Roles: {} = Roles
  readonly IncorporatorTypes: {} = IncorporatorTypes

  // Methods
  private addOrgPerson (rolesToInitialize: string[], type: string): void {
    this.currentOrgPerson = { ...this.newOrgPerson }
    this.currentOrgPerson.roles = rolesToInitialize
    this.currentOrgPerson.type = type
    this.activeIndex = -1
    this.nextId = (this.orgPersonList.length === 0) ? 0 : this.orgPersonList[this.orgPersonList.length - 1].id + 1
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private editOrgPerson (index: number) : void {
    this.currentOrgPerson = { ...this.orgPersonList[index] }
    this.activeIndex = index
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private onAddEditOrgPerson (person: OrgPersonIF): void {
    let newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    // New Person.
    if (this.activeIndex === -1) {
      newList.push(person)
    } else {
    // Edit Person.
      newList.splice(this.activeIndex, 1, person)
    }
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  private onRemovePerson (index: number) : void {
    let newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    newList.splice(this.activeIndex, 1)
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  private removeCompletingPartyAssignment () {
    let newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    const cpList = newList.filter(people => people.roles.includes(Roles.COMPLETING_PARTY))
    if (cpList.length > 0) {
      let completingParty : OrgPersonIF = cpList[0]
      completingParty.roles = completingParty.roles.filter(role => role !== Roles.COMPLETING_PARTY)
      this.setOrgPersonList(newList)
    }
  }

  private resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showOrgPersonForm = false
  }

  private hasValidRoles () : boolean {
    const numOfDirector: number =
    this.orgPersonList.filter(people => people.roles.includes(Roles.DIRECTOR)).length
    const numOfIncorporator: number =
    this.orgPersonList.filter(people => people.roles.includes(Roles.INCORPORATOR)).length
    const numOfCompletingParty: number =
    this.orgPersonList.filter(people => people.roles.includes(Roles.COMPLETING_PARTY)).length
    const numOfPeopleWithNoRoles:number =
    this.orgPersonList.filter(people => people.roles.length === 0).length

    if (this.entityFilter(EntityTypes.BCOMP)) {
      return numOfCompletingParty === 1 && numOfIncorporator >= 1 && numOfDirector >= 1 && numOfPeopleWithNoRoles === 0
    } else if (this.entityFilter(EntityTypes.COOP)) {
      return numOfCompletingParty === 1 && numOfIncorporator >= 3 && numOfDirector >= 3 && numOfPeopleWithNoRoles === 0
    }
  }

  private hasRole (roleName: string, count:number, mode:string) : boolean {
    const orgPersonWithSpecifiedRole: OrgPersonIF[] =
    this.orgPersonList.filter(people => people.roles.includes(roleName))
    if (mode === 'EXACT') {
      return orgPersonWithSpecifiedRole.length === count
    } else if (mode === 'ATLEAST') {
      return orgPersonWithSpecifiedRole.length >= count
    }
  }

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
  }

  private get completingParty () : OrgPersonIF {
    let cp: OrgPersonIF | null = null
    const cpList = this.orgPersonList.filter(people => people.roles.includes(Roles.COMPLETING_PARTY))
    if (cpList.length > 0) {
      cp = cpList[0]
    }
    return cp
  }
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
ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem
}
li {
  padding-top:0.25rem
}
p{
  padding-top: 0.5rem;
}
.btn-panel {
  padding-top: 0.5rem;
}
.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
}
.spacedButton {
  margin-left: 0.5rem
}
.chk-list-item-txt {
  margin-left: 0.5rem;
}
</style>
