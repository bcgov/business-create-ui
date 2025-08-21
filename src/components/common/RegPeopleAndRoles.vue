<template>
  <div id="reg-people-and-roles">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#reg-people-and-roles"
    />

    <!-- Blurb(s) -->
    <template v-if="blurb">
      <p
        class="blurb-para"
        v-html="blurb"
      />
    </template>
    <template v-if="blurbs">
      <p
        v-for="(blurb, index) in blurbs"
        :key="index"
        class="blurb-para"
        v-html="blurb"
      />
    </template>

    <!-- Checklist section -->
    <section class="mt-5">
      <div class="subhead">
        {{ subheader }}
      </div>
      <ul>
        <template v-for="(rule, index) in getPeopleAndRolesResource.rules">
          <RuleListItem
            v-if="rule.id === RuleIds.NUM_COMPLETING_PARTY"
            :key="index"
            class="completing-party-rule pt-2"
            :valid="validNumCompletingParty"
            :showErrors="getShowErrors"
            :text="rule.text"
          />
          <RuleListItem
            v-if="rule.id === RuleIds.NUM_PROPRIETORS"
            :key="index"
            class="proprietors-rule pt-2"
            :valid="validNumProprietors"
            :showErrors="getShowErrors"
            :text="rule.text"
          />
          <RuleListItem
            v-if="rule.id === RuleIds.NUM_PARTNERS"
            :key="index"
            class="partners-rule pt-2"
            :valid="validNumPartners"
            :showErrors="getShowErrors"
            :text="rule.text"
          />
          <RuleListItem
            v-if="rule.id === RuleIds.NUM_APPLICANT_PERSON"
            :key="index"
            class="applicant-person-rule pt-2"
            :valid="validApplicantPerson"
            :showErrors="getShowErrors && !validApplicantOrg"
            :text="rule.text"
          />
          <RuleListItem
            v-if="rule.id === RuleIds.NUM_APPLICANT_ORG"
            :key="index"
            class="applicant-org-rule pt-2"
            :valid="validApplicantOrg"
            :showErrors="getShowErrors && !validApplicantPerson"
            :text="rule.text"
          />
        </template>
      </ul>
    </section>

    <!-- More blurb(s) -->
    <!-- NB: only shown when user needs to select the Proproietor -->
    <template v-if="blurb2 && orgPersonList.length > 0 && !validNumProprietors">
      <p
        class="blurb-para"
        v-html="blurb2"
      />
    </template>
    <template v-if="blurbs2 && orgPersonList.length > 0 && !validNumProprietors">
      <p
        v-for="(blurb, index) in blurbs2"
        :key="`blurb2-${index}`"
        class="blurb-para"
        v-html="blurb"
      />
    </template>

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

      <template v-if="isEntitySoleProp">
        <v-btn
          v-if="!validNumProprietors"
          id="btn-add-person"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PROPRIETOR, PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>

        <v-btn
          v-if="!validNumProprietors"
          id="btn-add-organization"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PROPRIETOR, PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a Business or a Corporation</span>
        </v-btn>
      </template>

      <template v-if="isEntityPartnership">
        <v-btn
          id="btn-add-person"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PARTNER, PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>

        <v-btn
          id="btn-add-organization"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm"
          @click="addOrgPerson(RoleTypes.PARTNER, PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a Business or a Corporation</span>
        </v-btn>
      </template>

      <template v-if="isFullRestorationFiling || isLimitedRestorationFiling">
        <v-btn
          id="btn-add-person"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm || validApplicantPerson || validApplicantOrg"
          @click="addOrgPerson(RoleTypes.APPLICANT, PartyTypes.PERSON)"
        >
          <v-icon>mdi-account-plus</v-icon>
          <span>Add a Person</span>
        </v-btn>

        <v-btn
          id="btn-add-organization"
          outlined
          color="primary"
          class="btn-outlined-primary mt-6"
          :disabled="showOrgPersonForm || validApplicantPerson || validApplicantOrg"
          @click="addOrgPerson(RoleTypes.APPLICANT, PartyTypes.ORGANIZATION)"
        >
          <v-icon>mdi-domain-plus</v-icon>
          <span>Add a Business or a Corporation</span>
        </v-btn>
      </template>
    </div>

    <!-- Add/Edit Bus/Corp -->
    <v-expand-transition>
      <v-card
        v-if="showOrgPersonForm"
        flat
        class="mt-8"
      >
        <RegAddEditOrgPerson
          :initialValue="currentOrgPerson"
          :activeIndex="activeIndex"
          :docType="docType"
          :existingCompletingParty="completingParty"
          @addEditPerson="onAddEditPerson($event)"
          @removePerson="onRemovePerson($event)"
          @resetEvent="resetData()"
          @removeCompletingPartyRole="onRemoveCompletingPartyRole()"
        />
      </v-card>
    </v-expand-transition>

    <!-- List of People and Roles -->
    <v-card
      v-if="orgPersonList.length > 0"
      flat
      class="mt-8"
    >
      <ListPeopleAndRoles
        :isSummary="false"
        :disabled="showOrgPersonForm"
        :showDeliveryAddressColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
        :showRolesColumn="!isFullRestorationFiling && !isLimitedRestorationFiling"
        :showEmailColumn="isFullRestorationFiling || isLimitedRestorationFiling"
        @editPerson="onEditPerson($event)"
        @removePerson="onRemovePerson($event)"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { cloneDeep } from 'lodash'
