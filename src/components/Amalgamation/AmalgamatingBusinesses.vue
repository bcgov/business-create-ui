<template>
  <div id="amalgamating-businesses">
    <v-btn
      id="btn-add-amalgamating-business"
      outlined
      color="primary"
      class="btn-outlined-primary"
      :disabled="addAmalgatingBusinessDisabled"
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
      :disabled="addAmalgatingForeignBusinessDisabled"
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
        class="section-container mt-4"
      >
        <v-row
          no-gutters
        >
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
              label="Business Name or Incorporation Number"
              @setBusiness="setAmalgamatingBusiness($event)"
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
        <v-row
          no-gutters
        >
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
    <v-row class="mt-4 ml-1">
      <ul>
        Amalgamating Businesses: <br><br>
        <li
          v-for="(business, index) in amalgamatingBuinesses"
          :key="index"
        >
          <template v-if="business.foundingDate">
            Legal Name: {{ business.legalName }} <br>
            Legal Type: {{ business.legalType }} <br>
            Mailing Address: {{ business.officeAddress.mailingAddress }} <br>
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
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin } from '@/mixins'
import { BusinessLookupServices, LegalServices } from '@/services'
import { BusinessLookup } from '@bcrs-shared-components/business-lookup'
import { BusinessIF, BusinessLookupIF, EmptyBusinessLookup } from '@/interfaces'

@Component({
  components: {
    BusinessLookup
  }
})
export default class AmalgamatingBusinesses extends Mixins(CommonMixin) {
  @Getter(useStore) getAmalgamatingBusinesses!: Array<BusinessIF>
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isRoleStaff!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: Array<BusinessIF>) => void

  // Local properties
  amalgamatingBusinessesValid = false
  amalgamatingBuinesses = []
  initialBusinessLookupObject = EmptyBusinessLookup

  // Add an Amalgamating Business button properties
  isAddingAmalgamatingBusiness = false
  addAmalgatingBusinessDisabled = false

  // Add an Amalgamating Foreign Business button properties
  isAddingAmalgamatingForeignBusiness = false
  addAmalgatingForeignBusinessDisabled = false

  readonly BusinessLookupServices = BusinessLookupServices

  // Cancel button in "Add an Amalgamating Business" is pressed.
  addAmalgamatingBusinessCancel (): void {
    this.isAddingAmalgamatingBusiness = false
    // Enable buttons
    this.addAmalgatingBusinessDisabled = false
    this.addAmalgatingForeignBusinessDisabled = false
  }

  // "Add an Amalgamating Business" button is pressed.
  onAddBusinessClick (): void {
    this.isAddingAmalgamatingBusiness = true
    this.isAddingAmalgamatingForeignBusiness = false
    // Disable buttons
    this.addAmalgatingBusinessDisabled = true
    this.addAmalgatingForeignBusinessDisabled = true
  }

  // "Add an Amalgamating Foreign Business" button is pressed.
  onAddForeignBusinessClick (): void {
    this.isAddingAmalgamatingBusiness = false
    this.isAddingAmalgamatingForeignBusiness = true
    // Disable buttons (Please comment out the lines below or remove in part 2)
    // this.addAmalgatingBusinessDisabled = true
    // this.addAmalgatingForeignBusinessDisabled = true
  }

  // Add to the amalgamating businesses array.
  // If EP (A type), cannot be part of short form horizontal amalgamation.
  pushToAmalgamatingBusinesses (business: any): void {
    if (this.isAmalgamationFilingHorizontal) {
      if (business.legalType !== 'A') this.amalgamatingBuinesses.push(business)
    } else {
      this.amalgamatingBuinesses.push(business)
    }
  }

  async setAmalgamatingBusiness (businessLookup: BusinessLookupIF): Promise<void> {
    // Get the amalgamating business information
    // Will have a different format depending on the business
    let business = await LegalServices.fetchBusinessInfo(businessLookup.identifier)
      .then((response) => {
        return response?.data?.business
      }).catch(() => {
        return businessLookup
      })

    // Get the address of the amalgamating business
    if (businessLookup.identifier && business.foundingDate) {
      const addresses = await LegalServices.fetchAddresses(businessLookup.identifier)
        .then((data) => {
          // SP and GP have businessOffice instead of registeredOffice
          return data?.registeredOffice || data?.businessOffice
        }).catch(() => {
          return undefined
        })
      if (addresses) {
        business.officeAddress = addresses
      }
    }

    // If the amalgamating businesses array is not empty, check if identifier already exists.
    // If identifier already exists, don't add the business to the array.
    if (this.amalgamatingBuinesses.length > 0) {
      const filteredBusinesses = this.amalgamatingBuinesses.filter(function (id) {
        return id.identifier === business.identifier
      })
      if (filteredBusinesses.length === 0) this.pushToAmalgamatingBusinesses(business)
    } else {
      this.pushToAmalgamatingBusinesses(business)
    }

    // Set the amalgamated businesses array in the store.
    this.setAmalgamatingBusinesses(this.amalgamatingBuinesses)
    // Close the "Add an Amalgamating Business" Panel.
    this.addAmalgamatingBusinessCancel()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-btn:not(.v-btn--round).v-size--default {
  height: 44px;
}

</style>
