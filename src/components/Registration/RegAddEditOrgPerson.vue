<template>
  <div id="reg-add-edit-org-person">
    <ConfirmDialog
      ref="reassignCPDialog"
      attach="#reg-add-edit-org-person"
    />

    <v-expand-transition>
      <ul class="add-person pa-0">
        <li class="add-person-container px-6 py-10">
          <div class="meta-container">

            <!-- FUTURE: move header text to resource file so this component is generic -->
            <!-- Title for org -->
            <label class="add-org-header" v-if="isOrg">
              <span v-if="activeIndex === -1">Add Business or Corporation</span>
              <span v-else>Edit Business or Corporation</span>
            </label>

            <!-- Title for person -->
            <label class="add-org-header" v-if="isPerson">
              <span v-if="activeIndex === -1">Add Person</span>
              <span v-else>Edit Person</span>
            </label>

            <!-- The form -->
            <div class="meta-container__inner">
              <v-card outlined class="message-box" v-if="isCompletingParty && !isRoleStaff">
                <p>
                  <strong>Important:</strong> The Completing Party information below is based on your
                  BC Registries account information. Your name and email cannot be changed here. Name
                  and email changes must be made through your account settings.
                </p>
                <p>
                  If you make changes to your address below, please update your address in the account
                  settings after you have completed this filing to ensure your information is up to date.
                </p>
              </v-card>

              <v-form
                ref="addPersonOrgForm"
                class="appoint-form"
                :class="{ 'mt-8': isCompletingParty && !isRoleStaff}"
                v-model="addPersonOrgFormValid"
                v-on:submit.prevent
              >
                <!-- Person's Name -->
                <article v-if="isPerson">
                  <label>Person's Name</label>
                  <div class="three-column mt-4 mb-n6">
                    <!-- NB: only staff can change Completing Party names -->
                    <v-text-field
                      filled
                      class="item"
                      label="First Name"
                      id="person__first-name"
                      v-model.trim="orgPerson.officer.firstName"
                      :rules="Rules.FirstNameRules"
                      :readonly="isCompletingParty && !isRoleStaff"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Middle Name"
                      id="person__middle-name"
                      v-model.trim="orgPerson.officer.middleName"
                      :rules="Rules.MiddleNameRules"
                      :readonly="isCompletingParty && !isRoleStaff"
                    />
                    <v-text-field
                      filled
                      class="item"
                      label="Last Name"
                      id="person__last-name"
                      v-model.trim="orgPerson.officer.lastName"
                      :rules="Rules.LastNameRules"
                      :readonly="isCompletingParty && !isRoleStaff"
                    />
                  </div>
                </article>

                <!-- Org's Name -->
                <article v-if="isOrg && isManualAdd">
                  <label>Add Business or Corporation Manually</label>
                  <a class="lookup-toggle float-right">Business or Corporation Look Up</a>

                  <p class="mt-6 mb-0">
                    Use this manual entry form to add a company that is not legally required to register
                    in B.C. such as a bank or railway as a partner. All other types of businesses not
                    registered in B.C. cannot be a proprietor or partner.
                  </p>

                  <HelpContactUs class="mt-6" />

                  <!-- Confirm checkbox -->
                  <v-checkbox
                    class="confirm-checkbox mt-8"
                    hide-details
                    v-model="confirmCheckbox"
                    :rules="[(v) => !!v]"
                  >
                    <template slot="label">
                      I confirm that the business proprietor being added is not legally required to
                      register in B.C.
                    </template>
                  </v-checkbox>

                  <!-- Organization Name -->
                  <v-text-field
                    filled
                    class="mt-8 mb-n6"
                    label="Business or Corporation Name"
                    id="firm-name"
                    v-model.trim="orgPerson.officer.organizationName"
                    :rules="OrgNameRules"
                  />

                  <!-- Business Number -->
                  <v-text-field
                    filled
                    persistent-hint
                    class="item mt-8 mb-n2"
                    label="Business Number (Optional)"
                    id="person__business-number"
                    hint="First 9 digits of the CRA Business Number"
                    v-model.trim="orgPerson.officer.businessNumber"
                    :rules="BusinessNumberRules"
                  />

                  <v-divider class="mt-8" />
                </article>

                <!-- Roles -->
                <article class="mt-8">
                  <label>Roles</label>
                  <v-card flat rounded="sm" class="gray-card mt-4 px-4">
                    <v-row class="align-center">
                      <v-col cols="4" v-if="showCompletingPartyRole">
                        <v-checkbox
                          id="cp-checkbox"
                          class="mt-5"
                          v-model="selectedRoles"
                          :value="RoleTypes.COMPLETING_PARTY"
                          :label="RoleTypes.COMPLETING_PARTY"
                          :disabled="true"
                        />
                      </v-col>

                      <v-col cols="4" v-if="showProprietorRole">
                        <v-checkbox
                          id="proprietor-checkbox"
                          class="mt-5"
                          v-model="selectedRoles"
                          :value="RoleTypes.PROPRIETOR"
                          :label="RoleTypes.PROPRIETOR"
                          :disabled="true"
                        />
                      </v-col>

                      <!-- FUTURE (for GP) -->
                      <v-col cols="4" v-if="showPartnerRole">
                        <v-checkbox
                          id="partner-checkbox"
                          class="mt-5"
                          v-model="selectedRoles"
                          :value="RoleTypes.PARTNER"
                          :label="RoleTypes.PARTNER"
                          :disabled="true"
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </article>

                <!-- Business Number (for proprietors only) -->
                <article v-if="isPerson && isProprietor" class="mt-8">
                  <label>Business Number</label>
                  <p class="mt-4 mb-0">
                    If you have an existing business number, enter it below and we will contact
                    Canada Revenue Agency and ask them to link it to this registration.
                  </p>
                  <HelpBusinessNumber class="mt-4" />
                  <v-text-field
                    filled
                    persistent-hint
                    class="item mt-4 mb-n2"
                    label="Business Number (Optional)"
                    id="person__business-number"
                    hint="First 9 digits of the CRA Business Number"
                    v-model.trim="orgPerson.officer.businessNumber"
                    :rules="BusinessNumberRules"
                  />
                </article>

                <!-- Email Address -->
                <article class="mt-8">
                  <label>Email Address</label>
                  <p class="mt-4 mb-0">
                    Copies of the registration documents will be sent to this email address.
                  </p>
                  <v-text-field
                    filled
                    class="item mt-4 mb-n6"
                    label="Email Address"
                    id="person__email-address"
                    v-model.trim="orgPerson.officer.email"
                    :rules="Rules.EmailRules"
                    :readonly="isCompletingParty && !isRoleStaff"
                  />
                </article>

                <!-- Mailing Address -->
                <article class="mt-8">
                  <label>Mailing Address</label>
                  <MailingAddress
                    ref="mailingAddressNew"
                    class="mt-4 mb-n6"
                    :editing="true"
                    :schema="PersonAddressSchema"
                    :address="inProgressMailingAddress"
                    @update:address="updateMailingAddress"
                    @valid="updateMailingAddressValidity"
                  />
                </article>

                <!-- Delivery Address (for all roles) -->
                <v-checkbox
                  class="inherit-checkbox mt-8"
                  hide-details
                  label="Delivery Address same as Mailing Address"
                  v-model="inheritMailingAddress"
                />

                <article v-if="!inheritMailingAddress" class="mt-8">
                  <label>Delivery Address</label>
                  <DeliveryAddress
                    ref="deliveryAddressNew"
                    class="mt-4 mb-n6"
                    :editing="true"
                    :schema="PersonAddressSchema"
                    :address="inProgressDeliveryAddress"
                    :noPoBox="true"
                    @update:address="updateDeliveryAddress"
                    @valid="updateDeliveryAddressValidity"
                  />
                </article>

                <!-- Action Buttons -->
                <div class="form__btns mt-10">
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
import HelpBusinessNumber from '@/components/Registration/HelpBusinessNumber.vue'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import { AddEditOrgPersonMixin } from '@/mixins'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    HelpBusinessNumber,
    HelpContactUs
  }
})
export default class RegAddEditOrgPerson extends Mixins(AddEditOrgPersonMixin) {
  //
  // NB: see mixin for common methods, getters, etc.
  //

