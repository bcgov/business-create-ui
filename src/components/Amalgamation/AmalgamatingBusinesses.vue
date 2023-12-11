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
import { AmalgamatingBusinessIF, BusinessLookupIF, EmptyBusinessLookup } from '@/interfaces'
import { AmlRoles } from '@/enums'
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

  @Action(useStore) setAmalgamatingBusinesses!: (x: Array<AmalgamatingBusinessIF>) => void
  @Action(useStore) setAmalgamatingBusinessesValid!: (x: boolean) => void

  // Local properties
  initialBusinessLookupObject = EmptyBusinessLookup
  businessTableValid = false
  snackbar = false
  snackbarText = ''

  // Button properties
  isAddingAmalgamatingBusiness = false
  isAddingAmalgamatingForeignBusiness = false

  async saveAmalgamatingBusiness (businessLookup: BusinessLookupIF): Promise<void> {
    // Get the amalgamating business information, auth info and addresses, and email if in LEAR.
    // Otherwise, return the businesslookup object.
    const data = await Promise.all([
      LegalServices.fetchBusinessInfo(businessLookup.identifier),
      AuthServices.fetchAuthInfo(businessLookup.identifier),
      LegalServices.fetchAddresses(businessLookup.identifier)
    ]).catch(() => {}) // ignore promise errors

    // check for errors
    if (!data || data.length !== 3) {
      this.snackbarText = 'Unable to add this business.'
      this.snackbar = true
      return
    }

    const businessInfo = data[0]
    const authInfo = data[1]
    const addresses = data[2]

    // If identifier already exists, don't add the business to the array.
    if (this.getAmalgamatingBusinesses.find((b: any) => b.identifier === businessInfo.identifier)) {
      this.snackbarText = 'Business is already in table.'
      this.snackbar = true
      return
    }

    // Create amalgamating business object.
    const tingBusiness = {
      type: 'lear',
      role: AmlRoles.AMALGAMATING,
      identifier: businessInfo.identifier,
      name: businessInfo.legalName,
      email: authInfo.contacts[0].email,
      legalType: businessInfo.legalType,
      address: addresses.registeredOffice.mailingAddress,
      goodStanding: businessInfo.goodStanding
    } as AmalgamatingBusinessIF

    // Add the new business to a new array and store the new array.
    const amalgamatingBusinesses = this.getAmalgamatingBusinesses
    amalgamatingBusinesses.push(tingBusiness)
    this.setAmalgamatingBusinesses(amalgamatingBusinesses)

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
