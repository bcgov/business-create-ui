<template>
  <div id="people-and-roles">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#people-and-roles"
    />

    <!-- Blurb(s) -->
    <template v-if="blurb">
      <p class="blurb-para" v-html="blurb" />
    </template>
    <template v-if="blurbs">
      <p v-for="(blurb, index) in blurbs" :key="index" class="blurb-para" v-html="blurb" />
    </template>

    <!-- Help section -->
    <HelpSection
      class="mt-5"
      v-if="getPeopleAndRolesResource.helpSection"
      :helpSection="getPeopleAndRolesResource.helpSection"
    />

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

    <!-- More blurb(s) -->
    <template v-if="blurb2">
      <p class="blurb-para" v-html="blurb2" />
    </template>
    <template v-if="blurbs2">
      <p v-for="(blurb, index) in blurbs2" :key="`blurb2-${index}`" class="blurb-para" v-html="blurb" />
    </template>

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

    <!-- Add a Person / Organization / Business -->
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
        id="btn-add-organization"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        :disabled="showOrgPersonForm"
        v-if="getPeopleAndRolesResource.addOrganization"
        @click="addOrgPerson(RoleTypes.INCORPORATOR, PartyTypes.ORGANIZATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span>{{getPeopleAndRolesResource.addOrganization}}</span>
      </v-btn>

      <v-btn
        id="btn-add-business"
        outlined
        color="primary"
        class="btn-outlined-primary ml-2"
        v-if="getPeopleAndRolesResource.addBusiness"
        @click="addOrgPerson(RoleTypes.INCORPORATOR, PartyTypes.BUSINESS)"
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
import AddEditBusCorp from '@/components/common/AddEditBusCorp.vue'
import AddEditOrgPerson from '@/components/common/AddEditOrgPerson.vue'
import ConfirmDialog from '@/dialogs/ConfirmDialog.vue'
import HelpSection from '@/components/common/HelpSection.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'

@Component({
  components: {
    AddEditBusCorp,
    AddEditOrgPerson,
    ConfirmDialog,
    HelpSection,
    ListPeopleAndRoles
  }
})
export default class PeopleAndRoles extends Mixins(PeopleRolesMixin) {
  @Getter getTombstone!: TombstoneIF
  @Getter getShowErrors!: boolean
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserAddress!: AddressIF

  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  // Local variables
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

.blurb-para {
  margin-bottom: 0;

  &:not(:first-of-type) {
    padding-top: 1rem;
  }
}

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
  padding-top: 0.5rem;
}

p {
  padding-top: 0.5rem;
}

.btn-panel {
  padding: 2rem 0;
}

.rule-item-txt {
  margin-left: 0.5rem;
}
</style>
