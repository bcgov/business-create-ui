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
          <li v-if="rule.id === RuleIds.NUM_PROPRIETORS" :key="index">
            <v-icon v-if="validNumProprietors" color="green darken-2" class="proprietor-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="proprietor-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
          <li v-if="rule.id === RuleIds.NUM_PARTNERS" :key="index">
            <v-icon v-if="validNumPartners" color="green darken-2" class="partner-valid">mdi-check</v-icon>
            <v-icon v-else-if="getShowErrors" color="error" class="partner-invalid">mdi-close</v-icon>
            <v-icon v-else>mdi-circle-small</v-icon>
            <span class="rule-item-txt">{{rule.text}}</span>
          </li>
        </template>
      </ul>
    </section>

    <!-- More blurb(s) -->
    <!-- NB: only shown when user needs to select the Proproietor -->
    <template v-if="blurb2 && orgPersonList.length > 0 && !validNumProprietors">
      <p class="blurb-para" v-html="blurb2" />
    </template>
    <template v-if="blurbs2 && orgPersonList.length > 0 && !validNumProprietors">
      <p v-for="(blurb, index) in blurbs2" :key="`blurb2-${index}`" class="blurb-para" v-html="blurb" />
    </template>

    <!-- Start by Adding the Completing Party -->
    <div v-if="orgPersonList.length === 0">
      <v-btn
        outlined
        color="primary"
        class="btn-outlined-primary mt-6 btn-start-add-cp"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Start by Adding the Completing Party</span>
      </v-btn>
    </div>

    <!-- Add a Person or Organization -->
    <div v-if="orgPersonList.length > 0">
      <v-btn
        v-if="!validNumCompletingParty"
        outlined
        color="primary"
        class="btn-outlined-primary mt-6 btn-add-cp"
        :disabled="showOrgPersonForm"
        @click="addOrgPerson(RoleTypes.COMPLETING_PARTY, PartyTypes.PERSON)"
      >
        <v-icon>mdi-account-plus-outline</v-icon>
        <span>Add the Completing Party</span>
      </v-btn>

      <template v-if="isTypeSoleProp">
        <v-btn
          v-if="!validNumProprietors"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6 btn-add-person"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PROPRIETOR, PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>

        <v-btn
          v-if="!validNumProprietors"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6 btn-add-organization"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PROPRIETOR, PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a Business or a Corporation</span>
        </v-btn>
      </template>

      <template v-if="isTypePartnership">
        <v-btn
          outlined
          color="primary"
          class="btn-outlined-primary mt-6 btn-add-person"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PARTNER, PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>

        <v-btn
          outlined
          color="primary"
          class="btn-outlined-primary mt-6 btn-add-organization"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PARTNER, PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a Business or a Corporation</span>
        </v-btn>
      </template>
    </div>

    <!-- Add/Edit Bus/Corp -->
    <v-expand-transition>
      <v-card flat v-if="showOrgPersonForm" class="mt-8">
        <RegAddEditOrgPerson
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
import { Component, Mixins } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { cloneDeep } from 'lodash'
import { ActionBindingIF, EmptyAddress, EmptyOrgPerson } from '@/interfaces'
import { BusinessTypes, PartyTypes, RoleTypes } from '@/enums'
import { PeopleRolesMixin } from '@/mixins'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import HelpSection from '@/components/common/HelpSection.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import RegAddEditOrgPerson from '@/components/Registration/RegAddEditOrgPerson.vue'

/**
 * This is similar to the common PeopleAndRoles component but this
 * component has a lot of logic specific to SP/GP Registrations.
 */
@Component({
  components: {
    ConfirmDialog,
    HelpSection,
    ListPeopleAndRoles,
    RegAddEditOrgPerson
  }
})
export default class RegPeopleAndRoles extends Mixins(PeopleRolesMixin) {
  @Action setRegistrationBusinessType!: ActionBindingIF

  //
  // NB: see mixin for common properties, methods, etc.
  //

  protected async addOrgPerson (roleType: RoleTypes, partyType: PartyTypes): Promise<void> {
    const isProprietor = (roleType === RoleTypes.PROPRIETOR)
    const isPerson = (partyType === PartyTypes.PERSON)
    const isOrganization = (partyType === PartyTypes.ORGANIZATION)

    // if the proprietor is a person then this is a SP
    if (isProprietor && isPerson) {
      if (!await this.confirmAddProprietorPerson()) return
      this.setRegistrationBusinessType(BusinessTypes.SP)
    }

    // if the proprietor is an org then this is a DBA
    if (isProprietor && isOrganization) {
      if (!await this.confirmAddProprietorOrganization()) return
      this.setRegistrationBusinessType(BusinessTypes.DBA)
    }

    // first assign empty org/person object
    this.currentOrgPerson = cloneDeep(EmptyOrgPerson)

    if (roleType) {
      // a role was provided - pre-select it
      this.currentOrgPerson.roles = [{ roleType }]
    } else if (this.validNumCompletingParty && this.isTypeSoleProp) {
      // only Proprietor role is possible - pre-select it
      this.currentOrgPerson.roles = [{ roleType: RoleTypes.PROPRIETOR }]
    } else if (this.validNumCompletingParty && this.isTypePartnership) {
      // only Partner role is possible - pre-select it
      this.currentOrgPerson.roles = [{ roleType: RoleTypes.PARTNER }]
    } else {
      // no roles pre-selected
      this.currentOrgPerson.roles = []
    }

    // assign party type (org or person)
    this.currentOrgPerson.officer.partyType = partyType

    // pre-populate Completing Party's name, email address and mailing address only if logged in user is not staff
    // (registries or sbc)
    if (roleType === RoleTypes.COMPLETING_PARTY && partyType === PartyTypes.PERSON && !(this.isRoleStaff ||
      this.isSbcStaff)) {
      this.currentOrgPerson.officer.firstName = this.getUserFirstName || ''
      this.currentOrgPerson.officer.lastName = this.getUserLastName || ''
      this.currentOrgPerson.officer.email = this.getTombstone.userEmail
      this.currentOrgPerson.mailingAddress = this.getUserAddress || { ...EmptyAddress }
    }

    // make a proprietor's initial delivery address "same as" their mailing address
    if (isProprietor && isPerson) {
      this.currentOrgPerson.deliveryAddress = cloneDeep(this.currentOrgPerson.mailingAddress)
    }

    if (isOrganization) {
      this.currentOrgPerson.isLookupBusiness = true
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
