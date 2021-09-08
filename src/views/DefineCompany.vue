<template>
  <div>
    <div class="mt-10 company-statement">
      <p v-if="getCompanyTitle">
        <span class="company-statement-label">{{ getCompanyTitle }}:</span>
        {{ getCompanyDescription }}
      </p>
    </div>

    <section class="mt-10">
      <header id="name-request-info-header">
        <h2>1. Name</h2>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasValidNameTranslation }">
        <v-card flat class="step-container">
          <NameRequestInfo @hasNameTranslation="onNameTranslation($event)" />
        </v-card>
      </div>
    </section>

    <section class="mt-10" v-show="isTypeCoop">
      <header id="association-type-header">
        <h2>2. Cooperative Association Type</h2>
        <!-- Help Section -->
        <div class="mt-4">
          <span class="help-btn" @click="coopHelpToggle = !coopHelpToggle">
            <v-icon color="primary" style="padding-right: 5px">mdi-help-circle-outline</v-icon>
            <span v-if="!coopHelpToggle">Help with Cooperative Association Types</span>
            <span v-else>Hide Help</span>
          </span>
          <section v-show="coopHelpToggle" class="coop-type-help">
            <header id="coop-type-help-header"><h2>Help with Cooperative Association Types</h2></header>
            <p class="help-section"><strong>Community Service Cooperatives</strong> are a particular kind of cooperative
              recognized under the Cooperative Association Act. Community Service Cooperatives have a similar status to
              that of non-profit societies. This type of cooperative also requires the inclusion of non-alterable
              clauses in their rules to ensure they operate on a non-profit basis, and their purpose is charitable, or
              to provide health, social, educational, or other community services. Community Service Cooperatives cannot
              be Housing Cooperatives and cannot issue investment shares.
            </p>
            <p class="help-section"><strong>Housing Cooperatives</strong> are a specific type of cooperative
              incorporated under the Cooperative Association Act that provides housing to its members. Members may
              purchase shares to join the Housing Cooperative and elect directors who will govern the cooperative.
              Housing Cooperatives cannot issue investment shares. The Cooperative Association Act details special
              provisions for Housing Cooperatives that need to be considered when deciding to incorporate.
            </p>
            <p class="help-section">An <strong>Ordinary Cooperative</strong> is a cooperative that may have a wide
              range of purposes and is neither a Housing nor a Community Service Cooperative. The cooperative may
              operate as a for-profit association and may issue investment shares.
            </p>
            <u class="help-btn" @click="coopHelpToggle = !coopHelpToggle"><small>Hide Help</small></u>
          </section>
        </div>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !hasValidCooperativeType }">
        <v-card flat class="step-container">
          <CooperativeType
            :showErrors="getShowErrors"
            @hasCooperativeType="onCooperativeType($event)"
          />
        </v-card>
      </div>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header id="office-address-header">
        <h2>{{isTypeCoop ? 3 : 2 }}. Registered <span v-if="!isTypeCoop">and Records</span> Office
          Addresses</h2>
        <p>Enter the Registered Office <span v-if="!isTypeCoop">and Records Office
          </span> Mailing and Delivery Addresses. All addresses must be located in BC.
        </p>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !addressFormValid }">
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="addresses"
          @update:addresses="onAddressChange($event)"
          @valid="onAddressFormValidityChange($event)"
        />
      </div>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header id="registered-office-contact-header">
        <h2>{{isTypeCoop ? 4 : 3 }}. Registered Office Contact Information</h2>
        <p>Enter the contact information for the Registered Office. The Corporate Registry will use this to
           communicate with the company in the future, including sending the following documents and
           notifications: a Certificate of Incorporation, a certified copy of the Incorporation Application,
           a certified copy of the Notice of Articles, payment receipts, and notifications such as
           Annual Report reminders.
        </p>
      </header>
      <div :class="{ 'invalid-section': getShowErrors && !businessContactFormValid }">
        <BusinessContactInfo
          :initialValue="getDefineCompanyStep.businessContact"
          :isEditing="true"
          :showErrors="getShowErrors"
          @contactInfoChange="onBusinessContactInfoChange($event)"
          @contactInfoFormValidityChange="onBusinessContactFormValidityChange($event)"
        />
      </div>
    </section>
    <section class="mt-10" v-if="isEntityType && isPremiumAccount">
      <header id="folio-number-header">
        <h2>{{isTypeCoop ? 5 : 4 }}. Folio / Reference Number (optional)</h2>
        <p>Add an optional Folio or Reference Number about this business for your own tracking purposes.
           This information is not used by the BC Business Registry.
        </p>
      </header>
      <v-card flat class="step-container">
        <FolioNumber
          :initialValue="getDefineCompanyStep.folioNumber"
          :isEditing="true"
          @folioNumberChange="onFolioNumberChange($event)"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  AddressIF,
  BusinessContactIF,
  DefineCompanyIF,
  IncorporationAddressIF
} from '@/interfaces'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

