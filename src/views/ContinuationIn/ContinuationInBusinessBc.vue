<template>
  <div id="continuation-in-business-bc">
    <!-- Company Name -->
    <section class="mt-10">
      <header id="company-name">
        <h2>Company Name</h2>
      </header>

      <NameRequestInfo />
      <NameTranslations />
    </section>

    <!-- Registered Office Addresses -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="office-address-header">
        <h2>
          Registered and Records Office Addresses
        </h2>
        <p>
          Enter the Registered Office and Records Office Mailing and Delivery Addresses of the Resulting
          businesses. All addresses must be located in BC.
        </p>
      </header>

      <div :class="{ 'invalid-section': getShowErrors && !addressFormValid }">
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="addresses"
          @update:addresses="setOfficeAddresses($event)"
          @valid="addressFormValid = $event"
        />
      </div>
    </section>

    <!-- Registered Office Contact Information -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="registered-office-contact-header">
        <h2>Registered Office Contact Information</h2>
        <p>
          Enter the contact information for the resulting business. The BC Business Registry will use this
          to communicate with the business in the future, including sending documents and notifications.
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
          @valid="businessContactFormValid = $event"
        />
      </v-card>
    </section>

    <!-- Folio / Reference Number -->
    <section
      v-if="isPremiumAccount"
      id="folio-number-section"
      class="mt-10"
    >
      <header id="folio-reference-number-header">
        <h2>Folio / Reference Number (Optional)</h2>
        <p class="mt-4">
          Add an optional Folio or Reference Number about this business for your own tracking purposes.
          This information is not used by the BC Business Registry.
        </p>
      </header>

      <v-card
        flat
        class="mt-6"
      >
        <div
          class="px-4 py-8"
          :class="{ 'invalid-section': getShowErrors && !getFolioNumberValid}"
        >
          <FolioNumber
            :initialValue="getFolioNumber"
            :isEditing="true"
            @update="setFolioNumber($event)"
            @valid="setFolioNumberValidity($event)"
          />
        </div>
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
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    NameRequestInfo,
    NameTranslations,
    OfficeAddresses
  }
})
export default class ContinuationInBusinessBc extends Mixins(CommonMixin) {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getFolioNumberValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isPremiumAccount!: boolean

  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setContinuationInBusinessBcValid!: (x: boolean) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setFolioNumberValidity!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void

  addressFormValid = false
  businessContactFormValid = false

  /** Array of valid components. Must match validFlags. */
  readonly validComponents = [
    'office-address-header',
    'registered-office-contact-header',
    'folio-reference-number-header'
  ]

  /** Object of valid flags. Must match validComponents. */
  get validFlags (): object {
    return {
      validAddressForm: this.addressFormValid,
      validBusinessContactForm: this.businessContactFormValid,
      validFolioReferenceNumber: !this.isPremiumAccount || this.getFolioNumberValid
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

  @Watch('addressFormValid', { immediate: true })
  @Watch('businessContactFormValid', { immediate: true })
  @Watch('getFolioNumberValid', { immediate: true })
  private onContinuationInBusinessBcValid (): void {
    this.setContinuationInBusinessBcValid(
      this.addressFormValid &&
      this.businessContactFormValid &&
      (!this.isPremiumAccount || this.getFolioNumberValid)
    )
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.CONTINUATION_IN_BUSINESS_BC) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#continuation-in-business-bc {
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
