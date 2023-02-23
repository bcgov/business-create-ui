<template>
  <div id="restoration-business-information">

    <!-- Registered and Records Office Addresses -->
    <section class="mt-10" v-show="isEntityType">
      <header id="office-address-header">
        <h2>Registered and Records Office Addresses</h2>
        <p>Enter the Registered Office and Records Office Mailing and Delivery Addresses. All addresses must be
           located in BC.
        </p>
      </header>

      <div :class="{ 'invalid-section': getShowErrors && !addressFormValid }">
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="addresses"
          @update:addresses="setOfficeAddresses($event)"
          @valid="onAddressFormValidityChange($event)"
        />
      </div>
    </section>

    <!-- Registered Office Contact Information -->
    <section class="mt-10" v-show="isEntityType">
      <header id="registered-office-contact-header">
        <h2>Registered Office Contact Information</h2>
        <p>Enter the contact information for the business. The Corporate Registry will use this to communicate with the
          business in the future, including sending documents and notifications.
        </p>
      </header>

      <v-card flat class="py-8 px-6"
        :class="{ 'invalid-section': getShowErrors && !businessContactFormValid }"
      >
        <BusinessContactInfo
          :initialValue="getBusinessContact"
          :isEditing="true"
          :showErrors="getShowErrors"
          @update="setBusinessContact($event)"
          @valid="onBusinessContactFormValidityChange($event)"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import {
  ActionBindingIF,
  AddressIF,
  ContactPointIF,
  DefineCompanyIF,
  RegisteredRecordsAddressesIF
} from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { CoopTypes, CorpTypeCd, RouteNames } from '@/enums'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses
  },
  mixins: [
    CommonMixin
  ]
})
export default class RestorationBusinessInformation extends Vue {
  @Getter isEntityType!: boolean
  @Getter isBaseCompany!: boolean
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getShowErrors!: boolean
  @Getter getBusinessContact!: ContactPointIF

  @Action setBusinessContact!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  protected businessContactFormValid = false
  protected addressFormValid = false

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  get addresses (): RegisteredRecordsAddressesIF {
    return this.getDefineCompanyStep.officeAddresses as RegisteredRecordsAddressesIF
  }

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // if no addresses were fetched or are 'undefined', set default addresses
    if (this.isEmptyRecordsAddress || this.isEmptyRegisteredAddress) {
      this.setDefaultAddresses()
    }

    // watch data changes once page has loaded (in next tick)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  get isEmptyRecordsAddress () : boolean {
    if (!this.addresses.recordsOffice?.mailingAddress || !this.addresses.recordsOffice?.deliveryAddress) {
      return true
    } else {
      return false
    }
  }

  get isEmptyRegisteredAddress () : boolean {
    if (!this.addresses.registeredOffice?.mailingAddress || !this.addresses.registeredOffice?.deliveryAddress) {
      return true
    } else {
      return false
    }
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

  private onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  private onAddressFormValidityChange (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.RESTORATION_BUSINESS_INFORMATION) {
      // scroll to invalid components
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          addressFormValid: this.addressFormValid,
          businessContactFormValid: this.businessContactFormValid
        },
        [
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

#restoration-business-information {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
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
