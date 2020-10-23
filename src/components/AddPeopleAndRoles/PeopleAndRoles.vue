<template>
  <div>
    <p>
      Add the people and corporations/firms who will have a role in your company. People can have multiple roles;
      Corporation/firms can only be Incorporators.
    </p>
    Your application must include the following:
    <ul>
      <li>
        <v-icon v-if="hasRole(RoleTypes.COMPLETING_PARTY, 1, 'EXACT')" color="blue" class="cp-valid"
          >mdi-check</v-icon>
        <v-icon v-else :color="showErrors ? 'red': 'transparent'" class="cp-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>The Completing Party</span>
      </li>
      <li>
        <v-icon v-if="hasRole(RoleTypes.INCORPORATOR, 1, 'ATLEAST')" color="blue" class="incorp-valid"
          >mdi-check</v-icon>
        <v-icon v-else :color="showErrors ? 'red': 'transparent'" class="incorp-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>At least one Incorporator</span>
      </li>
      <li>
        <v-icon v-if="hasRole(RoleTypes.DIRECTOR, 1, 'ATLEAST')" color="blue" class="dir-valid"
          >mdi-check</v-icon>
        <v-icon v-else :color="showErrors ? 'red': 'transparent'" class="dir-invalid">mdi-close</v-icon>
        <span class='chk-list-item-txt'>At least one Director</span>
      </li>
    </ul>

    <div class="btn-panel" v-if="orgPersonList.length === 0">
      <v-btn
        id="btn-start-add-cp"
        outlined
        color="primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: RoleTypes.COMPLETING_PARTY }], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>

    <div class="btn-panel" v-if="orgPersonList.length > 0">
      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>
      <v-btn
        id="btn-add-corp"
        outlined
        color="primary"
        class="spacedButton"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: RoleTypes.INCORPORATOR }], IncorporatorTypes.CORPORATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span v-if="entityFilter(EntityTypes.BCOMP)">Add a Corporation or Firm</span>
        <span v-if="entityFilter(EntityTypes.COOP)">Add Organization</span>
      </v-btn>
      <v-btn
        v-if="!hasRole(RoleTypes.COMPLETING_PARTY, 1, 'ATLEAST')"
        id="btn-add-cp"
        outlined
        color="primary"
        class="spacedButton"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson([{ roleType: RoleTypes.COMPLETING_PARTY }], IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <v-card v-if="showOrgPersonForm" flat class="people-roles-container">
      <OrgPerson
        v-show="showOrgPersonForm"
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :existingCompletingParty="completingParty"
        @addEditPerson="onAddEditOrgPerson($event)"
        @removePersonEvent="onRemovePerson($event)"
        @resetEvent="resetData()"
        @removeCompletingPartyRole="removeCompletingPartyAssignment()"
      />
    </v-card>

    <v-card v-if="orgPersonList.length > 0" flat :disabled="showOrgPersonForm" >
      <ListPeopleAndRoles
        :personList="orgPersonList"
        :isSummary="false"
        @editPerson="editOrgPerson($event)"
        @removePerson="onRemovePerson($event)"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { ActionBindingIF, OrgPersonIF, RolesIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes, IncorporatorTypes, Modes, RoleTypes } from '@/enums'

// Components
import OrgPerson from './OrgPerson.vue'
import ListPeopleAndRoles from './ListPeopleAndRoles.vue'

@Component({
  components: {
    OrgPerson,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(EntityFilterMixin) {
  // Global state
  @State(state => state.stateModel.addPeopleAndRoleStep.orgPeople)
  readonly orgPersonList!: OrgPersonIF[]

  @State(state => state.stateModel.tombstone.userEmail)
  readonly userEmail!: string

  // Global actions
  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  private newOrgPerson: OrgPersonIF = {
    officer: {
      id: null as string,
      firstName: '',
      lastName: '',
      middleName: '',
      orgName: '',
      partyType: null,
      email: null
    },
    roles: [],
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

  private showOrgPersonForm: boolean = false
  private activeIndex: number = -1
  private addEditInProgress: boolean = false
  private currentOrgPerson: OrgPersonIF | null = null

  // enums for template
  readonly EntityTypes = EntityTypes
  readonly RoleTypes = RoleTypes
  readonly IncorporatorTypes = IncorporatorTypes

  private mounted (): void {
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
  }

  // Methods
  private addOrgPerson (rolesToInitialize: RolesIF[], type: IncorporatorTypes): void {
    this.currentOrgPerson = { ...this.newOrgPerson }
    this.currentOrgPerson.roles = rolesToInitialize
    this.currentOrgPerson.officer.partyType = type
    this.activeIndex = -1
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private editOrgPerson (index: number): void {
    this.currentOrgPerson = { ...this.orgPersonList[index] }
    this.activeIndex = index
    this.addEditInProgress = true
    this.showOrgPersonForm = true
  }

  private onAddEditOrgPerson (person: OrgPersonIF): void {
    // if this is the completing party, assign email address from user profile
    if (person.roles.find(role => role.roleType === RoleTypes.COMPLETING_PARTY)) {
      person.officer.email = this.userEmail
    }

    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    if (this.activeIndex === -1) {
      // Add Person.
      newList.push(person)
    } else {
      // Edit Person.
      newList.splice(this.activeIndex, 1, person)
    }
    // set updated list
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  private onRemovePerson (index: number): void {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    newList.splice(index, 1)
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  private removeCompletingPartyAssignment () {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    const completingParty =
      newList.find(people => people.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY))
    if (completingParty) {
      // remove the Completing Party role
      completingParty.roles = completingParty.roles.filter(role => role.roleType !== RoleTypes.COMPLETING_PARTY)
      // remove email address that we got from user profile
      completingParty.officer.email = null
      // set updated list
      this.setOrgPersonList(newList)
    }
  }

  private resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showOrgPersonForm = false
  }

  private hasValidRoles (): boolean {
    const numOfDirector = this.orgPersonList.filter(people => people.roles
      .some(party => party.roleType === RoleTypes.DIRECTOR)).length
    const numOfIncorporator = this.orgPersonList.filter(people => people.roles
      .some(party => party.roleType === RoleTypes.INCORPORATOR)).length
    const numOfCompletingParty = this.orgPersonList.filter(people => people.roles
      .some(party => party.roleType === RoleTypes.COMPLETING_PARTY)).length
    const numOfPeopleWithNoRoles = this.orgPersonList.filter(people => people.roles.length === 0).length

    if (this.entityFilter(EntityTypes.BCOMP)) {
      return numOfCompletingParty === 1 && numOfIncorporator >= 1 && numOfDirector >= 1 && numOfPeopleWithNoRoles === 0
    } else if (this.entityFilter(EntityTypes.COOP)) {
      return numOfCompletingParty === 1 && numOfIncorporator >= 3 && numOfDirector >= 3 && numOfPeopleWithNoRoles === 0
    }
  }

  private hasRole (roleName: RoleTypes, count: number, mode: string): boolean {
    const orgPersonWithSpecifiedRole =
      this.orgPersonList.filter(people => people.roles.some(party => party.roleType === roleName))

    if (mode === Modes.EXACT) {
      return (orgPersonWithSpecifiedRole.length === count)
    } else if (mode === Modes.AT_LEAST) {
      return (orgPersonWithSpecifiedRole.length >= count)
    }
  }

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
  }

  private get completingParty () : OrgPersonIF {
    return this.orgPersonList.find(people => people.roles.some(party => party.roleType === RoleTypes.COMPLETING_PARTY))
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
}
ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem;
}
li {
  padding-top:0.25rem;
}
p{
  padding-top: 0.5rem;
}
.btn-panel {
  padding: 2rem 0 2rem 0;
}
.sub-header {
  padding-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
}
.spacedButton {
  margin-left: 0.5rem;
}
.chk-list-item-txt {
  margin-left: 0.5rem;
}
</style>
