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
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <label>Add a Foreign Business</label>
          </v-col>

          <v-col
            cols="12"
            sm="8"
            class="ml-8"
          >
            <span>**TODO**</span>

            <v-row
              class="justify-end mr-0 mt-2"
            >
              <v-btn
                id="app-cancel-btn"
                large
                outlined
                color="primary"
                @click="isAddingAmalgamatingForeignBusiness = false"
              >
                <span>Cancel</span>
              </v-btn>
            </v-row>
          </v-col>

          <!-- extra column is for possible action button -->
        </v-row>
      </v-card>
    </v-expand-transition>

    <!-- snackbar to temporarily show fetch errors -->
    <v-snackbar
      v-model="snackbar"
      timeout="5000"
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

    <BusinessTable
      class="mt-8"
      :class="{ 'invalid-section': getShowErrors && !businessTableValid }"
      @valid="businessTableValid=$event"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin } from '@/mixins'
import { AuthServices, BusinessLookupServices, LegalServices } from '@/services'
import { BusinessLookup } from '@bcrs-shared-components/business-lookup'
import { AmalgamatingBusinessIF, BusinessLookupResultIF, EmptyBusinessLookup } from '@/interfaces'
import { AmlRoles, AmlTypes, RestorationTypes } from '@/enums'
import BusinessTable from '@/components/Amalgamation/BusinessTable.vue'

@Component({
  components: {
    BusinessLookup,
    BusinessTable
  }
})
export default class AmalgamatingBusinesses extends Mixins(CommonMixin) {
  readonly BusinessLookupServices = BusinessLookupServices

  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) getAmalgamatingBusinessesValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  @Action(useStore) pushAmalgamatingBusiness!: (x: AmalgamatingBusinessIF) => void
  @Action(useStore) setAmalgamatingBusinessesValid!: (x: boolean) => void

  // Local properties
  initialBusinessLookupObject = EmptyBusinessLookup
  businessTableValid = false
  snackbar = false
  snackbarText = ''

  // Button properties
  isAddingAmalgamatingBusiness = false
  isAddingAmalgamatingForeignBusiness = false

  async saveAmalgamatingBusiness (businessLookup: BusinessLookupResultIF): Promise<void> {
    // Get the auth info, business info, addresses and filings in parallel.
    // Return data array; if any call failed, that item will be undefined.
    const data = await Promise.allSettled([
      AuthServices.fetchAuthInfo(businessLookup.identifier),
      LegalServices.fetchBusinessInfo(businessLookup.identifier),
      LegalServices.fetchAddresses(businessLookup.identifier),
      LegalServices.fetchFilings(businessLookup.identifier)
    ]).then(results => results.map((result: any) => result.value))

    // check if all elements are undefined
    if (!data.some(d => d)) {
      this.snackbarText = 'Unable to add that business.'
      this.snackbar = true
      return
    }

    const authInfo = data[0]
    const businessInfo = data[1]
    const addresses = data[2]
    const filings = data[3]

    // If identifier already exists, don't add the business to the array.
    if (this.getAmalgamatingBusinesses.find((b: any) => b.identifier === businessInfo.identifier)) {
      this.snackbarText = 'Business is already in table.'
      this.snackbar = true
      return
    }

    // Create amalgamating business object.
    // If we couldn't fetch some data, use business lookup data instead.
    const tingBusiness: AmalgamatingBusinessIF = {
      type: AmlTypes.LEAR,
      role: AmlRoles.AMALGAMATING,
      identifier: businessInfo?.identifier || businessLookup.identifier,
      name: businessInfo?.legalName || businessLookup.name,
      email: authInfo?.contacts[0]?.email, // may be undefined
      legalType: businessInfo?.legalType || businessLookup.legalType,
      address: addresses?.registeredOffice?.mailingAddress, // may be undefined
      isNotInGoodStanding: (businessInfo?.goodStanding === false),
      isFutureEffective: (filings[0]?.isFutureEffective === true),
      isLimitedRestoration: (filings[0]?.filingSubType === RestorationTypes.LIMITED) ||
        (filings[0]?.filingSubType === RestorationTypes.LTD_EXTEND)
    }

    // Add the new business to the amalgamating businesses list.
    this.pushAmalgamatingBusiness(tingBusiness)

    // Close the "Add an Amalgamating Business" panel.
    this.isAddingAmalgamatingBusiness = false
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
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-btn:not(.v-btn--round).v-size--default {
  height: 44px;
}
</style>