import { EmptyOrgPerson } from '@/interfaces'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'
import { AuthorizedActions, BusinessTypes, PartyTypes, RoleTypes } from '@/enums'
import { PeopleRolesMixin } from '@/mixins'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import HelpSection from '@/components/common/HelpSection.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import RegAddEditOrgPerson from '@/components/common/RegAddEditOrgPerson.vue'
import RuleListItem from '@/components/common/RuleListItem.vue'

/**
 * This is similar to the common PeopleAndRoles component but this
 * component has a lot of logic specific to SP/GP Registrations.
 */
@Component({
  components: {
    ConfirmDialog,
    HelpSection,
    ListPeopleAndRoles,
    RegAddEditOrgPerson,
    RuleListItem
  }
})
export default class RegPeopleAndRoles extends Mixins(PeopleRolesMixin) {
  //
  // NB: see mixin for common properties, methods, etc.
  //

  @Action(useStore) setRegistrationBusinessType!: (x: BusinessTypes) => void
  @Getter(useStore) isRestorationFiling!: boolean

  get docType (): string {
    return this.isRestorationFiling ? 'restoration' : 'registration'
  }

  get subheader (): string {
    return (
      this.getPeopleAndRolesResource.subheader ||
      'Your application must include the following:'
    )
  }

  async addOrgPerson (roleType: RoleTypes, partyType: PartyTypes): Promise<void> {
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
    } else if (this.validNumCompletingParty && this.isEntitySoleProp) {
      // only Proprietor role is possible - pre-select it
      this.currentOrgPerson.roles = [{ roleType: RoleTypes.PROPRIETOR }]
    } else if (this.validNumCompletingParty && this.isEntityPartnership) {
      // only Partner role is possible - pre-select it
      this.currentOrgPerson.roles = [{ roleType: RoleTypes.PARTNER }]
    } else {
      // no roles pre-selected
      this.currentOrgPerson.roles = []
    }

    // assign party type (org or person)
    this.currentOrgPerson.officer.partyType = partyType

    // pre-populate Completing Party's name, email address and mailing address
    // only if not authorized to edit it
    if (
      (roleType === RoleTypes.COMPLETING_PARTY) &&
      (partyType === PartyTypes.PERSON) &&
      !this.IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)
    ) {
      this.currentOrgPerson.officer.firstName = this.getUserFirstName || ''
      this.currentOrgPerson.officer.lastName = this.getUserLastName || ''
      this.currentOrgPerson.officer.email = this.getUserEmail
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

ul {
  padding-top: 0.5rem;
  list-style: none;
  margin-left: 0;
  padding-left: 1rem;
}

p {
  padding-top: 0.5rem;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 44px;
}

.btn-outlined-primary:not(:first-of-type) {
  margin-left: 0.5rem;
}
</style>
