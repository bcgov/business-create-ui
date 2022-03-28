<template>
  <div id="add-edit-org-person">
    <ConfirmDialog
      ref="reassignCPDialog"
      attach="#add-edit-org-person"
    />

    <v-expand-transition>
      <ul class="add-person pa-0">
        <li class="add-person-container px-6 py-10">
          <div class="meta-container">

            <!-- FUTURE: move header text to resource file so this component is generic -->
            <label class="add-org-header" v-if="isOrg && isTypeBcomp">
              <span v-if="activeIndex === -1">Add Corporation or Firm</span>
              <span v-else>Edit Corporation or Firm</span>
            </label>

            <label class="add-org-header" v-if="isOrg && isTypeCoop">
              <span v-if="activeIndex === -1">Add Organization</span>
              <span v-else>Edit Organization</span>
            </label>

            <label class="add-org-header" v-if="isPerson">
              <span v-if="activeIndex === -1">Add Person</span>
              <span v-else>Edit Person</span>
            </label>

            <div class="meta-container__inner">
              <v-card outlined class="message-box" v-if="isCompletingParty && !isRoleStaff && isTypeCoop">
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
                ref="addPersonOrgForm"
                class="appoint-form"
                :class="{ 'mt-8': isCompletingParty && !isRoleStaff && isTypeCoop}"
                v-model="addPersonOrgFormValid"
                v-on:submit.prevent
              >
                <!-- Person's Name -->
                <template v-if="isPerson">
                  <div class="font-weight-bold">Person's Name</div>
                  <div class="form__row three-column mt-4">
                    <!-- NB: only staff can change Completing Party names -->
                    <v-text-field
                      filled
                      class="item"
                      label="First Name"
                      id="person__first-name"
                      v-model.trim="orgPerson.officer.firstName"
                      :rules="Rules.FirstNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Middle Name"
                      id="person__middle-name"
                      v-model.trim="orgPerson.officer.middleName"
                      :rules="Rules.MiddleNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Last Name"
                      id="person__last-name"
                      v-model.trim="orgPerson.officer.lastName"
                      :rules="Rules.LastNameRules"
                      :readonly="isCompletingParty && !isRoleStaff && isTypeCoop"
                    />
                  </div>
                </template>

                <!-- Org's Name -->
                <template v-if="isOrg">
                  <div class="font-weight-bold">Corporation or Firm Name</div>
                  <div class="org-name-container mt-4">
                    <v-text-field
                      filled
                      class="item"
                      label="Full Legal Corporation or Firm Name"
                      id="firm-name"
                      v-model.trim="orgPerson.officer.organizationName"
                      :rules="Rules.OrgNameRules"
                    />
                  </div>
                </template>

                <!-- Roles -->
                <div class="font-weight-bold mt-2">Roles</div>
                <v-card flat rounded="sm" class="gray-card mt-4 px-4">
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
                        :rules="roleRules"
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
                        :rules="roleRules"
                        @click="updateSameAsMailingChkBox()"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Mailing Address -->
                <div class="font-weight-bold mt-8">Mailing Address</div>
                <MailingAddress
                  ref="mailingAddressNew"
                  class="mt-6"
                  :editing="true"
                  :schema="PersonAddressSchema"
                  :address="inProgressMailingAddress"
                  @update:address="updateMailingAddress"
                  @valid="updateMailingAddressValidity"
                />

                <!-- Delivery Address (for directors only) -->
                <div class="form__row" v-if="isDirector">
                  <v-checkbox
                    class="inherit-checkbox"
                    hide-details
                    label="Delivery Address same as Mailing Address"
                    v-model="inheritMailingAddress"
                  />

                  <template v-if="!inheritMailingAddress">
                    <div class="font-weight-bold mt-4">Delivery Address</div>
                    <DeliveryAddress
                      ref="deliveryAddressNew"
                      class="mt-6"
                      :editing="true"
                      :schema="PersonAddressSchema"
                      :address="inProgressDeliveryAddress"
                      :noPoBox="true"
                      @update:address="updateDeliveryAddress"
                      @valid="updateDeliveryAddressValidity"
                    />
                  </template>
                </div>

                <!-- Action Buttons -->
                <div class="form__row form__btns mt-6">
                  <v-btn
                    id="btn-remove"
                    large outlined color="error"
                    class="btn-outlined-error"
                    :disabled="activeIndex === -1"
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
            </div>
          </div>

        </li>
      </ul>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import { AddEditOrgPersonMixin } from '@/mixins'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class AddEditOrgPerson extends Mixins(AddEditOrgPersonMixin) {
  //
  // NB: see mixin for common methods, getters, etc.
  //
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

[class^="col"] {
  padding-top: 0;
  padding-bottom: 0;
}

li {
  list-style: none;
  padding-top: 0.25rem;
}

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

.same-address {
  width: 11.65rem;
}

.address__row {
  flex: 1 1 auto;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  &__inner {
    flex: 1 1 auto;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;

    .v-btn {
      min-width: 4rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.add-org-header {
  font-size: $px-16;
  font-weight: bold;
  line-height: 1.5rem;
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 10rem;
    }
  }
}

.gray-card {
  background-color: rgba(0, 0, 0, 0.06);
}

.inherit-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-left: -3px;
}
</style>
