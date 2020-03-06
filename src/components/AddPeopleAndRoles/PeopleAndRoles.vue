<template>
  <div>
    <p>
      Add the people and corporations/firms who will have a role in your company. People can have multiple roles;
      Corporation/firms can only be Incorporators.
    </p>
    Your application must include the following:
    <ul>
      <li><v-icon color='blue' v-if="hasRole('Completing Party')">mdi-check</v-icon>The Completing Party</li>
      <li><v-icon color='blue' v-if="hasRole('Incorporator')">mdi-check</v-icon>At least one Incorporator</li>
      <li><v-icon color='blue' v-if="hasRole('Director')">mdi-check</v-icon>At least one Director</li>
    </ul>
    <div class="btn-panel" v-show="orgPersonList.length === 0">
      <v-btn outlined color="primary" @click="addOrgPerson(['Completing Party'], 'Person')"
      :disabled="showOrgPersonForm">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>
    <div class="btn-panel"  v-show="orgPersonList.length > 0">
      <v-btn outlined color="primary" @click="addOrgPerson([], 'Person')"
      :disabled="showOrgPersonForm">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>
      <v-btn outlined color="primary" :disabled="showOrgPersonForm" class="spacedButton"
      @click="addOrgPerson(['Incorporator'], 'Org')">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span>Add a Corporation or Firm</span>
      </v-btn>
      <v-btn outlined color="primary" @click="addOrgPerson(['Completing Party'], 'Person')"
      :disabled="showOrgPersonForm"  class="spacedButton" v-if="!hasRole('Completing Party')">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>
    <v-card flat class="people-roles-container" v-if="showOrgPersonForm">
      <OrgPerson v-if="showOrgPersonForm"
      :initialValue="currentOrgPerson"
      :activeIndex="activeIndex"
      :nextId="nextId"
      @addEditPerson="onAddEditOrgPerson($event)"
      @resetEvent="onResetEvent()" />
    </v-card>

    <v-card flat class="people-roles-container" v-if="orgPersonList.length > 0">
      <ListPeopleAndRoles v-if="orgPersonList.length > 0"/>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

// Interfaces
import { OrgPersonIF, BaseAddressObjIF, BaseAddressType, FormType, ActionBindingIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes } from '@/enums'

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
  private nextId: Number = -1

  readonly EntityTypes: {} = EntityTypes

  // Methods
  private addOrgPerson (rolesToInitialize: string[], type: string): void {
    this.currentOrgPerson = this.newOrgPerson
    this.currentOrgPerson.roles = rolesToInitialize
    this.currentOrgPerson.type = type
    this.activeIndex = -1
    this.nextId = this.orgPersonList.length + 1
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
    // Call validate here to check over al1 rules like the minimum number
    // of directors and other rules are met. Also set the step validity in that method
  }

  private onResetEvent (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.addEditInProgress = false
    this.showOrgPersonForm = false
  }

  private hasRole (roleName: string) : boolean {
    const orgPersonWithSpecifiedRole: OrgPersonIF[] =
    this.orgPersonList.filter(people => people.roles.includes(roleName))
    return orgPersonWithSpecifiedRole.length > 0
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
ul, p {
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
</style>