// Enums
import { CoopType, CorpTypeCd, RouteNames } from '@/enums'

// Components
import { BusinessContactInfo, CooperativeType, FolioNumber, OfficeAddresses } from '@/components/DefineCompany'
import { NameRequestInfo } from '@/components/common'

@Component({
  components: {
    BusinessContactInfo,
    CooperativeType,
    FolioNumber,
    NameRequestInfo,
    OfficeAddresses
  }
})
export default class DefineCompany extends Mixins(CommonMixin, EntityFilterMixin) {
  @Getter getCompanyTitle!: string
  @Getter getCompanyDescription!: string
  @Getter isEntityType!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isTypeCoop: boolean
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getValidateSteps!: boolean
  @Getter getShowErrors!: boolean

  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setCooperativeType!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  private businessContactFormValid: boolean = false
  private addressFormValid: boolean = false
  private hasValidNameTranslation: boolean = true
  private hasValidCooperativeType: boolean = false
  private coopHelpToggle: boolean = false

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  private get addresses (): IncorporationAddressIF {
    return this.getDefineCompanyStep.officeAddresses as IncorporationAddressIF
  }

  /** Called when component is created. */
  private created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // if no addresses were fetched, set default addresses
    if (!this.addresses.registeredOffice && !this.addresses.recordsOffice) {
      this.setDefaultAddresses()
    }

    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
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

    if (this.entityFilter(CorpTypeCd.BENEFIT_COMPANY)) {
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

  private onNameTranslation (valid: boolean): void {
    this.hasValidNameTranslation = valid
    this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid &&
      this.hasValidNameTranslation)
  }

  private onCooperativeType (cooperativeType: CoopType): void {
    this.hasValidCooperativeType = !!cooperativeType
    this.setCooperativeType(cooperativeType)
  }

  private onBusinessContactInfoChange (businessContact: BusinessContactIF): void {
    this.setBusinessContact(businessContact)
  }

  private onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid &&
      this.hasValidNameTranslation)
  }

  private onAddressChange (address: IncorporationAddressIF): void {
    this.setOfficeAddresses(address)
  }

  private onAddressFormValidityChange (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid &&
      this.hasValidNameTranslation)
  }

  private onFolioNumberChange (folioNumber: string): void {
    this.setFolioNumber(folioNumber)
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.DEFINE_COMPANY) {
      // Scroll to invalid components.
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          hasValidNameTranslation: this.hasValidNameTranslation,
          hasValidCooperativeType: this.isTypeCoop ? this.hasValidCooperativeType : true,
          addressFormValid: this.addressFormValid,
          businessContactFormValid: this.businessContactFormValid
        },
        [
          'name-request-info-header',
          'association-type-header',
          'office-address-header',
          'registered-office-contact-header'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.step-container {
  margin-top: 1rem;
  padding: 1.25rem;
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
    font-weight: 700;
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

header {
  p {
    padding-top:0.5rem
  }
}

.company-statement-label {
  letter-spacing: -0.04rem;
  font-weight: 700;
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
::v-deep .v-select__selection--comma {
  overflow: inherit;
}
</style>
