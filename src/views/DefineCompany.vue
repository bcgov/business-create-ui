<template>
  <div>
    <div class="mt-10 company-statement">
      <p v-if="getCompanyTitle">
        <span class="company-statement-label">{{ getCompanyTitle }}:</span>
        {{ getCompanyDescription }}
      </p>
    </div>

    <section class="mt-10">
      <header>
        <h2>1. Company Name</h2>
      </header>
      <div :class="{ 'invalid-section': showErrors && !hasValidNameTranslation }">
        <v-card flat class="step-container">
          <name-request-info @hasNameTranslation="onNameTranslation($event)"/>
        </v-card>
      </div>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header id="office-address-header">
        <h2>2. Registered <span v-if="!entityFilter(CorpTypeCd.COOP)">and Records</span> Office Addresses</h2>
        <p>Enter the business' Registered Office <span v-if="!entityFilter(CorpTypeCd.COOP)">and Records Office
          </span> Mailing and Delivery Addresses.
        </p>
      </header>
      <div :class="{ 'invalid-section': showErrors && !addressFormValid }">
        <OfficeAddresses
          :inputAddresses="addresses"
          @update:addresses="onAddressChange($event)"
          @valid="onAddressFormValidityChange($event)"
        />
      </div>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header>
        <h2>3. Registered Office Contact Information</h2>
        <p>Enter the contact information for the Registered Office. The Corporate Registry will use this to
           communicate with the company in the future, including sending the following documents and
           notifications: a Certificate of Incorporation, a certified copy of the Incorporation Application,
           a certified copy of the Notice of Articles, payment receipts, and notifications such as
           Annual Report reminders.
        </p>
      </header>
      <div :class="{ 'invalid-section': showErrors && !businessContactFormValid }">
        <BusinessContactInfo
          :initialValue="getDefineCompanyStep.businessContact"
          :isEditing="true"
          :showErrors="showErrors"
          @contactInfoChange="onBusinessContactInfoChange($event)"
          @contactInfoFormValidityChange="onBusinessContactFormValidityChange($event)"
        />
      </div>
    </section>
    <section class="mt-10" v-if="isEntityType && isPremiumAccount">
      <header id="folio-number-header">
        <h2>4. Folio / Reference Number (optional)</h2>
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
import { Component, Mixins, Vue } from 'vue-property-decorator'
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
import { EntityFilterMixin } from '@/mixins'

// Enums
import { CorpTypeCd } from '@/enums'

// Components
import { BusinessContactInfo, FolioNumber, OfficeAddresses } from '@/components/DefineCompany'
import { NameRequestInfo } from '@/components/common'

@Component({
  components: {
    BusinessContactInfo,
    FolioNumber,
    NameRequestInfo,
    OfficeAddresses
  }
})
export default class DefineCompany extends Mixins(EntityFilterMixin) {
  @Getter getCompanyTitle!: string
  @Getter getCompanyDescription!: string
  @Getter isEntityType!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getValidateSteps!: boolean

  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  private businessContactFormValid: boolean = false
  private addressFormValid: boolean = false
  private hasValidNameTranslation: boolean = true

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

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors) && this.getValidateSteps
  }
}
</script>

<style lang="scss" scoped>
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
</style>
