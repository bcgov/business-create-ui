<template>
  <div id="people-and-roles">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#people-and-roles"
    />

    <!-- Blurb(s) -->
    <template v-if="blurb">
      <p class="mb-0" v-html="blurb" />
    </template>
    <template v-if="blurbs">
      <p v-for="(blurb, index) in blurbs" :key="index" class="mb-0" v-html="blurb" />
    </template>

    <!-- Help section -->
    <div v-if="getPeopleAndRolesResource.helpSection" class="mt-5">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getPeopleAndRolesResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="people-and-roles-help">
        <header id="people-and-roles-help-header">
          <h2>{{getPeopleAndRolesResource.helpSection.header}}</h2>
        </header>

        <p v-for="(item, index) in getPeopleAndRolesResource.helpSection.helpText" :key="index">
          {{ item }}
        </p>
        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </div>

    <!-- Checklist section -->
    <section class="mt-5">
      <strong>Your application must include the following:</strong>
      <ul>
        <template v-for="(rule, index) in getPeopleAndRolesResource.rules">
          <li v-if="rule.id === RuleIds.NUM_COMPLETING_PARTY" :key="index">
            <v-icon v-if="validNumCompletingParty" color="green darken-2"
              class="cp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="cp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_INCORPORATORS" :key="index">
            <v-icon v-if="validMinimumIncorporators" color="green darken-2"
              class="incorp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="incorp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_DIRECTORS" :key="index">
            <v-icon v-if="validMinimumDirectors" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.DIRECTOR_COUNTRY" :key="index">
            <v-icon v-if="validDirectorCountry" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.DIRECTOR_PROVINCE" :key="index">
            <v-icon v-if="validDirectorProvince" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_PROPRIETOR" :key="index">
            <v-icon v-if="validNumProprietor" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="prop-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_PARTNERS" :key="index">
            <v-icon v-if="validNumPartner" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="prop-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
        </template>
      </ul>
    </section>

    <!-- Start by Adding the Completing Party -->
    <div class="btn-panel" v-if="orgPersonList.length === 0">
      <v-btn
        id="btn-start-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>

    <!-- Add a Person / Add a Corporation or Firm / Add the Completing Party -->
    <div class="btn-panel" v-if="orgPersonList.length > 0">
      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        class="btn-outlined-primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(null, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>

      <v-btn
        id="btn-add-org"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        :disabled="showOrgPersonForm"
        v-if="getPeopleAndRolesResource.addOrganization"
        @click="addOrgPerson(RoleTypes.INCORPORATOR, PartyTypes.ORGANIZATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span v-if="isTypeCoop">Add Organization</span>
        <span v-else>Add a Corporation or Firm</span>
      </v-btn>

      <v-btn
        id="btn-add-bus"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        v-if="false"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span>Add a Business or a Corporation</span>
      </v-btn>

      <v-btn
        v-if="!validNumCompletingParty"
        id="btn-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <!-- Add/Edit Person/Org -->
    <v-card flat v-if="showOrgPersonForm" class="people-roles-container">
      <AddEditOrgPerson
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :existingCompletingParty="completingParty"
        :addIncorporator="getPeopleAndRolesResource.addIncorporator"
        @addEditPerson="onAddEditPerson($event)"
        @removePerson="onRemovePerson($event)"
        @resetEvent="resetData()"
        @removeCompletingPartyRole="onRemoveCompletingPartyRole()"
      />
    </v-card>

    <!-- Add/Edit Bus/Corp -->
    <v-card flat v-if="false" class="people-roles-container">
      <AddEditBusCorp
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :existingCompletingParty="completingParty"
        :addIncorporator="getPeopleAndRolesResource.addIncorporator"
        @addEditPerson="onAddEditPerson($event)"
        @removePerson="onRemovePerson($event)"
        @resetEvent="resetData()"
        @removeCompletingPartyRole="onRemoveCompletingPartyRole()"
      />
    </v-card>

    <!-- List of People and Roles -->
    <v-card flat v-if="orgPersonList.length > 0" :disabled="showOrgPersonForm">
      <ListPeopleAndRoles
        :isSummary="false"
        @editPerson="onEditPerson($event)"
        @removePerson="onRemovePerson($event)"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import {
  ActionBindingIF, AddressIF, EmptyAddress, EmptyOrgPerson, OrgPersonIF, TombstoneIF
} from '@/interfaces'
import { CorpTypeCd, PartyTypes, NumWord, RoleTypes, RuleIds } from '@/enums'
import { PeopleRolesMixin } from '@/mixins'
import AddEditOrgPerson from '@/components/common/AddEditOrgPerson.vue'
import AddEditBusCorp from '@/components/common/AddEditBusCorp.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import ConfirmDialog from '@/dialogs/ConfirmDialog.vue'

