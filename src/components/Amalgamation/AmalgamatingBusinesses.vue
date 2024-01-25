<template>
  <div id="amalgamating-businesses">
    <section class="checklist-section">
      <div class="subhead">
        Your application must include the following:
      </div>
      <ul>
        <li v-if="isAmalgamationFilingHorizontal || isAmalgamationFilingVertical">
          <v-icon
            v-if="haveHoldingBusiness"
            color="green darken-2"
            class="cp-valid"
          >
            mdi-check
          </v-icon>
          <v-icon
            v-else-if="getShowErrors"
            color="error"
            class="cp-invalid"
          >
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-circle-small
          </v-icon>
          <span class="rule-item-txt">The {{ isAmalgamationFilingHorizontal ? 'primary' : 'holding' }}
            business</span>
        </li>

        <li>
          <v-icon
            v-if="haveAmalgamatingBusinesses"
            color="green darken-2"
            class="incorp-valid"
          >
            mdi-check
          </v-icon>
          <v-icon
            v-else-if="getShowErrors"
            color="error"
            class="incorp-invalid"
          >
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-circle-small
          </v-icon>
          <span class="rule-item-txt">Amalgamating businesses</span>
        </li>
      </ul>
    </section>

    <div class="buttons-section mt-6">
      <v-btn
        id="add-amalgamating-business-button"
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
        id="add-foreign-business-button"
        outlined
        color="primary"
        class="ml-2 btn-outlined-primary"
        :disabled="isAddingAmalgamatingBusiness || isAddingAmalgamatingForeignBusiness"
        @click="isAddingAmalgamatingForeignBusiness = true"
      >
        <v-icon>mdi-domain-plus</v-icon>
        <span>Add an Amalgamating Foreign Business</span>
      </v-btn>
    </div>

    <!-- Add an Amalgamating Business button clicked -->
    <v-expand-transition>
      <v-card
        v-if="isAddingAmalgamatingBusiness"
        id="add-amalgamating-business-panel"
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
              :key="Math.random()"
              :showErrors="false"
              :businessLookup="{ ...EmptyBusinessLookup }"
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
        id="add-foreign-business-panel"
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
                id="foreign-business-legal-name"
                v-model="legalName"
                filled
                label="Business' full legal name in home jurisdiction"
                :rules="foreignBusinessLegalNameRules"
              />
            </v-col>
            <v-col
              cols="12"
              sm="9"
              offset="3"
            >
              <v-text-field
                id="foreign-business-corp-number"
                v-model="corpNumber"
                filled
                label="Corporate number in home jurisdiction"
                :rules="foreignBusinessCorpNumberRules"
              />
            </v-col>
            <v-col
              cols="auto"
              class="ms-auto"
            >
              <v-btn
                id="save-foreign-business-button"
                large
                color="primary"
                class="mr-3"
                @click="saveAmalgamatingForeignBusiness()"
              >
                <span>Add</span>
              </v-btn>
              <v-btn
                id="cancel-foreign-business-button"
                large
                outlined
                color="primary"
                @click="isAddingAmalgamatingForeignBusiness = false"
              >
                <span>Cancel</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-expand-transition>

    <BusinessTable
      class="mt-8"
      :class="{ 'invalid-section': getShowErrors && !businessTableValid }"
      @allOk="allOk=$event"
    />

    <!-- snackbar to temporarily show fetch errors -->
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
    >
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn
          color="white"
          icon
          aria-label="Close Notification"
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>mdi-close</v-icon>
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
import { CanJurisdictions, MrasJurisdictions } from '@bcrs-shared-components/jurisdiction/list-data'
import { AmalgamatingBusinessIF, BusinessLookupResultIF, EmptyBusinessLookup } from '@/interfaces'
import { AmlRoles, AmlTypes, EntityStates } from '@/enums'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'
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
  readonly EmptyBusinessLookup = EmptyBusinessLookup

  // @Getter(useStore) getAmalgamatingBusinesses!: Array<AmalgamatingBusinessIF>
  @Getter(useStore) getShowErrors!: boolean
  // @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  // @Getter(useStore) isAmalgamationFilingRegular!: boolean
  // @Getter(useStore) isAmalgamationFilingVertical!: boolean

  @Action(useStore) pushAmalgamatingBusiness!: (x: AmalgamatingBusinessIF) => void
  @Action(useStore) setAmalgamatingBusinessesValid!: (x: boolean) => void

  // Local properties
  allOk = false
  snackbar = false
  snackbarText = ''

  // Foreign business properties
  jurisdiction = null
  legalName = null
  corpNumber = null
  isCan = false
  isMrasJurisdiction = false
  jurisdictionErrorMessage = ''
  isForeignBusinessValid = null as boolean // null/false/true for no validation/invalid/valid

  // Button properties
  isAddingAmalgamatingBusiness = false
  isAddingAmalgamatingForeignBusiness = false

  get foreignBusinessLegalNameRules (): Array<(v: string) => boolean | string> {
    return [
      v => !!v || 'Full legal name is required',
      v => (!v || v.length >= 3) || 'Must be at least 3 characters',
      v => (!v || v.length <= 150) || 'Cannot exceed 150 characters'
    ]
  }

  get foreignBusinessCorpNumberRules (): Array<(v: string) => boolean | string> {
    return [
      v => (!this.isMrasJurisdiction || (!!v && /^[0-9a-zA-Z-]+$/.test(v))) ||
        'Corporate number is required',
      v => (!v || v.length >= 3) || 'Must be at least 3 characters',
      v => (!v || v.length <= 40) || 'Cannot exceed 40 characters'
    ]
  }

  /** Whether the business table is valid. */
  get businessTableValid (): boolean {
    if (this.isAmalgamationFilingRegular) {
      return (this.haveAmalgamatingBusinesses && this.allOk)
    } else {
      return (this.haveHoldingBusiness && this.haveAmalgamatingBusinesses && this.allOk)
    }
  }

  /**
   * Whether we have a holding/primary business in the table.
   * (Only used for short-form amalgamations.)
   */
  get haveHoldingBusiness (): boolean {
    return this.getAmalgamatingBusinesses.some((b: AmalgamatingBusinessIF) =>
      b.role === AmlRoles.HOLDING
    )
  }

  /**
   * Whether we have enough amalgamating businesses in the table.
   * - Regular amalgamations require 2 or more.
   * - Horizontal and vertical amalgamations require 1 or more.
   */
  get haveAmalgamatingBusinesses (): boolean {
    const amalgamating = this.getAmalgamatingBusinesses.filter((b: AmalgamatingBusinessIF) =>
      b.role === AmlRoles.AMALGAMATING
    )
    if (this.isAmalgamationFilingRegular) {
      return (amalgamating.length >= 2)
    } else {
      return (amalgamating.length >= 1)
    }
  }

  /** Called when Jurisdiction menu item is changed. */
  onJurisdictionChange (jurisdiction: any): void {
    this.jurisdiction = jurisdiction
    this.isCan = (jurisdiction?.group === 0)
    this.jurisdictionErrorMessage = jurisdiction ? '' : 'Home jurisdiction is required'
    this.isMrasJurisdiction = MrasJurisdictions.includes(
      this.jurisdiction?.text.toLowerCase()
    )

    // Update validation on jurisdiction change
    if (this.isForeignBusinessValid !== null) {
      this.validateAddAmalgamatingForeignBusiness()
    }
  }

  async saveAmalgamatingBusiness (businessLookup: BusinessLookupResultIF): Promise<void> {
    // Show spinner since the network calls below can take a few seconds.
    this.$root.$emit('showSpinner', true)

    // Special case to handle Extra Pro A companies
    if ((businessLookup.legalType as any) === CorpTypeCd.EXTRA_PRO_A) {
      const region = CanJurisdictions.find(jurisdiction => jurisdiction.value === JurisdictionLocation.BC)
      const tingBusiness = {
        type: AmlTypes.FOREIGN,
        role: AmlRoles.AMALGAMATING,
        foreignJurisdiction: {
          region: region.text,
          country: JurisdictionLocation.CA
        },
        legalName: businessLookup.name,
        corpNumber: businessLookup.identifier
      } as AmalgamatingBusinessIF

      // Check for duplicate
      if (this.checkForDuplicateInTable(tingBusiness)) {
        this.snackbarText = 'Business is already in table.'
        this.snackbar = true

        // Hide spinner.
        this.$root.$emit('showSpinner', false)

        return
      }

      this.pushAmalgamatingBusiness(tingBusiness)

      // Close the "Add an Amalgamating Business" panel.
      this.isAddingAmalgamatingBusiness = false

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
    }

    // Get the business information
    const business = await this.fetchAmalgamatingBusinessInfo(businessLookup.identifier)

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
    // NB - don't check for null firstTask since that's valid
    if (!business.businessInfo || !business.addresses || !business.firstFiling) {
      this.snackbarText = 'Unable to add that business.'
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
      isFrozen: (business.businessInfo.adminFreeze === true),
      isFutureEffective: this.isFutureEffective(business),
      isDraftTask: this.isDraftTask(business),
      isPendingFiling: this.isPendingFiling(business),
      isLimitedRestoration: await this.isLimitedRestoration(business),
      isHistorical: (business.businessInfo.state === EntityStates.HISTORICAL)
    }

    // Check for duplicate.
    if (this.checkForDuplicateInTable(tingBusiness)) {
      this.snackbarText = 'Business is already in table.'
      this.snackbar = true

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
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
        country: this.isCan ? JurisdictionLocation.CA : this.jurisdiction.value
      },
      legalName: this.legalName,
      corpNumber: this.corpNumber
    } as AmalgamatingBusinessIF

    // Check for duplicate.
    if (this.checkForDuplicateInTable(tingBusiness)) {
      this.snackbarText = 'Business is already in table.'
      this.snackbar = true

      // Hide spinner.
      this.$root.$emit('showSpinner', false)

      return
    }

    // Set the amalgamated businesses array in the store.
    this.pushAmalgamatingBusiness(tingBusiness)

    // Close the "Add an Amalgamating Foreign Business" panel.
    this.isAddingAmalgamatingForeignBusiness = false
  }

  /**
   * Check if business is already in table.
   * @param business The business being added.
   */
  private checkForDuplicateInTable (business: any): boolean {
    const checkDuplication = this.getAmalgamatingBusinesses.find((b: AmalgamatingBusinessIF) =>
      (b.type === AmlTypes.LEAR && b.identifier === business.identifier) ||
      (b.type === AmlTypes.FOREIGN && b.corpNumber === business.corpNumber)
    )

    if (checkDuplication) {
      this.isAddingAmalgamatingBusiness = false
      return true
    }
    return false
  }

  /** Validate Add Amalgamating Foreign Business. */
  private validateAddAmalgamatingForeignBusiness (): void {
    this.isForeignBusinessValid = (
      !!this.jurisdiction &&
      !!this.legalName &&
      (!this.isMrasJurisdiction || !!this.corpNumber)
    )
    this.jurisdictionErrorMessage = this.jurisdiction ? '' : 'Home jurisdiction is required'
    this.$refs.foreignBusinessForm.validate()
  }

  /** Sets validity according to various flags. */
  @Watch('businessTableValid')
  @Watch('isAddingAmalgamatingBusiness')
  @Watch('isAddingAmalgamatingForeignBusiness')
  private onBusinessTableValid (): void {
    // this component is valid if the business table is valid and we're not adding a business
    this.setAmalgamatingBusinessesValid(
      this.businessTableValid &&
      !this.isAddingAmalgamatingBusiness &&
      !this.isAddingAmalgamatingForeignBusiness
    )

    // reset "Add an Amalgamating Foreign Business" panel on change
    this.isForeignBusinessValid = null
    this.jurisdiction = null
    this.legalName = null
    this.corpNumber = null
    this.jurisdictionErrorMessage = ''
    this.isMrasJurisdiction = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.checklist-section {
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

  .rule-item-txt {
    margin-left: 0.5rem;
  }
}

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
