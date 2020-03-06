<template>
  <div>
    <p>
      Add the people and corporations/firms who will have a role in your company. People can have multiple roles;
      Corporation/firms can only be Incorporators.
    </p>
    Your application must include the following:
    <ul>
      <li><v-icon color='blue'>mdi-check</v-icon>The Completing Party</li>
      <li>At least one Incorporator</li>
      <li>At least one Director</li>
    </ul>
    <div class="btn-panel">
      <v-btn outlined color="primary" @click="initAddCompletingParty()"
      :disabled="showAddEditPersonForm" v-show="personList.length === 0">
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>
    <v-card flat class="people-roles-container" v-if="personList.length > 0 || showAddEditPersonForm">
      <AddEditPerson v-if="showAddEditPersonForm"
      :initialValue="currentPerson"
      :activeIndex="activePersonIndex"
      :nextId="nextPersonId"
      @addEditPerson="onAddEditPerson($event)" />
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
import AddEditPerson from './AddEditPerson.vue'

// Schemas
import { addressSchema } from '@/schemas'

@Component({
  components: {
    AddEditPerson
  }
})
export default class PeopleAndRoles extends Mixins(EntityFilterMixin) {
   $refs!: {
    addPersonForm: FormType,
    mailingAddressNew: BaseAddressType,
    deliveryAddressNew: BaseAddressType
  }

   // State
  @State(state => state.stateModel.addPeopleAndRoleStep.people)
  readonly personList: OrgPersonIF[]

  @Action setPersonList!: ActionBindingIF

  private newPerson: OrgPersonIF = {
    id: null,
    firstName: '',
    lastName: '',
    middleName: '',
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

  private showAddEditPersonForm: boolean = false
  private activePersonIndex: number = -1
  private personAddEditInProgress: boolean = false
  private currentPerson: OrgPersonIF | null = null
  private nextPersonId: Number = -1

  readonly EntityTypes: {} = EntityTypes

  // Methods
  private initAddCompletingParty (): void {
    this.currentPerson = this.newPerson
    this.currentPerson.roles = ['Completing Party']
    this.activePersonIndex = null
    this.nextPersonId = this.personList.length + 1
    this.personAddEditInProgress = true
    this.showAddEditPersonForm = true
  }

  private onAddEditPerson (person: OrgPersonIF): void {
    let modifiedPersonList: OrgPersonIF[] = Object.assign([], this.personList)
    // New Person.
    if (this.activePersonIndex === -1) {
      modifiedPersonList.push(person)
    } else {
    // Edit Person.
      modifiedPersonList.splice(this.activePersonIndex, 1, person)
    }
    this.currentPerson = null
    this.activePersonIndex = -1
    this.personAddEditInProgress = false
    this.showAddEditPersonForm = false

    this.setPersonList(modifiedPersonList)
    // Call validate here to check whether over al rules like the minimum number
    // of directors and other rules are met. Also set the step validity in that method
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
</style>
