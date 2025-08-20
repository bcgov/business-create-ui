<template>
  <div id="reg-add-edit-org-person">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#reg-add-edit-org-person"
    />

    <section
      class="px-6 py-10"
      :class="{ 'invalid-section': !addPersonOrgFormValid }"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4 d-none d-sm-block"
        >
          <!-- Title for org -->
          <label
            v-if="isOrg"
            class="add-org-header"
            :class="{'error-text': !addPersonOrgFormValid}"
          >
            <div v-if="IsAuthorized(AuthorizedActions.FIRM_ADD_BUSINESS)">
              <span v-if="isNaN(activeIndex)">Add Business or Corporation</span>
              <span v-else>Edit Business or Corporation</span>
            </div>

            <div v-else>
              <template v-if="isNaN(activeIndex)">
                <template v-if="isEntityPartnership">
                  Add a Business as a Partner
                </template>
                <template v-else>
                  Add a Business as the Proprietor
                </template>
              </template>

              <template v-else>
                <template v-if="isEntityPartnership">
                  Edit a Business as a Partner
                </template>
                <template v-else>
                  Edit a Business as the Proprietor
                </template>
              </template>
            </div>
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

        <v-col
          cols="12"
          sm="9"
        >
          <MessageBox
            v-if="isCompletingParty && !IsAuthorized(AuthorizedActions.NO_COMPLETING_PARTY_MESSAGE_BOX)"
            color="gold"
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
          </MessageBox>

          <div
            v-if="isCompletingParty && !IsAuthorized(AuthorizedActions.NO_COMPLETING_PARTY_MESSAGE_BOX)"
            class="mt-8"
          />

          <v-form
            ref="addPersonOrgForm"
            v-model="addPersonOrgFormValid"
            lazy-validation
            class="appoint-form"
            @submit.prevent
          >
            <!-- Person's Name -->
            <article v-if="isPerson">
              <label>Person's Name</label>
              <div class="three-column mt-4 mb-n6">
                <!-- NB: need authorization to change Completing Party names -->
                <v-text-field
                  v-model.trim="orgPerson.officer.firstName"
                  filled
                  class="item first-name"
                  label="First Name"
                  :rules="enableRules ?
                    (isCompletingParty ? Rules.FirstNameRulesFirmsCP :
                      Rules.FirstNameRulesFirms) : []"
                  :readonly="isCompletingParty && !IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)"
                />
                <v-text-field
                  v-model.trim="orgPerson.officer.middleName"
                  filled
                  class="item middle-name"
                  label="Middle Name (Optional)"
                  :rules="enableRules ? Rules.MiddleNameRulesFirms : []"
                  :readonly="isCompletingParty && !IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)"
                />
                <v-text-field
                  v-model.trim="orgPerson.officer.lastName"
                  filled
                  class="item last-name"
                  label="Last Name"
                  :rules="enableRules ? Rules.LastNameRules : []"
                  :readonly="isCompletingParty && !IsAuthorized(AuthorizedActions.EDITABLE_COMPLETING_PARTY)"
                />
              </div>
            </article>

            <!-- Business or Corporation -->
            <template v-if="isOrg">
              <!-- Business or Corporation Unregistered in B.C. (if authorized) -->
              <article
                v-if="!orgPerson.isLookupBusiness && IsAuthorized(AuthorizedActions.FIRM_ADD_BUSINESS)"
                class="manual-add-article"
              >
                <label>
                  {{ isNaN(activeIndex) ? 'Add' : ' Edit' }} Business or Corporation Not Registered in B.C.
                </label>
                <a
                  class="lookup-toggle float-right"
                  @click="swapIsLookupBusiness()"
                >
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

                <HelpContactUs class="help" />

                <!-- Confirm checkbox (org only) -->
                <v-checkbox
                  v-model="orgPerson.confirmBusiness"
                  class="confirm-checkbox mt-8"
                  hide-details
                  :rules="enableRules ? [(v) => !!v] : []"
                >
                  <template
                    v-if="isProprietor"
                    #label
                  >
                    I confirm that the business proprietor being added is not legally required to register
                    in B.C.
                  </template>
                  <template
                    v-else-if="isPartner"
                    #label
                  >
                    I confirm that the business partner being added is not legally required to register in
                    B.C.
                  </template>
                  <template
                    v-else
                    #label
                  >
                    I confirm that the business or corporation being added is not legally required to
                    register in B.C.
                  </template>
                </v-checkbox>

                <!-- Organization Name (org only) -->
                <v-text-field
                  v-model.trim="orgPerson.officer.organizationName"
                  filled
                  class="mt-8 mb-n6 org-name"
                  label="Business or Corporation Name"
                  :rules="enableRules ? OrgNameRules : []"
                />

                <!-- Business Number (readonly) -->
                <article
                  v-if="isProprietor"
                  class="mt-8"
                >
                  <label>Business Number:</label> {{ getRegistration.businessNumber || '(Not entered)' }}
                </article>

                <v-divider class="mt-8" />
              </article>

              <!-- Business or Corporation Look up (if authorized)-->
              <article
                v-else-if="IsAuthorized(AuthorizedActions.FIRM_ADD_BUSINESS)"
                class="business-lookup-article"
              >
                <label>Business or Corporation Registered in B.C.</label>
                <a
                  class="lookup-toggle float-right"
                  @click="swapIsLookupBusiness()"
                >
                  Business or Corporation Not Registered in B.C.
                </a>
                <div
                  v-if="hasBusinessSelectedFromLookup"
                  class="mt-6"
                >
                  <MessageBox color="gold">
                    <p>
                      <strong>Important:</strong> If the addresses shown below are out of date, you
                      may update them here. The updates are applicable only to this application.
                    </p>
                  </MessageBox>
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
                  <HelpContactUs class="help" />
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
                  class="mt-5"
                  :showErrors="enableRules"
                  :businessLookup="inProgressBusinessLookup"
                  :BusinessLookupServices="RegistriesSearchServices"
                  @setBusiness="updateBusinessDetails($event)"
                  @undoBusiness="resetBusinessDetails()"
                />
              </article>

              <!-- Business or Corporation Look up (if not authorized above)-->
              <article
                v-else
                class="business-lookup-article"
              >
                <div
                  v-if="hasBusinessSelectedFromLookup"
                  class="mt-6"
                >
                  <MessageBox color="gold">
                    <p>
                      <strong>Important:</strong> If the addresses shown below are out of date, you
                      may update them here. The updates are applicable only to this application.
                    </p>
                  </MessageBox>
                </div>
                <div v-if="isProprietor">
                  <p class="mb-0">
                    Enter an existing B.C. business as the proprietor.
                  </p>
                </div>
                <div v-else>
                  <p class="mb-0">
                    Enter an existing B.C. business as a partner.
                  </p>
                </div>

                <HelpContactUs class="help" />

                <BusinessLookup
                  class="mt-5"
                  :showErrors="enableRules"
                  :businessLookup="inProgressBusinessLookup"
                  :BusinessLookupServices="RegistriesSearchServices"
                  label="Business Name or Incorporation/Registration Number"
                  @setBusiness="updateBusinessDetails($event)"
                  @undoBusiness="resetBusinessDetails()"
                />
              </article>
            </template>

            <!-- Roles -->
            <article
              v-if="showRoles"
              class="mt-8"
            >
              <label>Roles</label>
              <div class="form__row three-column mt-4">
                <v-card
                  flat
                  rounded="sm"
                  class="item gray-card px-4"
                >
                  <v-row
                    no-gutters
                    class="align-center mt-5"
                  >
                    <v-col
                      v-if="showCompletingPartyRole"
                      cols="4"
                    >
                      <v-checkbox
                        id="cp-checkbox"
                        v-model="selectedRoles"
                        class="mt-0"
                        :value="RoleTypes.COMPLETING_PARTY"
                        :label="RoleTypes.COMPLETING_PARTY"
                        :disabled="isEntitySoleProp || isEntityPartnership"
                      />
                    </v-col>

                    <v-col
                      v-if="showProprietorRole"
                      cols="4"
                    >
                      <v-checkbox
                        id="proprietor-checkbox"
                        v-model="selectedRoles"
                        class="mt-0"
                        :value="RoleTypes.PROPRIETOR"
                        :label="RoleTypes.PROPRIETOR"
                        :disabled="isEntitySoleProp || isEntityPartnership"
                      />
                    </v-col>

                    <v-col
                      v-if="showPartnerRole"
                      cols="4"
                    >
                      <v-checkbox
                        id="partner-checkbox"
                        v-model="selectedRoles"
                        class="mt-0"
                        :value="RoleTypes.PARTNER"
                        :label="RoleTypes.PARTNER"
                        :disabled="isEntitySoleProp || isEntityPartnership"
                      />
                    </v-col>

                    <v-col
                      v-if="showDirectorRole"
                      cols="4"
                    >
                      <v-checkbox
                        id="director-checkbox"
                        v-model="selectedRoles"
                        class="mt-0"
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
                Copies of the {{ docType }} documents will be sent to this email address.
              </p>
              <!-- NB: need authorization to change email address -->
              <v-text-field
                v-model.trim="orgPerson.officer.email"
                filled
                class="item email-address mt-4 mb-n6"
                label="Email Address"
                :rules="enableRules ? Rules.EmailRules : []"
                :readonly="isCompletingParty && !IsAuthorized(AuthorizedActions.FIRM_EDITABLE_EMAIL_ADDRESS)"
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
                v-model="inheritMailingAddress"
                class="inherit-checkbox"
                hide-details
                label="Delivery Address same as Mailing Address"
              />

              <article
                v-if="!inheritMailingAddress"
                class="mt-6"
              >
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
                large
                outlined
                color="error"
                class="btn-outlined-error"
                :disabled="isNaN(activeIndex)"
                @click="emitRemovePerson(activeIndex)"
              >
                Remove
              </v-btn>
              <v-btn
                id="btn-done"
                large
                color="primary"
                class="ml-auto"
                @click="validateAddPersonOrgForm()"
              >
                Done
              </v-btn>
              <v-btn
                id="btn-cancel"
                large
                outlined
                color="primary"
                @click="resetAddPersonData(true)"
              >
                Cancel
              </v-btn>
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
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import { BusinessLookup } from '@bcrs-shared-components/business-lookup'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import { FilingTypes } from '@/enums'
import { AddEditOrgPersonMixin } from '@/mixins'
import { RegistriesSearchServices } from '@/services'
import { VuetifyRuleFunction } from '@/types'
import MessageBox from '@/components/common/MessageBox.vue'

/** This is a sub-component of PeopleAndRoles. */
@Component({
  components: {
    BusinessLookup,
    ConfirmDialog,
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    HelpContactUs,
    MessageBox
  },
  directives: {
    mask
  }
})
export default class RegAddEditOrgPerson extends Mixins(AddEditOrgPersonMixin) {
  //
  // NB: see mixin for common properties, methods, etc.
  //

  /** The validation rules for the Organization Name. */
  readonly OrgNameRules: Array<VuetifyRuleFunction> = [
    v => !!v?.trim() || 'Business or corporation name is required',
    v => (v?.length <= 150) || 'Cannot exceed 150 characters' // maximum character count
  ]

  readonly RegistriesSearchServices = RegistriesSearchServices

  @Getter(useStore) getFilingType!: FilingTypes

  get docType (): string {
    return this.getFilingType === FilingTypes.RESTORATION ? 'restoration' : 'registration'
  }
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

.help {
  margin-top: 30px;
  margin-bottom: 40px;
}

// align checkbox with top of its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;

  .v-input--selection-controls__input {
    margin-top: -2px;
  }
}
</style>