@Component({
  components: {
    ConfirmDialog,
    AddEditOrgPerson,
    AddEditBusCorp,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(PeopleRolesMixin) {
  @Getter getTombstone!: TombstoneIF
  @Getter getShowErrors!: boolean
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserAddress!: AddressIF
  @Getter isTypeCoop!: boolean

  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  // Local variables
  private helpToggle = false
  private showOrgPersonForm = false
  private activeIndex = -1
  private currentOrgPerson: OrgPersonIF = null

  // Enums for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly NumWord = NumWord
  readonly RuleIds = RuleIds

  /** Sets this step's validity when component is mounted. */
  async mounted (): Promise<void> {
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())

    // *** FOR DEBUGGING
    // await this.addPersonConfirm()
    // await this.addBusinessCorporationConfirm()
    // await this.removePersonConfirm()
    // await this.removePersonBusinessConfirm()
  }

  private addOrgPerson (roleType: RoleTypes, partyType: PartyTypes): void {
    // first assign empty org/person object
    this.currentOrgPerson = cloneDeep(EmptyOrgPerson)

    if (roleType) {
      // a role was provided - pre-select it
      this.currentOrgPerson.roles = [{ roleType }]
    } else if (this.validNumCompletingParty && !this.getPeopleAndRolesResource.addIncorporator) {
      // only Director role is possible - pre-select it
      this.currentOrgPerson.roles = [{ roleType: RoleTypes.DIRECTOR }]
    } else {
      // no roles pre-selected
      this.currentOrgPerson.roles = []
    }

    // assign party type (org or person)
    this.currentOrgPerson.officer.partyType = partyType

    // pre-populate Completing Party's name and mailing address
    if (roleType === RoleTypes.COMPLETING_PARTY && partyType === PartyTypes.PERSON) {
      this.currentOrgPerson.officer.firstName = this.getUserFirstName || ''
      this.currentOrgPerson.officer.lastName = this.getUserLastName || ''
      this.currentOrgPerson.mailingAddress = this.getUserAddress || { ...EmptyAddress }
    }

    // make a director's initial delivery address "same as" their mailing address
    if (this.isDirector(this.currentOrgPerson)) {
      this.currentOrgPerson.deliveryAddress = cloneDeep(this.currentOrgPerson.mailingAddress)
    }

    this.activeIndex = -1
    this.showOrgPersonForm = true
  }

  private onEditPerson (index: number): void {
    this.currentOrgPerson = { ...this.orgPersonList[index] }
    this.activeIndex = index
    this.showOrgPersonForm = true
  }

  private onAddEditPerson (person: OrgPersonIF): void {
    // if this is the completing party, assign email address from user profile
    if (person.roles.find(role => role.roleType === RoleTypes.COMPLETING_PARTY) &&
        // email cannot be null or empty
        this.getTombstone.userEmail) {
      person.officer.email = this.getTombstone.userEmail
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

  private onRemoveCompletingPartyRole () {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    const completingParty =
      newList.find(people => people.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY))
    if (completingParty) {
      // remove the Completing Party role
      completingParty.roles = completingParty.roles.filter(role => role.roleType !== RoleTypes.COMPLETING_PARTY)
      // remove email address that we got from user profile
      delete completingParty.officer.email // schema doesn't accept null or empty string
      // set updated list
      this.setOrgPersonList(newList)
    }
  }

  private resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.showOrgPersonForm = false
  }

  private hasValidRoles (): boolean {
    return (
      this.validNumCompletingParty &&
      this.validMinimumIncorporators &&
      this.validMinimumDirectors &&
      this.validDirectorCountry &&
      this.validDirectorProvince &&
      this.validNumProprietor &&
      this.validNumPartners &&
      !this.validPeopleWithNoRoles
    )
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.people-and-roles-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #people-and-roles-help-header {
    display: flex;
    justify-content: center;
  }

  h2, h4 {
    padding: 1rem 0;
  }

  u {
    display: flex;
    direction: rtl;
  }
}

.v-icon.mdi-help-circle-outline,
.v-icon.mdi-circle-small {
  margin-top: -2px;
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

p {
  padding-top: 0.5rem;
}

.btn-panel {
  padding: 2rem 0 2rem 0;
}

.rule-item-txt {
  margin-left: 0.5rem;
}
</style>
