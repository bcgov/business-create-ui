<template>
  <div id="amalgamating-businesses">
    <v-btn
      id="btn-add-amalgamating-business"
      outlined
      color="primary"
      class="btn-outlined-primary"
      :disabled="isAddingAmalgamatingBusiness || isAddingAmalgamatingForeignBusiness"
      @click="isAddingAmalgamatingBusiness = true"
    >
      <v-icon>mdi-domain-plus</v-icon>
      <span>Add an Amalgamating Business</span>
    </v-btn>

    <v-btn
      v-if="isRoleStaff"
      id="btn-add-amalgamating-foreign-business"
      outlined
      color="primary"
      class="ml-2 btn-outlined-primary"
      :disabled="isAddingAmalgamatingBusiness || isAddingAmalgamatingForeignBusiness"
      @click="isAddingAmalgamatingForeignBusiness = true"
    >
      <v-icon>mdi-domain-plus</v-icon>
      <span>Add an Amalgamating Foreign Business</span>
    </v-btn>

    <!-- Add an Amalgamating Business button clicked -->
    <v-expand-transition>
      <v-card
        v-if="isAddingAmalgamatingBusiness"
        flat
        class="section-container mt-4 pr-0"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <label>Add a Business Registered in BC</label>
          </v-col>

          <v-col
            cols="12"
            sm="8"
            class="ml-8"
          >
            <span>Enter the name or the incorporation number of the registered BC business
              to add to this application.</span>

            <BusinessLookup
              :showErrors="false"
              :businessLookup="initialBusinessLookupObject"
              :BusinessLookupServices="BusinessLookupServices"
              legalTypes="BC,BEN,CC,ULC,A"
              label="Business Name or Incorporation Number"
              @setBusiness="saveAmalgamatingBusiness($event)"
            />

            <v-row
              class="justify-end mr-0 mt-2"
            >
              <v-btn
                id="app-cancel-btn"
                large
                outlined
                color="primary"
                @click="isAddingAmalgamatingBusiness = false"
              >
                <span>Cancel</span>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-expand-transition>

    <!-- Add an Amalgamating Foreign Business button clicked -->
    <v-expand-transition>
      <v-card
        v-if="isAddingAmalgamatingForeignBusiness"
        flat
        class="section-container mt-4"
      >
        <v-form
          id="foreignBusinessForm"
          ref="foreignBusinessForm"
          @submit.prevent
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="3"
            >
              <label>Add a Foreign Business</label>
            </v-col>
            <v-col
              cols="12"
              sm="9"
            >
              <Jurisdiction
                :errorMessages="jurisdictionErrorMessage"
                @change="onJurisdictionChange($event)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="9"
              offset="3"
            >
              <v-text-field
                v-model="legalName"
                filled
                label="Business' full legal name in home jurisdiction"
                :rules="foreignBusinessRules"
              />
            </v-col>
            <v-col
              cols="12"
              sm="9"
              offset="3"
            >
              <v-text-field
                v-model="corpNumber"
                filled
                label="Corporate number in home jurisdiction"
                :rules="foreignBusinessRules"
              />
            </v-col>
            <v-col
              cols="auto"
              class="ms-auto"
            >
              <v-btn
                large
                color="primary"
                class="mr-3"
                @click="saveAmalgamatingForeignBusiness()"
              >
                Add
              </v-btn>
              <v-btn
                large
                outlined
                color="primary"
                @click="isAddingAmalgamatingForeignBusiness = false"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-expand-transition>

    <BusinessTable
      class="mt-8"
      :class="{ 'invalid-section': getShowErrors && !businessTableValid }"
      @valid="businessTableValid=$event"
    />

    <!-- snackbar to temporarily show fetch errors -->
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn
          color="error"
          class="font-weight-bold"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmalgamationMixin, CommonMixin } from '@/mixins'
import { BusinessLookupServices } from '@/services'
import { BusinessLookup } from '@bcrs-shared-components/business-lookup'
import { Jurisdiction } from '@bcrs-shared-components/jurisdiction'
import { AmalgamatingBusinessIF, BusinessLookupResultIF, EmptyBusinessLookup } from '@/interfaces'
import { AmlRoles, AmlTypes } from '@/enums'
import { Location } from '@bcrs-shared-components/enums'
import BusinessTable from '@/components/Amalgamation/BusinessTable.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    BusinessLookup,
    BusinessTable,
    Jurisdiction
  }
})
export default class AmalgamatingBusinesses extends Mixins(AmalgamationMixin, CommonMixin) {
  // Refs
  $refs!: {
    foreignBusinessForm: any
  }

  readonly BusinessLookupServices = BusinessLookupServices

  @Getter(useStore) getAmalgamatingBusinessesValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean

  @Action(useStore) pushAmalgamatingBusiness!: (x: AmalgamatingBusinessIF) => void
  @Action(useStore) setAmalgamatingBusinessesValid!: (x: boolean) => void

  // Local properties
  initialBusinessLookupObject = EmptyBusinessLookup
  businessTableValid = false
  snackbar = false
  snackbarText = ''

  // Foreign business properties
  jurisdiction = null
  legalName = null
  corpNumber = null
  isCan = false
  isForeignBusinessValid = false
  jurisdictionErrorMessage = ''

