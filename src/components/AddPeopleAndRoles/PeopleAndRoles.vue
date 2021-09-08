<template>
  <div id="people-and-roles">
    <p v-if="getPeopleAndRolesResource.blurb" class="mb-0">
      {{ getPeopleAndRolesResource.blurb }}
    </p>

    <!-- Help Section -->
    <div v-if="getPeopleAndRolesResource.helpSection" class="mt-5">
      <span class="help-btn" @click="helpToggle = !helpToggle">
        <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
        <span v-if="!helpToggle">{{ getPeopleAndRolesResource.helpSection.header }}</span>
        <span v-else>Hide Help</span>
      </span>
      <section v-show="helpToggle" class="people-and-roles-help">
        <header id="people-and-roles-help-header"><h2>{{getPeopleAndRolesResource.helpSection.header}}</h2></header>
        <p
          v-for="(item, index) in getPeopleAndRolesResource.helpSection.helpText"
          class="help-section"
          :key="index"
        >{{ item }}</p>
        <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
      </section>
    </div>

    <section class="mt-5">
      <strong>Your application must include the following:</strong>
      <ul>
        <template v-for="(rule, index) in getPeopleAndRolesResource.rules">
          <li v-if="rule.rule === Rules.NUM_COMPLETING_PARTY" :key="index">
            <v-icon v-if="validNumCompletingParty" color="green darken-2"
              class="cp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="cp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.rule === Rules.NUM_INCORPORATORS" :key="index">
            <v-icon v-if="validMinimumIncorporators" color="green darken-2"
              class="incorp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="incorp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.rule === Rules.NUM_DIRECTORS" :key="index">
            <v-icon v-if="validMinimumDirectors" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.rule === Rules.DIRECTOR_COUNTRY" :key="index">
            <v-icon v-if="validDirectorCountry" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.rule === Rules.DIRECTOR_PROVINCE" :key="index">
            <v-icon v-if="validDirectorProvince" color="green darken-2"
              class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="chk-list-item-txt">{{rule.text}}</span>
          </li>
        </template>
      </ul>
    </section>

    <div class="btn-panel" v-if="orgPersonList.length === 0">
      <v-btn
        id="btn-start-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, IncorporatorTypes.PERSON)"
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
        class="btn-outlined-primary"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(null, IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>
      <v-btn
        id="btn-add-corp"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        :disabled="showOrgPersonForm"
        v-if="getPeopleAndRolesResource.addOrganization"
        @click="addOrgPerson(RoleTypes.INCORPORATOR, IncorporatorTypes.CORPORATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span v-if="entityFilter(CorpTypeCd.COOP)">Add Organization</span>
        <span v-else>Add a Corporation or Firm</span>
      </v-btn>
      <v-btn
        v-if="!validNumCompletingParty"
        id="btn-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, IncorporatorTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>
    </div>

    <v-card v-if="showOrgPersonForm" flat class="people-roles-container">
      <OrgPerson
        :initialValue="currentOrgPerson"
        :activeIndex="activeIndex"
        :existingCompletingParty="completingParty"
        :addIncorporator="getPeopleAndRolesResource.addIncorporator"
        @addEditPerson="onAddEditPerson($event)"
        @removePerson="onRemovePerson($event)"
        @resetEvent="resetData()"
        @removeCompletingPartyRole="removeCompletingPartyAssignment()"
      />
    </v-card>

    <v-card v-if="orgPersonList.length > 0" flat :disabled="showOrgPersonForm" >
      <ListPeopleAndRoles
        :personList="orgPersonList"
        :isSummary="false"
        :showErrorSummary="!getAddPeopleAndRoleStep.valid"
        @editPerson="onEditPerson($event)"
        @removePerson="onRemovePerson($event)"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'

// Interfaces
import { ActionBindingIF, AddressIF, EmptyAddress, EmptyOrgPerson, OrgPersonIF, PeopleAndRoleIF,
  PeopleAndRolesResourceIF, TombstoneIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { CorpTypeCd, IncorporatorTypes, NumWord, RoleTypes, Rules } from '@/enums'

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
  @Getter getTombstone!: TombstoneIF
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getShowErrors!: boolean
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserAddress!: AddressIF

  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  private helpToggle = false
  private showOrgPersonForm = false
  private activeIndex = -1
  private currentOrgPerson: OrgPersonIF = null

  // Enums for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly IncorporatorTypes = IncorporatorTypes
  readonly NumWord = NumWord
  readonly Rules = Rules

  /** The list of organizations/persons. */
  private get orgPersonList (): OrgPersonIF[] {
    return this.getAddPeopleAndRoleStep.orgPeople
  }

  /** The list of completing parties. */
  private get completingParties (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.COMPLETING_PARTY)
    )
  }

  /** The list of incorporators. */
  private get incorporators (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.INCORPORATOR)
    )
  }

  /** The list of directors. */
  private get directors (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.DIRECTOR)
    )
  }

  /** The list of people without roles. */
  private get peopleWithNoRoles (): OrgPersonIF[] {
    return this.orgPersonList.filter(people => people.roles.length === 0)
  }

  /** Whether the Completing Party rule is valid. Always true if rule doesn't exist. */
  private get validNumCompletingParty (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.rule === Rules.NUM_COMPLETING_PARTY)
    if (!rule) return true
    return rule.test(this.completingParties.length)
  }

  /** Whether the Minimum Incorporators rule is valid. Always true if rule doesn't exist. */
  private get validMinimumIncorporators (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.rule === Rules.NUM_INCORPORATORS)
    if (!rule) return true
    return rule.test(this.incorporators.length)
  }

  /** Whether the Minimum Directors rule is valid. Always true if rule doesn't exist. */
  private get validMinimumDirectors (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.rule === Rules.NUM_DIRECTORS)
    if (!rule) return true
    return rule.test(this.directors.length)
  }

  /** Whether the Director Country rule is valid. Always true if rule doesn't exist. */
  private get validDirectorCountry (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.rule === Rules.DIRECTOR_COUNTRY)
    if (!rule) return true
    const num = this.directors.filter(d => rule.test(d.mailingAddress.addressCountry)).length
    // evaluate this rule only when there are enough minimum directors
    return (this.validMinimumDirectors && num > this.directors.length / 2) // more than half
  }

  /** Whether the Director Province rule is valid. Always true if rule doesn't exist. */
  private get validDirectorProvince (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.rule === Rules.DIRECTOR_PROVINCE)
    if (!rule) return true
    const num = this.directors.filter(
      d => rule.test(d.mailingAddress.addressCountry, d.mailingAddress.addressRegion)
    ).length
    return (num > 0) // at least one
  }

  /** Whether there are any people without roles. Used as a safety check. */
  private get validPeopleWithNoRoles (): boolean {
    return (this.peopleWithNoRoles.length > 0)
  }

  /** The completing party (or undefined if not found). */
  private get completingParty () : OrgPersonIF {
    return this.orgPersonList.find(people => people.roles.some(party => party.roleType === RoleTypes.COMPLETING_PARTY))
  }

  /** Sets this step's validity when component is mounted. */
  private mounted (): void {
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
  }

  private addOrgPerson (roleType: RoleTypes, partyType: IncorporatorTypes): void {
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
    if (roleType === RoleTypes.COMPLETING_PARTY && partyType === IncorporatorTypes.PERSON) {
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

  /** Returns true if subject org/person is a director. */
  private isDirector (orgPerson: OrgPersonIF): boolean {
    return orgPerson.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
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

  private removeCompletingPartyAssignment () {
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

.chk-list-item-txt {
  margin-left: 0.5rem;
}
</style>
