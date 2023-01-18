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
      <div class="subhead">Your application must include the following:</div>
      <ul>
        <template v-for="(rule, index) in getPeopleAndRolesResource.rules">
          <li v-if="rule.id === RuleIds.NUM_COMPLETING_PARTY" :key="index">
            <v-icon v-if="validNumCompletingParty" color="green darken-2" class="cp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="cp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_INCORPORATORS" :key="index">
            <v-icon v-if="validNumIncorporators" color="green darken-2" class="incorp-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="incorp-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_DIRECTORS" :key="index">
            <v-icon v-if="validNumDirectors" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.DIRECTOR_COUNTRY" :key="index">
            <v-icon v-if="validDirectorCountry" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.DIRECTOR_PROVINCE" :key="index">
            <v-icon v-if="validDirectorProvince" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_APPLICANT_PERSON" :key="index">
            <v-icon v-if="validApplicantPerson" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_APPLICANT_ORG" :key="index">
            <v-icon v-if="validApplicantOrg" color="green darken-2" class="dir-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="dir-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
        </template>
      </ul>
    </section>

    <!-- Start by Adding the Completing Party -->
    <div v-if="(orgPersonList.length === 0) && requireCompletingParty">
      <v-btn
        id="btn-start-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary mt-6"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>

    <!-- Add a Person or Organization -->
    <div v-if="(orgPersonList.length > 0) || !requireCompletingParty">
      <v-btn
        v-if="requireCompletingParty && !validNumCompletingParty"
        id="btn-add-cp"
        outlined
        color="primary"
        class="btn-outlined-primary mt-6"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>

      <v-btn
        id="btn-add-person"
        outlined
        color="primary"
        class="btn-outlined-primary mt-6"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(null, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus</v-icon>
        <span>Add a Person</span>
      </v-btn>

      <!-- *** TODO: do not add as Incorporator for restorations -->
      <v-btn
        v-if="getPeopleAndRolesResource.addOrganization"
        id="btn-add-organization"
        outlined
        color="primary"
        class="btn-outlined-primary mt-6"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.INCORPORATOR, PartyTypes.ORGANIZATION)"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span>{{getPeopleAndRolesResource.addOrganization}}</span>
      </v-btn>
    </div>

    <!-- Add/Edit Person/Org -->
    <v-expand-transition>
      <v-card flat v-if="showOrgPersonForm" class="mt-8">
        <!-- FUTURE: move this component into a slot in ListPeopleAndRoles ??? -->
        <AddEditOrgPerson
          :initialValue="currentOrgPerson"
          :activeIndex="activeIndex"
          :existingCompletingParty="completingParty"
          @addEditPerson="onAddEditPerson($event)"
          @removePerson="onRemovePerson($event)"
          @resetEvent="resetData()"
          @removeCompletingPartyRole="onRemoveCompletingPartyRole()"
        />
      </v-card>
    </v-expand-transition>

    <!-- List of People and Roles -->
    <v-card flat v-if="orgPersonList.length > 0" class="mt-8">
      <ListPeopleAndRoles
        :isSummary="false"
        :disabled="showOrgPersonForm"
        @editPerson="onEditPerson($event)"
        @removePerson="onRemovePerson($event)"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { EmptyAddress, EmptyOrgPerson } from '@/interfaces'
import { PartyTypes, RoleTypes } from '@/enums'
import { PeopleRolesMixin } from '@/mixins'
import AddEditOrgPerson from '@/components/common/AddEditOrgPerson.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import HelpSection from '@/components/common/HelpSection.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'

@Component({
  components: {
    AddEditOrgPerson,
    ConfirmDialog,
    HelpSection,
    ListPeopleAndRoles
  },
  mixins: [
    PeopleRolesMixin
  ]
})
export default class PeopleAndRoles extends Vue {
  //
  // NB: see mixin for common properties, methods, etc.
  //

  protected addOrgPerson (roleType: RoleTypes, partyType: PartyTypes): void {
    // first assign empty org/person object
    this.currentOrgPerson = cloneDeep(EmptyOrgPerson)

    // assign pre-selected role if any
    this.currentOrgPerson.roles = roleType ? [{ roleType }] : []

    // assign party type (org or person)
    this.currentOrgPerson.officer.partyType = partyType

    // pre-populate Completing Party's name, email address and and mailing address
    // NB: email address is from user profile
    if (roleType === RoleTypes.COMPLETING_PARTY && partyType === PartyTypes.PERSON) {
      this.currentOrgPerson.officer.firstName = this.getUserFirstName || ''
      this.currentOrgPerson.officer.lastName = this.getUserLastName || ''
      this.currentOrgPerson.officer.email = this.getUserEmail
      this.currentOrgPerson.mailingAddress = this.getUserAddress || { ...EmptyAddress }
    }

    // make a director's initial delivery address "same as" their mailing address
    if (this.isDirector(this.currentOrgPerson)) {
      this.currentOrgPerson.deliveryAddress = cloneDeep(this.currentOrgPerson.mailingAddress)
    }

    this.activeIndex = NaN // new org/person
    this.showOrgPersonForm = true
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

.subhead {
  font-weight: bold;
  color: $gray9;
}

.v-icon.mdi-circle-small {
  margin-top: -2px;
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

.rule-item-txt {
  margin-left: 0.5rem;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 44px;
}

.btn-outlined-primary:not(:first-of-type) {
  margin-left: 0.5rem;
}
</style>
