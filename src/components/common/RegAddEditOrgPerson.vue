<template>
  <div id="reg-add-edit-org-person">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#reg-add-edit-org-person"
    />

    <section class="px-6 py-10" :class="{ 'invalid-section': !addPersonOrgFormValid }">
      <v-row no-gutters>
        <v-col cols="12" sm="3" class="pr-4 d-none d-sm-block">
          <!-- Title for org -->
          <label
            v-if="isOrg"
            class="add-org-header"
            :class="{'error-text': !addPersonOrgFormValid}"
          >
            <span v-if="isNaN(activeIndex)">Add Business or Corporation</span>
            <span v-else>Edit Business or Corporation</span>
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
            v-if="isCompletingParty && !isRoleStaff"
          >
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

          <div v-if="isCompletingParty && !isRoleStaff" class="mt-8" />

          <v-form
            lazy-validation
            ref="addPersonOrgForm"
            class="appoint-form"
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
                  class="item first-name"
                  label="First Name"
                  v-model.trim="orgPerson.officer.firstName"
                  :rules="enableRules ? Rules.FirstNameRulesFirms : []"
                  :readonly="isCompletingParty && !(isRoleStaff || isSbcStaff)"
                />
                <v-text-field
                  filled
                  class="item middle-name"
                  label="Middle Name (Optional)"
                  v-model.trim="orgPerson.officer.middleName"
                  :rules="enableRules ? Rules.MiddleNameRulesFirms : []"
                  :readonly="isCompletingParty && !(isRoleStaff || isSbcStaff)"
                />
                <v-text-field
                  filled
                  class="item last-name"
                  label="Last Name"
                  v-model.trim="orgPerson.officer.lastName"
                  :rules="enableRules ? Rules.LastNameRules : []"
                  :readonly="isCompletingParty && !(isRoleStaff || isSbcStaff)"
                />
              </div>
            </article>

            <!-- Business or Corporation -->
            <template v-if="isOrg">
              <!-- Business or Corporation Unregistered in B.C. -->
              <article v-if="!orgPerson.isLookupBusiness" class="manual-add-article">
                <label>
                  {{ isNaN(activeIndex) ? 'Add' : ' Edit' }} Business or Corporation Not Registered in B.C.
                </label>
                <a class="lookup-toggle float-right" @click="swapIsLookupBusiness()">
                  Business or Corporation Registered in B.C.
                </a>

                <p class="mt-6 mb-0">
                  <template v-if="isProprietor">
                    You may add a company that is not legally required to register in B.C. such as a bank
                    or railway as the Proprietor. All other types of businesses not registered in B.C.
                    cannot be the Proprietor.
                  </template>
                  <template v-else-if="isPartner">
                    You may add a company that is not legally required to register in B.C. such as a bank
                    or railway as a partner. All other types of businesses not registered in B.C. cannot be
                    a partner.
                  </template>
                  <template v-else>
                    You may add a company that is not legally required to register in B.C. such as a bank
                    or railway.
                  </template>
                </p>

                <HelpContactUs class="mt-6" />

                <!-- Confirm checkbox (org only) -->
                <v-checkbox
                  class="confirm-checkbox mt-8"
                  hide-details
                  v-model="orgPerson.confirmBusiness"
                  :rules="enableRules ? [(v) => !!v] : []"
                >
                  <template v-if="isProprietor" v-slot:label>
                    I confirm that the business proprietor being added is not legally required to register
                    in B.C.
                  </template>
                  <template v-else-if="isPartner" v-slot:label>
                    I confirm that the business partner being added is not legally required to register in
                    B.C.
                  </template>
                  <template v-else v-slot:label>
                    I confirm that the business or corporation being added is not legally required to
                    register in B.C.
                  </template>
                </v-checkbox>

                <!-- Organization Name (org only) -->
                <v-text-field
                  filled
                  class="mt-8 mb-n6 org-name"
                  label="Business or Corporation Name"
                  v-model.trim="orgPerson.officer.organizationName"
                  :rules="enableRules ? OrgNameRules : []"
                />

                <!-- Business Number (readonly) -->
                <article class="mt-8" v-if="isProprietor">
                  <label>Business Number:</label> {{getRegistration.businessNumber || '(Not entered)'}}
                </article>

                <v-divider class="mt-8" />
              </article>

              <!-- Business or Corporation Look up -->
              <article v-else class="business-lookup-article">
                <label>Business or Corporation Registered in B.C.</label>
                <a class="lookup-toggle float-right" @click="swapIsLookupBusiness()">
                  Business or Corporation Not Registered in B.C.
                </a>
                <div class="mt-6" v-if="hasBusinessSelectedFromLookup">
                  <v-card outlined class="message-box rounded-0">
                    <p>
                      <strong>Important:</strong> If the addresses shown below are out of date, you
                      may update them here. The updates are applicable only to this registration.
                    </p>
                  </v-card>
                </div>
                <div v-else-if="isProprietor">
                  <p class="mt-6 mb-0">
                    To add a registered B.C. business or corporation as the Proprietor, enter the name
                    or incorporation number.
                  </p>
                  <p class="mt-6 mb-0">
                    If you are adding a company that is not legally required to register in B.C. such as
                    a bank or a railway, use the manual entry form. All other types of business cannot
                    be the Proprietor.
                  </p>
                </div>
                <div v-else-if="isPartner">
                  <p class="mt-6 mb-0">
                    To add a registered B.C. business or corporation as a partner, enter the name or
                    incorporation number.
                  </p>
                  <p class="mt-6 mb-0">
                    If you are adding a company that is not legally required to register in B.C. such as
                    a bank or a railway, use the manual entry form. All other types of business cannot
                    be a partner.
                  </p>
                  <HelpContactUs class="mt-6" />
                </div>
                <div v-else>
                  <p class="mt-6 mb-0">
                    To add a registered B.C. business or corporation, enter the name or incorporation
                    number.
                  </p>
                  <p class="mt-6 mb-0">
                    If you are adding a company that is not legally required to register in B.C. such as
                    a bank or a railway, use the manual entry form.
                  </p>
                </div>

                <BusinessLookup
                  :showErrors="enableRules"
                  :businessLookup="inProgressBusinessLookup"
                  :BusinessLookupServices="BusinessLookupServices"
                  @setBusiness="updateBusinessDetails($event)"
                  @undoBusiness="resetBusinessDetails($event)"
                />
              </article>
            </template>

            <!-- Roles -->
            <article class="mt-8" v-if="showRoles">
              <label>Roles</label>
              <div class="form__row three-column mt-4">
                <v-card flat rounded="sm" class="item gray-card px-4">
                  <v-row no-gutters class="align-center mt-5">
                    <v-col cols="4" v-if="showCompletingPartyRole">
                      <v-checkbox
                        id="cp-checkbox"
                        class="mt-0"
                        v-model="selectedRoles"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :disabled="isTypeSoleProp || isTypePartnership"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showProprietorRole">
                      <v-checkbox
                        id="proprietor-checkbox"
                        class="mt-0"
                        v-model="selectedRoles"
                        :value="RoleTypes.PROPRIETOR"
                        :label="RoleTypes.PROPRIETOR"
                        :disabled="isTypeSoleProp || isTypePartnership"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showPartnerRole">
                      <v-checkbox
                        id="partner-checkbox"
                        class="mt-0"
                        v-model="selectedRoles"
                        :value="RoleTypes.PARTNER"
                        :label="RoleTypes.PARTNER"
                        :disabled="isTypeSoleProp || isTypePartnership"
                      />
                    </v-col>

                    <v-col cols="4" v-if="showDirectorRole">
                      <v-checkbox
                        id="director-checkbox"
                        class="mt-0"
                        v-model="selectedRoles"
                        :value="RoleTypes.DIRECTOR"
                        :label="RoleTypes.DIRECTOR"
                        :rules="enableRules ? roleRules : []"
                        @click="updateSameAsMailingChkBox()"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </article>

            <!-- Email Address -->
            <article class="mt-8">
              <label>Email Address</label>
              <p class="mt-4 mb-0">
                Copies of the registration documents will be sent to this email address.
              </p>
              <v-text-field
                filled
                class="item email-address mt-4 mb-n6"
                label="Email Address"
                v-model.trim="orgPerson.officer.email"
                :rules="enableRules ? Rules.EmailRules : []"
                :readonly="isCompletingParty && !(isRoleStaff || isSbcStaff)"
              />
            </article>

            <!-- Mailing Address -->
            <article class="mt-8">
              <label>Mailing Address</label>
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

            <!-- Delivery Address (for proprietors and partners only) -->
            <div v-if="isProprietor || isPartner">
              <v-checkbox
                class="inherit-checkbox"
                hide-details
                label="Delivery Address same as Mailing Address"
                v-model="inheritMailingAddress"
              />

              <article v-if="!inheritMailingAddress" class="mt-6">
                <label>Delivery Address</label>
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
import { mask } from 'vue-the-mask'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import { BusinessLookup } from '@bcrs-shared-components/business-lookup'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import { AddEditOrgPersonMixin } from '@/mixins'
import { BusinessLookupServices } from '@/services'
import { VuetifyRuleFunction } from '@/types'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    BusinessLookup,
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    HelpContactUs
  },
  directives: {
    mask
  },
  mixins: [
    AddEditOrgPersonMixin
  ]
})
export default class RegAddEditOrgPerson extends Vue {
  //
  // NB: see mixin for common properties, methods, etc.
  //

  /** The validation rules for the Organization Name. */
  readonly OrgNameRules: Array<VuetifyRuleFunction> = [
    v => !!v?.trim() || 'Business or corporation name is required',
    v => (v?.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
  ]

  readonly BusinessLookupServices = BusinessLookupServices
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.lookup-toggle {
  font-size: $px-14;
  text-decoration: underline;
  // pointer-events: none;
  // opacity: 0.4;
}

label {
  font-weight: bold;
  color: $gray9;
}

label.add-org-header {
  font-size: $px-16;
  line-height: 1.5rem;
}

p {
  color: $gray7;
}

// Person's Name layout
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

.v-card.gray-card {
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
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;

  .v-input--selection-controls__input {
    margin-top: -2px;
  }
}
</style>
