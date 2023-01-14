<template>
  <div id="add-edit-org-person">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#add-edit-org-person"
    />
    <section class="px-6 py-10" :class="{ 'invalid-section': !addPersonOrgFormValid }">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block">
          <!-- Title for org -->
          <label
            v-if="isOrg && isBaseCompany"
            class="add-org-header"
            :class="{'error-text': !addPersonOrgFormValid}"
          >
            <span v-if="isNaN(activeIndex)">Add Corporation or Firm</span>
            <span v-else>Edit Corporation or Firm</span>
          </label>

          <!-- Title for org -->
          <label
            v-if="isOrg && isTypeCoop"
            class="add-org-header"
            :class="{'error-text': !addPersonOrgFormValid}"
          >
            <span v-if="isNaN(activeIndex)">Add Organization</span>
            <span v-else>Edit Organization</span>
          </label>

          <!-- Title for person -->
          <label
            v-if="isPerson"
            class="add-org-header"
            :class="{'error-text': !addPersonOrgFormValid}"
          >
            <span v-if="isNaN(activeIndex)">Add Person</span>
            <span v-else>Edit Person</span>
          </label>
        </v-col>

        <v-col cols="12" sm="9">
          <v-card
            outlined class="message-box rounded-0"
            v-if="isCompletingParty && !isRoleStaff && isTypeCoop"
          >
            <p>
              <strong>Important:</strong> The Completing Party information below is based on your
              BC Registries account information. Your name cannot be changed here. Name changes must
              be made through your account settings.
            </p>
            <p>
              If you make changes to your address below, please update your address in the account
              settings after you have completed this filing to ensure your information is up to date.
            </p>
          </v-card>

          <v-form
            lazy-validation
            ref="addPersonOrgForm"
            class="appoint-form"
            :class="{ 'mt-8': isCompletingParty && !isRoleStaff && isTypeCoop}"
            v-model="addPersonOrgFormValid"
            v-on:submit.prevent
          >
            <!-- Person's Name -->
            <article v-if="isPerson">
              <div class="font-weight-bold">Person's Name</div>
              <div class="form__row three-column mt-4">
                <!-- NB: only staff can change Completing Party names -->
                <v-text-field
                  filled
                  class="item"
                  label="First Name"
                  id="person__first-name"
                  v-model.trim="orgPerson.officer.firstName"
                  :rules="enableRules ? Rules.FirstNameRules : []"
                  :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                />
                <v-text-field
                  filled
                  class="item"
                  label="Middle Name (Optional)"
                  id="person__middle-name"
                  v-model.trim="orgPerson.officer.middleName"
                  :rules="enableRules ? Rules.MiddleNameRules: []"
                  :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                />
                <v-text-field
                  filled
                  class="item"
                  label="Last Name"
                  id="person__last-name"
                  v-model.trim="orgPerson.officer.lastName"
                  :rules="enableRules ? Rules.LastNameRules : []"
                  :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                />
              </div>
            </article>

            <!-- Org's Name -->
            <article v-if="isOrg">
              <div class="font-weight-bold">Corporation or Firm Name</div>
              <div class="org-name-container mt-4">
                <v-text-field
                  filled
                  class="item"
                  label="Full Legal Corporation or Firm Name"
                  id="org-name"
                  v-model.trim="orgPerson.officer.organizationName"
                  :rules="enableRules ? Rules.OrgNameRules : []"
                />
              </div>
            </article>

            <!-- Roles -->
            <article class="mt-2">
              <div class="font-weight-bold">{{ getPeopleAndRolesResource.rolesTitle || 'Roles' }}</div>
              <div v-if="getPeopleAndRolesResource.rolesSubtitle">
                {{ getPeopleAndRolesResource.rolesSubtitle }}
              </div>
              <div class="form__row three-column mt-4">
                <v-card flat rounded="sm" class="item gray-card px-4">
                  <v-row class="align-center">
                    <v-col cols="4" v-if="showCompletingPartyRole">
                      <v-checkbox
                        id="cp-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :disabled="disableCompletingPartyRole"
                        @change="assignCompletingPartyRole()"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showIncorporatorRole">
                      <v-checkbox
                        id="incorporator-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.INCORPORATOR"
                        :label="RoleTypes.INCORPORATOR"
                        :disabled="disableIncorporatorRole"
                        :rules="enableRules ? roleRules: []"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showDirectorRole">
                      <v-checkbox
                        id="director-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.DIRECTOR"
                        :label="RoleTypes.DIRECTOR"
                        :disabled="disableDirectorRole"
                        :rules="enableRules ? roleRules : []"
                        @click="updateSameAsMailingChkBox()"
                      />
                    </v-col>

                    <!-- *** TODO: show conditionally, disable conditionally -->
                    <v-col cols="4" v-if="false">
                      <v-checkbox
                        id="heir-legal-rep-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.HEIR_LEGAL_REP"
                        :label="RoleTypes.HEIR_LEGAL_REP"
                        :disabled="false"
                        :rules="enableRules ? roleRules : []"
                      />
                    </v-col>

                    <v-col cols="4" v-if="false">
                      <v-checkbox
                        id="officer-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.OFFICER"
                        :label="RoleTypes.OFFICER"
                        :disabled="false"
                        :rules="enableRules ? roleRules : []"
                      />
                    </v-col>

                    <v-col cols="4" v-if="false">
                      <v-checkbox
                        id="shareholder-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.SHAREHOLDER"
                        :label="RoleTypes.SHAREHOLDER"
                        :disabled="false"
                        :rules="enableRules ? roleRules : []"
                      />
                    </v-col>

                    <v-col cols="4" v-if="false">
                      <v-checkbox
                        id="court-ordered-party-checkbox"
                        class="mt-5"
                        v-model="selectedRoles"
                        :value="RoleTypes.COURT_ORDERED_PARTY"
                        :label="RoleTypes.COURT_ORDERED_PARTY"
                        :disabled="false"
                        :rules="enableRules ? roleRules : []"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </article>

            <!-- *** TODO: add email addres here -->

            <!-- Mailing Address -->
            <article class="mt-8">
              <div class="font-weight-bold">Mailing Address</div>
              <MailingAddress
                ref="mailingAddressNew"
                class="mt-4"
                :editing="true"
                :schema="PersonAddressSchema"
                :address="inProgressMailingAddress"
                @update:address="updateMailingAddress($event)"
                @valid="updateMailingAddressValidity($event)"
              />
              <!-- dummy component to make form invalid if mailing address is invalid -->
              <v-input
                class="d-none"
                :rules="enableRules ? [() => mailingAddressValid] : []"
              />
            </article>

            <!-- Delivery Address (for directors only) -->
            <div v-if="isDirector">
              <v-checkbox
                class="inherit-checkbox"
                hide-details
                label="Delivery Address same as Mailing Address"
                v-model="inheritMailingAddress"
              />

              <article v-if="!inheritMailingAddress">
                <div class="font-weight-bold mt-4">Delivery Address</div>
                <DeliveryAddress
                  ref="deliveryAddressNew"
                  class="mt-4"
                  :editing="true"
                  :schema="PersonAddressSchema"
                  :address="inProgressDeliveryAddress"
                  :noPoBox="true"
                  @update:address="updateDeliveryAddress($event)"
                  @valid="updateDeliveryAddressValidity($event)"
                />
                <!-- dummy component to make form invalid if delivery address is invalid -->
                <v-input
                  class="d-none"
                  :rules="enableRules ? [() => inheritMailingAddress || deliveryAddressValid] : []"
                />
              </article>
            </div>

            <!-- Action Buttons -->
            <div class="form__btns mt-6">
              <v-btn
                id="btn-remove"
                large outlined color="error"
                class="btn-outlined-error"
                :disabled="isNaN(activeIndex)"
                @click="emitRemovePerson(activeIndex)">Remove</v-btn>
              <v-btn
                id="btn-done"
                large color="primary"
                class="ml-auto"
                @click="validateAddPersonOrgForm()">Done</v-btn>
              <v-btn
                id="btn-cancel"
                large outlined color="primary"
                @click="resetAddPersonData(true)">Cancel</v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import { AddEditOrgPersonMixin } from '@/mixins'
import { PeopleAndRolesResourceIF } from '@/interfaces'
import { Getter } from 'vuex-class'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  },
  mixins: [
    AddEditOrgPersonMixin
  ]
})
export default class AddEditOrgPerson extends Vue {
  @Getter isBaseCompany!: boolean
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  //
  // NB: see mixin for common properties, methods, etc.
  //
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

label {
  font-weight: bold;
  color: $gray9;
}

p {
  color: $gray7;
}

// Person's Name layout
.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;

  .item {
    flex: 1 1 auto;
    flex-basis: 0;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
  }
}

// Address Block Layout
.address {
  display: flex;
  width: 12rem;
  padding-left: 0.5rem;
  margin-right: 1.35rem;
}

.add-org-header {
  font-size: $px-16;
  font-weight: bold;
  line-height: 1.5rem;
}

.v-card.gray-card {
  background-color: rgba(0, 0, 0, 0.06);
}

.inherit-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-left: -3px;
}
</style>
