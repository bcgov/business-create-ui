<template>
  <div id="incorporation-define-company">
    <!-- Name -->
    <section class="mt-10">
      <header id="name-header">
        <h2>Name</h2>
      </header>

      <v-card
        flat
        class="mt-5"
      >
        <NameRequestInfo />
        <NameTranslations
          v-if="!isTypeCoop"
          class="mt-n8"
        />
      </v-card>
    </section>

    <!-- Cooperative Association Type -->
    <section
      v-show="isTypeCoop"
      class="mt-10"
    >
      <header id="cooperative-type-header">
        <h2>Cooperative Association Type</h2>
        <!-- Help Section -->
        <div class="mt-4">
          <span
            class="help-btn"
            @click="coopHelpToggle = !coopHelpToggle"
          >
            <v-icon
              color="primary"
              style="padding-right: 5px"
            >mdi-help-circle-outline</v-icon>
            <span v-if="!coopHelpToggle">Help with Cooperative Association Types</span>
            <span v-else>Hide Help</span>
          </span>
          <section
            v-show="coopHelpToggle"
            class="coop-type-help"
          >
            <header id="coop-type-help-header">
              <h2>Help with Cooperative Association Types</h2>
            </header>

            <p>
              <strong>Community Service Cooperatives</strong> are a particular kind of cooperative
              recognized under the Cooperative Association Act. Community Service Cooperatives have a
              similar status to that of non-profit societies. This type of cooperative also requires the
              inclusion of non-alterable clauses in their rules to ensure they operate on a non-profit
              basis, and their purpose is charitable, or to provide health, social, educational, or other
              community services. Community Service Cooperatives cannot be Housing Cooperatives and cannot
              issue investment shares.
            </p>
            <p>
              <strong>Housing Cooperatives</strong> are a specific type of cooperative incorporated under
              the Cooperative Association Act that provides housing to its members. Members may purchase
              shares to join the Housing Cooperative and elect directors who will govern the cooperative.
              Housing Cooperatives cannot issue investment shares. The Cooperative Association Act details
              special provisions for Housing Cooperatives that need to be considered when deciding to
              incorporate.
            </p>
            <p>
              An <strong>Ordinary Cooperative</strong> is a cooperative that may have a wide range of
              purposes and is neither a Housing nor a Community Service Cooperative. The cooperative may
              operate as a for-profit association and may issue investment shares.
            </p>
            <u
              class="help-btn"
              @click="coopHelpToggle = !coopHelpToggle"
            ><small>Hide Help</small></u>
          </section>
        </div>
      </header>

      <div :class="{ 'invalid-section': getShowErrors && !hasValidCooperativeType }">
        <v-card
          flat
          class="step-container"
        >
          <CooperativeType
            :showErrors="getShowErrors"
            @hasCooperativeType="onHasCooperativeType($event)"
          />
        </v-card>
      </div>
    </section>

    <!-- Registered Office Addresses -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="office-address-header">
        <h2>
          Registered <span v-if="!isTypeCoop">and Records</span> Office
          Addresses
        </h2>
        <p>
          Enter the Registered Office <span v-if="!isTypeCoop">and Records Office
          </span> Mailing and Delivery Addresses. All addresses must be located in BC.
        </p>
      </header>

      <div :class="{ 'invalid-section': getShowErrors && !addressFormValid }">
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="addresses"
          @update:addresses="setOfficeAddresses($event)"
          @valid="onOfficeAddressesValid($event)"
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
          Enter the contact information for the business. The Corporate Registry will use this to communicate with the
          business in the future, including sending documents and notifications.
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

    <!-- Folio / Reference Number -->
    <section
      v-if="isEntityType && isPremiumAccount"
      class="mt-10"
    >
      <header id="folio-number-header">
        <h2>Folio / Reference Number (Optional)</h2>
        <p>
          Add an optional Folio or Reference Number about this business for your own tracking purposes.
          This information is not used by the BC Business Registry.
        </p>
      </header>

      <v-card
        flat
        class="step-container"
      >
        <FolioNumber
          :initialValue="getFolioNumber"
          :isEditing="true"
          @update="setFolioNumber($event)"
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
import { CoopTypes, RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import CooperativeType from '@/components/Dissolution/CooperativeType.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import NameTranslations from '@/components/common/NameTranslations.vue'

@Component({
  components: {
    BusinessContactInfo,
    CooperativeType,
    FolioNumber,
    OfficeAddresses,
    NameRequestInfo,
    NameTranslations
  }
})
export default class IncorporationDefineCompany extends Mixins(CommonMixin) {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getFolioNumber!: string
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isEntityType!: boolean
  @Getter(useStore) isPremiumAccount!: boolean
  @Getter(useStore) isTypeCoop!: boolean

  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setCooperativeType!: (x: CoopTypes) => void
  @Action(useStore) setDefineCompanyStepValidity!: (x: boolean) => void
  @Action(useStore) setFolioNumber!: (x: string) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void

  businessContactFormValid = false
  addressFormValid = false
  hasValidCooperativeType = false
  coopHelpToggle = false

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  /** Array of valid components. Must match validFlags. */
  readonly validComponents = [
    'name-header',
    'cooperative-type-header',
    'office-address-header',
    'registered-office-contact-header'
  ]

  /** Object of valid flags. Must match validComponents. */
  get validFlags (): object {
    return {
      validNameTranslation: this.isTypeCoop ? true : this.getNameTranslationsValid,
      validCooperativeType: this.isTypeCoop ? this.hasValidCooperativeType : true,
      validAddressForm: this.addressFormValid,
      validBusinessContactForm: this.businessContactFormValid
    }
  }

  get addresses (): RegisteredRecordsAddressesIF {
    return this.getDefineCompanyStep.officeAddresses
  }

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
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

    if (this.isBaseCompany) {
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
    } else {
      this.setOfficeAddresses({
        registeredOffice: {
          mailingAddress: defaultAddress,
          deliveryAddress: defaultAddress
        }
      })
    }
  }

  @Watch('getNameTranslationsValid', { deep: true })
  private onNameTranslationsValid (): void {
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.getNameTranslationsValid
    )
  }

  onHasCooperativeType (cooperativeType: CoopTypes): void {
    this.hasValidCooperativeType = !!cooperativeType
    this.setCooperativeType(cooperativeType)
  }

  onBusinessContactInfoValid (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.getNameTranslationsValid
    )
  }

  onOfficeAddressesValid (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.getNameTranslationsValid
    )
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_DEFINE_COMPANY) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#incorporation-define-company {
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

#business-buttons-container {
  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}

header p {
  padding-top: 0.5rem;
}

// Coop Type Help section
.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.coop-type-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #coop-type-help-header {
    display: flex;
    justify-content: center;
  }

  h2, h4 {
    padding: 1rem 0;
  }

  u {
    display: flex;
    direction: rtl;
  }
}

// Vuetify Overrides
:deep(.v-select__selection--comma) {
  overflow: inherit;
}
</style>