  // Button properties
  isAddingAmalgamatingBusiness = false
  isAddingAmalgamatingForeignBusiness = false

  /** TextField rules for "Add an Amalgamating Foreign Business" Panel. */
  get foreignBusinessRules (): Array<(v) => boolean | string> {
    return [ v => !!v || 'Required.' ]
  }

  /** Called when Jurisdiction menu item is changed. */
  onJurisdictionChange (jurisdiction: any): void {
    this.jurisdiction = jurisdiction
    this.isCan = jurisdiction.group === 0
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Required.'
  }

  async saveAmalgamatingBusiness (businessLookup: BusinessLookupResultIF): Promise<void> {
    // Show spinner since the network calls below can take a few seconds.
    this.$root.$emit('showSpinner', true)

    // Get the business information
    const business = await this.fetchAmalgamatingBusinessInfo(businessLookup)

    // Check for unaffiliated business.
    if (!business.authInfo) {
      // If a staff account couldn't fetch the auth info then the business doesn't exist.
      if (this.isRoleStaff) {
        this.snackbarText = 'Business doesn\'t exist in LEAR.'
        this.snackbar = true

        // Hide spinner.
        this.$root.$emit('showSpinner', false)

        return
      }

      // Otherwise, assume the business is unaffiliated and add it to the table.
      this.pushAmalgamatingBusiness({
        type: AmlTypes.LEAR,
        role: AmlRoles.AMALGAMATING,
        identifier: businessLookup.identifier,
        name: businessLookup.name,
        legalType: businessLookup.legalType as unknown as CorpTypeCd
      })

      // Close the "Add an Amalgamating Business" panel.
      this.isAddingAmalgamatingBusiness = false

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
    }

    // Check for Legal API fetch issues.
    if (!business.businessInfo || !business.addresses || !business.firstFiling) {
      this.snackbarText = 'Unable to add that business.'
      this.snackbar = true

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
    }

    // Check for duplicate.
    if (this.getAmalgamatingBusinesses.find((b: any) => b.identifier === business.businessInfo.identifier)) {
      this.snackbarText = 'Business is already in table.'
      this.snackbar = true

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
    }

    // Create amalgamating business object.
    const tingBusiness: AmalgamatingBusinessIF = {
      type: AmlTypes.LEAR,
      role: AmlRoles.AMALGAMATING,
      identifier: business.businessInfo.identifier,
      name: business.businessInfo.legalName,
      email: business.authInfo.contacts[0].email,
      legalType: business.businessInfo.legalType,
      address: business.addresses.registeredOffice.mailingAddress,
      isNotInGoodStanding: (business.businessInfo.goodStanding === false),
      isFutureEffective: (business.firstFiling.isFutureEffective === true),
      isLimitedRestoration: await this.isLimitedRestoration(business)
    }

    // Add the new business to the amalgamating businesses list.
    this.pushAmalgamatingBusiness(tingBusiness)

    // Close the "Add an Amalgamating Business" panel.
    this.isAddingAmalgamatingBusiness = false

    // Hide spinner.
    this.$root.$emit('showSpinner', false)
  }

  saveAmalgamatingForeignBusiness (): void {
    // Validate
    this.validateAddAmalgamatingForeignBusiness()
    if (!this.isForeignBusinessValid) return

    // Create the amalgamating foreign business object
    const tingBusiness = {
      type: AmlTypes.FOREIGN,
      role: AmlRoles.AMALGAMATING,
      foreignJurisdiction: {
        region: this.isCan ? this.jurisdiction.text : '',
        country: this.isCan ? Location.CA : this.jurisdiction.value
      },
      legalName: this.legalName,
      corpNumber: this.corpNumber
    } as AmalgamatingBusinessIF

    // Set the amalgamated businesses array in the store.
    this.pushAmalgamatingBusiness(tingBusiness)

    // Close the "Add an Amalgamating Foreign Business" Panel.
    this.isAddingAmalgamatingForeignBusiness = false
  }

  /** Validate Add Amalgamating Foreign Business. */
  validateAddAmalgamatingForeignBusiness (): void {
    this.isForeignBusinessValid = (
      this.jurisdiction &&
      this.legalName &&
      this.corpNumber
    )
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Required.'
    this.$refs.foreignBusinessForm.validate()
  }

  /** Sets validity according to various flags. */
  @Watch('businessTableValid')
  @Watch('isAddingAmalgamatingBusiness')
  @Watch('isAddingAmalgamatingForeignBusiness')
  private onBusinessTableValid (): void {
    this.setAmalgamatingBusinessesValid(
      this.businessTableValid &&
      !this.isAddingAmalgamatingBusiness &&
      !this.isAddingAmalgamatingForeignBusiness
    )

    // Reset "Add an Amalgamating Foreign Business" Panel on change
    this.jurisdiction = null
    this.legalName = null
    this.corpNumber = null
    this.jurisdictionErrorMessage = ''
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-btn:not(.v-btn--round).v-size--default {
  height: 44px;
}

#foreignBusinessForm {
  // un-bold v-text-field labels
  :deep(.v-label) {
      font-weight: normal;
    color: $gray7;
  }
}
</style>
