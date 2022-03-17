<template>
  <div id="reg-people-and-roles">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#reg-people-and-roles"
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
          <li v-if="rule.id === RuleIds.NUM_PROPRIETORS" :key="index">
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

    <!-- Add a Person or Business -->
    <div class="btn-panel" v-if="orgPersonList.length > 0">
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

      <!-- *** TODO: should this add a PARTNER? -->
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

      <!-- *** TODO: should this add a PARTNER? -->
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
    </div>

    <!-- Add/Edit Bus/Corp -->
    <v-card flat v-if="showOrgPersonForm" class="people-roles-container">
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
import { Getter } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { AddressIF, EmptyAddress, EmptyOrgPerson } from '@/interfaces'
import { PartyTypes, RoleTypes } from '@/enums'
import { PeopleRolesMixin } from '@/mixins'
import AddEditBusCorp from '@/components/common/AddEditBusCorp.vue'
import ConfirmDialog from '@/dialogs/ConfirmDialog.vue'
import HelpSection from '@/components/common/HelpSection.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'

/**
 * This is similar to the common PeopleAndRoles component but this
 * component has a lot of logic specific to SP/GP Registrations.
 */
@Component({
  components: {
    AddEditBusCorp,
    ConfirmDialog,
    HelpSection,
    ListPeopleAndRoles
  }
})
export default class RegPeopleAndRoles extends Mixins(PeopleRolesMixin) {
  @Getter getShowErrors!: boolean
  @Getter getUserFirstName!: string
  @Getter getUserLastName!: string
  @Getter getUserAddress!: AddressIF

  //
  // NB: see mixin for common methods, getters, etc.
  //

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
