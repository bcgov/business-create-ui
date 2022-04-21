<template>
  <div id="reg-add-edit-org-person">
    <ConfirmDialog
      ref="reassignCPDialog"
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

          <v-form
            lazy-validation
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
                  class="item first-name"
                  label="First Name"
                  v-model.trim="orgPerson.officer.firstName"
                  :rules="enableRules ? Rules.FirstNameRules : []"
                  :readonly="isCompletingParty && !isRoleStaff"
                />
                <v-text-field
                  filled
                  class="item middle-name"
                  label="Middle Name (Optional)"
                  v-model.trim="orgPerson.officer.middleName"
                  :rules="enableRules ? Rules.MiddleNameRules : []"
                  :readonly="isCompletingParty && !isRoleStaff"
                />
                <v-text-field
                  filled
                  class="item last-name"
                  label="Last Name"
                  v-model.trim="orgPerson.officer.lastName"
                  :rules="enableRules ? Rules.LastNameRules : []"
                  :readonly="isCompletingParty && !isRoleStaff"
                />
              </div>
            </article>

            <!-- Business or Corporation -->
            <template v-if="isOrg">
              <!-- Business or Corporation Unregistered in B.C. -->
              <article v-if="isManualAdd" class="manual-add-article">
                <label>
                  {{ isNaN(activeIndex) ? 'Add' : ' Edit' }} Business or Corporation Unregistered in B.C.
                </label>
                <a class="lookup-toggle float-right" @click="isManualAdd = false">
                  Business or Corporation Look Up
                </a>

                <p class="mt-6 mb-0">
                  Use this form to add a company that is not legally required to register in B.C. such as
                  a bank or railway as {{ isProprietor ? 'the Proprietor' : 'a partner' }}. All other types
                  of businesses not registered in B.C. cannot be a proprietor or partner.
                </p>

                <HelpContactUs class="mt-6" />

                <!-- Confirm checkbox (org only) -->
                <v-checkbox
                  class="confirm-checkbox mt-8"
                  hide-details
                  v-model="orgPerson.confirmBusiness"
                  :rules="enableRules ? [(v) => !!v] : []"
                >
                  <template v-if="isProprietor" slot="label">
                    I confirm that the business proprietor being added is not legally required to
                    register in B.C.
                  </template>
                  <template v-if="isPartner" slot="label">
                    I confirm that the business partner being added is not legally required to
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

                <!-- Business Number (org proprietors only) -->
                <v-text-field
                  v-if="isProprietor"
                  filled
                  persistent-hint
                  class="item business-number mt-8 mb-n2"
                  label="Business Number (Optional)"
                  hint="First 9 digits of the CRA Business Number"
                  v-model.trim="orgPerson.officer.businessNumber"
                  v-mask="['#########']"
                  :rules="enableRules ? Rules.BusinessNumberRules : []"
                />

                <v-divider class="mt-8" />
              </article>

              <!-- Business or Corporation Look up -->
              <article v-else class="business-lookup-article">
                <label>Business or Corporation Look up</label>
                <a class="lookup-toggle float-right" @click="isManualAdd = true">
                  Business or Corporation is Unregistered in B.C.
                </a>

                <p class="mt-6 mb-0">
                  To add a registered B.C. business or corporation as
                  {{ isProprietor ? 'the Proprietor' : 'a partner' }}, enter the name or
                  incorporation number.
                </p>

                <p class="mt-6 mb-0">
                  If you are adding a company that is not legally required to register in B.C. such
                  as a bank or a railway, use the manual entry form. All other types of business
                  cannot be a proprietor or partner.
                </p>
              </article>
            </template>

            <!-- Roles -->
            <article class="mt-8">
              <label>Roles</label>
              <v-card flat rounded="sm" class="gray-card mt-4 px-4">
                <v-row class="align-center">
                  <v-col cols="4" v-if="showCompletingPartyRole" class="py-0">
                    <v-checkbox
                      class="mt-5"
                      v-model="selectedRoles"
                      :value="RoleTypes.COMPLETING_PARTY"
                      :label="RoleTypes.COMPLETING_PARTY"
                      :disabled="true"
                    />
                  </v-col>

                  <v-col cols="4" v-if="showProprietorRole" class="py-0">
                    <v-checkbox
                      class="mt-5"
                      v-model="selectedRoles"
                      :value="RoleTypes.PROPRIETOR"
                      :label="RoleTypes.PROPRIETOR"
                      :disabled="true"
                    />
                  </v-col>

                  <v-col cols="4" v-if="showPartnerRole" class="py-0">
                    <v-checkbox
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

            <!-- Business Number (for person proprietors only) -->
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
                class="item business-number mt-4 mb-n2"
                label="Business Number (Optional)"
                hint="First 9 digits of the CRA Business Number"
                v-model.trim="orgPerson.officer.businessNumber"
                v-mask="['#########']"
                :rules="enableRules ? Rules.BusinessNumberRules : []"
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
                class="item email-address mt-4 mb-n6"
                label="Email Address"
                v-model.trim="orgPerson.officer.email"
                :rules="enableRules ? Rules.EmailRules : []"
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
            <div v-if="isProprietor || isPartner" class="mt-8">
              <v-checkbox
                class="inherit-checkbox"
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
            <div class="form__btns mt-10">
              <v-btn
                large outlined color="error"
                class="btn-outlined-error btn-remove"
                :disabled="isNaN(activeIndex)"
                @click="emitRemovePerson(activeIndex)">Remove</v-btn>
              <v-btn
                large color="primary"
                class="ml-auto btn-done"
                @click="validateAddPersonOrgForm()">Done</v-btn>
              <v-btn
                large outlined color="primary"
                class="btn-cancel"
                @click="resetAddPersonData(true)">Cancel</v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import HelpBusinessNumber from '@/components/Registration/HelpBusinessNumber.vue'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import { AddEditOrgPersonMixin } from '@/mixins'
import { Rules } from '@/rules'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    HelpBusinessNumber,
    HelpContactUs
  },
  directives: { mask }
})
export default class RegAddEditOrgPerson extends Mixins(AddEditOrgPersonMixin) {
  //
  // NB: see mixin for common properties, methods, etc.
  //

  // local property
  protected isManualAdd = true

  /** The validation rules for the Organization Name. */
  readonly OrgNameRules: Array<Function> = [
    v => !!v?.trim() || 'Business or corporation name is required',
    v => (v?.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
  ]

  // Rules for template
  readonly Rules = Rules
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
::v-deep .v-input--checkbox .v-input__slot {
  align-items: flex-start;

  .v-input--selection-controls__input {
    margin-top: -2px;
  }
}
</style>