  // local properties
  protected isManualAdd = true
  protected confirmCheckbox = false

  /** The validation rules for the Organization Name. */
  readonly OrgNameRules: Array<Function> = [
    v => !!v?.trim() || 'Business or corporation name is required',
    v => (v?.length <= 155) || 'Cannot exceed 155 characters' // maximum character count
  ]

  /** The validation rules for the Business Number. */
  readonly BusinessNumberRules: Array<Function> = [
    (v: string) => {
      const pattern = /^[0-9]{9}$/
      return (!v || pattern.test(v)) || 'Invalid business number'
    }
  ]
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.lookup-toggle {
  font-size: $px-14;
  text-decoration: underline;
  pointer-events: none;
  opacity: 0.4;
}

.row > .col {
  padding-top: 0;
  padding-bottom: 0;
}

label {
  font-weight: bold;
  color: $gray9;
}

li {
  list-style: none;
  padding-top: 0.25rem;
}

p {
  color: $gray7;
}

div.three-column {
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

.confirm-checkbox,
.inherit-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-left: -3px;
  color: $gray7;
}

// align checkbox with top of its label
::v-deep .v-input--checkbox .v-input__slot {
  align-items: flex-start;

  .v-input--selection-controls__input {
    margin-top: -2px;
  }
}
</style>
