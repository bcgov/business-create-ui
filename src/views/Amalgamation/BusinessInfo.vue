<template>
  <div id="amalgamation-business-info">
    <!-- Office Addresses -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="office-address-header">
        <h2>Registered and Records Office Addresses</h2>

        <p v-if="isAmalgamationFilingRegular">
          Enter the Registered Office and Records Office Mailing and Delivery Addresses of the resulting
          businesses. All addresses must be located in B.C.
        </p>

        <p v-if="isAmalgamationFilingHorizontal || isAmalgamationFilingVertical">
          The resulting business will adopt the following Registered Office and Records Office Mailing and
          Delivery Addresses of the {{ isAmalgamationFilingHorizontal ? 'primary' : 'holding' }} business
          in this amalgamation.
        </p>
      </header>

      <template v-if="isAmalgamationFilingRegular">
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="addresses"
          @update:addresses="setOfficeAddresses($event)"
          @valid="onOfficeAddressesValid($event)"
        />
      </template>

      <template v-if="isAmalgamationFilingHorizontal || isAmalgamationFilingVertical">
        <MessageBox color="gold">
          <p>
            <strong>Important: </strong>To update the registered office and records office addresses, save
            this draft application and visit the {{ isAmalgamationFilingHorizontal ? 'primary' : 'holding' }}
            business' dashboard. Make the address changes there and come back to this application.
          </p>
        </MessageBox>

        <v-card
          flat
          class="mt-6"
        >
          <CardHeader label="Addresses" />
          <article class="section-container">
            <OfficeAddresses
              :inputAddresses="addresses"
              :isEditing="false"
              @valid="onOfficeAddressesValid($event)"
            />
          </article>
        </v-card>
      </template>
    </section>

    <!-- Registered Office Contact Information -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="registered-office-contact-header">
        <h2>Registered Office Contact Information</h2>
        <p v-if="isAmalgamationFilingRegular">
          Enter the contact information for the resulting business. The BC Business Registry will use this
          to communicate with the business in the future, including sending documents and notifications.
        </p>
        <p v-if="isAmalgamationFilingHorizontal">
          The resulting business will use this contact information adopted from the primary business in this
          amalgamation. The BC Business Registry will use this to communicate with the business in the future,
          including sending documents and notifications.
        </p>
        <p v-if="isAmalgamationFilingVertical">
          The resulting business will use this contact information adopted from the holding business in this
          amalgamation. The BC Business Registry will use this to communicate with the business in the future,
          including sending documents and notifications.
        </p>
      </header>

      <v-card
        flat
        class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !businessContactFormValid }"
      >
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="true"
          :showErrors="getShowErrors"
          @update="setBusinessContact($event)"
          @valid="onBusinessContactInfoValid($event)"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import {
  AddressIF,
  ContactPointIF,
  DefineCompanyIF,
  RegisteredRecordsAddressesIF
} from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import CardHeader from '@/components/common/CardHeader.vue'
import MessageBox from '@/components/common/MessageBox.vue'

@Component({
  components: {
    BusinessContactInfo,
    CardHeader,
    FolioNumber,
    OfficeAddresses,
    MessageBox
  }
})
export default class AmalgamationBusinessInfo extends Mixins(CommonMixin) {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isAmalgamationFilingRegular!: boolean
  @Getter(useStore) isAmalgamationFilingVertical!: boolean
  @Getter(useStore) isEntityType!: boolean

  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setDefineCompanyStepValidity!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void

  addressFormValid = false
  businessContactFormValid = false

  /** Array of valid components. Must match validFlags. */
  readonly validComponents = [
    'office-address-header',
    'registered-office-contact-header'
  ]

  /** Object of valid flags. Must match validComponents. */
  get validFlags (): object {
    return {
      validAddressForm: this.addressFormValid,
      validBusinessContactForm: this.businessContactFormValid
    }
  }

  get addresses (): RegisteredRecordsAddressesIF {
    return this.getDefineCompanyStep.officeAddresses
  }

  /** Called when component is created. */
  created (): void {
    // ignore data changes while page loads
    this.setIgnoreChanges(true)

    // if no addresses were fetched, set default addresses
    if (!this.addresses.registeredOffice && !this.addresses.recordsOffice) {
      this.setDefaultAddresses()
    }

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  /** Sets default addresses in filing. (Will get overwritten by a fetched draft filing if there is one.) */
  private setDefaultAddresses (): void {
    const defaultAddress: AddressIF = {
      addressCity: '',
      addressCountry: 'CA',
      addressRegion: 'BC',
      deliveryInstructions: '',
      postalCode: '',
      streetAddress: '',
      streetAddressAdditional: ''
    }

    this.setOfficeAddresses({
      registeredOffice: {
        mailingAddress: defaultAddress,
        deliveryAddress: defaultAddress
      },
      recordsOffice: {
        mailingAddress: defaultAddress,
        deliveryAddress: defaultAddress
      }
    })
  }

  onOfficeAddressesValid (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  onBusinessContactInfoValid (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (
      this.getShowErrors &&
      (
        this.$route.name === RouteNames.AMALG_REG_BUSINESS_INFO ||
        this.$route.name === RouteNames.AMALG_SHORT_BUSINESS_INFO
      )
    ) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#amalgamation-business-info {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

.value.name-request {
  width: 100%;
  min-width: 24rem;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: bold;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      padding-right: 2rem;
      width: 12rem;
    }
  }
}

// #business-buttons-container {
//   .v-btn + .v-btn {
//     margin-left: 0.5rem;
//   }
// }

header p {
  padding-top: 0.5rem;
}

// Vuetify Overrides
:deep(.v-select__selection--comma) {
  overflow: inherit;
}
</style>
