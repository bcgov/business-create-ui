<template>
  <div id="restoration-business-information">
    <!-- Registered and Records Office Addresses -->
    <section
      v-show="isEntityType"
      class="mt-10"
    >
      <header id="office-address-header">
        <h2>Registered and Records Office Addresses</h2>

        <template v-if="allowEditingOfficeAddresses">
          <p>
            Enter the Registered Office and Records Office Mailing and Delivery Addresses. All addresses must be
            located in B.C.
          </p>
        </template>
        <template v-else>
          <p>
            The Registered and Records Office are shown with the addresses at the time of dissolution.
          </p>
        </template>
      </header>

      <div
        v-if="allowEditingOfficeAddresses"
        :class="{ 'invalid-section': getShowErrors && !addressFormValid }"
      >
        <OfficeAddresses
          :showErrors="getShowErrors"
          :inputAddresses="officeAddresses"
          @update:addresses="setOfficeAddresses($event)"
          @valid="onAddressFormValidityChange($event)"
        />
      </div>

      <v-card
        v-else
        flat
        class="py-8 px-6"
      >
        <OfficeAddresses
          :inputAddresses="officeAddresses"
          :isEditing="false"
        />
      </v-card>
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
          @valid="onBusinessContactFormValidityChange($event)"
        />
      </v-card>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { AddressIF, ContactPointIF, DefineCompanyIF, EmptyAddress, RegisteredRecordsAddressesIF,
  RestorationStateIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { RestorationTypes, RouteNames } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses
  }
})
export default class RestorationBusinessInformation extends Mixins(CommonMixin) {
  @Getter(useStore) getBusinessContact!: ContactPointIF
  @Getter(useStore) getDefineCompanyStep!: DefineCompanyIF
  @Getter(useStore) getRestoration!: RestorationStateIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isEntityType!: boolean

  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setDefineCompanyStepValidity!: (x: boolean) => void
  @Action(useStore) setIgnoreChanges!: (x: boolean) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void

  // Local variables
  businessContactFormValid = false
  addressFormValid = true
  allowEditingOfficeAddresses = false

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  get officeAddresses (): RegisteredRecordsAddressesIF {
    return this.getDefineCompanyStep.officeAddresses
  }

  /** Called when component is created. */
  created (): void {
    // temporarily ignore data changes
    this.setIgnoreChanges(true)

    // if no addresses were fetched or are empty, set default addresses
    if (this.isEmptyRecordsAddress || this.isEmptyRegisteredAddress) {
      this.setDefaultAddresses()
    }

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  get isEmptyRecordsAddress () : boolean {
    return (
      this.isEmptyAddress(this.officeAddresses.recordsOffice?.mailingAddress) ||
      this.isEmptyAddress(this.officeAddresses.recordsOffice?.deliveryAddress)
    )
  }

  get isEmptyRegisteredAddress () : boolean {
    return (
      this.isEmptyAddress(this.officeAddresses.registeredOffice?.mailingAddress) ||
      this.isEmptyAddress(this.officeAddresses.registeredOffice?.deliveryAddress)
    )
  }

  /** Sets default addresses in filing. (Will get overwritten by a fetched draft filing if there is one.) */
  private setDefaultAddresses (): void {
    const defaultAddress: AddressIF = {
      ...EmptyAddress,
      addressRegion: 'BC'
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

  onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  onAddressFormValidityChange (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid
    )
  }

  /** Updates flags when restoration type is set or changes. */
  @Watch('getRestoration.type', { immediate: true })
  private onRestorationTypeChanged (val: RestorationTypes) {
    if (val === RestorationTypes.FULL) {
      this.allowEditingOfficeAddresses = true
      this.addressFormValid = false
    }
    if (val === RestorationTypes.LIMITED) {
      this.allowEditingOfficeAddresses = false
      this.addressFormValid = true
    }
    // else -- should never happen
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.RESTORATION_BUSINESS_INFORMATION) {
      // scroll to invalid components
      await this.$nextTick()
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
