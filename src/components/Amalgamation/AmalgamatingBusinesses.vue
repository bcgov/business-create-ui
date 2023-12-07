<template>
  <div id="amalgamating-businesses">
    <v-btn
      id="btn-add-amalgamating-business"
      outlined
      color="primary"
      class="btn-outlined-primary"
      :disabled="isAddingAmalgamatingBusiness || isAddingAmalgamatingForeignBusiness"
      @click="onAddBusinessClick()"
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
      @click="onAddForeignBusinessClick()"
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
              to add to this application.
            </span>
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
                @click="addAmalgamatingBusinessCancel()"
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
          </v-col>

          <!-- extra column is for possible action button -->
        </v-row>
      </v-card>
    </v-expand-transition>

    <!-- <v-row class="mt-4 ml-1">
      <ul>
        Amalgamating Businesses: <br><br>
        <li
          v-for="(business, index) in getAmalgamatingBusinesses"
          :key="index"
        >
          <template v-if="business.foundingDate">
            Legal Name: {{ business.legalName }} <br>
            Legal Type: {{ business.legalType }} <br>
            Mailing Address: {{ business.officeAddress.registeredOffice.mailingAddress }} <br>
            Email Address: {{ business.businessContact.email }} <br>
            State: {{ business.state }} <br>
            Good Standing: {{ business.goodStanding }} <br>
        </template>
          <template v-else>
            Legal Name: {{ business.name }} <br>
            Legal Type: {{ business.legalType }} <br>
            Identifier: {{ business.identifier }} <br>
            Status: {{ business.status }}
          </template>
        </li>
      </ul>
    </v-row> -->

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

  // Button properties
  isAddingAmalgamatingBusiness = false
  isAddingAmalgamatingForeignBusiness = false

  readonly BusinessLookupServices = BusinessLookupServices

  // Cancel button in "Add an Amalgamating Business" is pressed.
  addAmalgamatingBusinessCancel (): void {
    this.isAddingAmalgamatingBusiness = false
    this.setAmalgamatingBusinessesValid(true)
  }

  // "Add an Amalgamating Business" button is pressed.
  onAddBusinessClick (): void {
    this.isAddingAmalgamatingBusiness = true
    this.isAddingAmalgamatingForeignBusiness = false
    this.setAmalgamatingBusinessesValid(false)
  }

  // "Add an Amalgamating Foreign Business" button is pressed.
  onAddForeignBusinessClick (): void {
    this.isAddingAmalgamatingBusiness = false
    this.isAddingAmalgamatingForeignBusiness = true
    this.setAmalgamatingBusinessesValid(false)
  }

  async saveAmalgamatingBusiness (businessLookup: BusinessLookupIF): Promise<void> {
    let business = null

    // Get the amalgamating business information, mailing address, and email if in LEAR.
    // Otherwise, return the businesslookup object.
    const data = await Promise.all([
      LegalServices.fetchBusinessInfo(businessLookup.identifier),
      AuthServices.fetchAuthInfo(businessLookup.identifier),
      LegalServices.fetchAddresses(businessLookup.identifier)
    ]).catch((error) => {
      return error
    })

    if (data.length === 3) {
      business = data[0].data?.business
      business.businessContact = data[1].contacts[0]
      business.officeAddress = data[2]
    }

    // If the business is not null (LEAR Entity), create from it a TING business following the interface.
    // If the amalgamating businesses array is not empty, check if identifier already exists.
    // If identifier already exists, don't add the business to the array.
    if (business) {
      const amalgamatingBusinesses = this.getAmalgamatingBusinesses

      const tingBusiness = {
        type: 'lear',
        role: AmlRoles.AMALGAMATING,
        identifier: business.identifier,
        name: business.legalName,
        email: business.businessContact.email,
        legalType: business.legalType,
        address: business.officeAddress.registeredOffice.mailingAddress,
        goodStanding: business.goodStanding
      } as AmalgamatingBusinessIF

      if (!amalgamatingBusinesses.find((b: any) => b.identifier === business.identifier)) {
        amalgamatingBusinesses.push(tingBusiness)

        // Set the new amalgamated businesses array in the store.
        this.setAmalgamatingBusinesses(amalgamatingBusinesses)
      }
    }

    // Close the "Add an Amalgamating Business" Panel.
    this.isAddingAmalgamatingBusiness = false
    this.setAmalgamatingBusinessesValid(true)
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
