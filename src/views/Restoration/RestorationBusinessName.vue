<template>
  <div id="restoration-business-name">
    <!-- Name -->
    <section class="mt-10">
      <header id="name-header">
        <h2>Name</h2>
      </header>

    </section>

        <!--Restoration Type is here-->
        <section class="mt-10" v-show="isEntityType">
      <header id="office-address-header">
        <h2>Restoration Type</h2>
        <p>Determine the restoration and approval type.</p>
      </header>

      <div :class="{ 'invalid-section': getShowErrors && !isRestorationTypeValid }">
        <RestorationType/>
      </div>
    </section>

    <!-- Folio / Reference Number -->
    <section class="mt-10" v-if="isEntityType && isPremiumAccount">
      <header id="folio-number-header">
        <h2>Folio / Reference Number (Optional)</h2>
        <p>Add an optional Folio or Reference Number about this business for your own tracking purposes.
           This information is not used by the BC Business Registry.
        </p>
      </header>

      <v-card flat class="step-container">
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
import CooperativeType from '@/components/Dissolution/CooperativeType.vue'
import FolioNumber from '@/components/common/FolioNumber.vue'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import RestorationType from '@/components/Restoration/RestorationType.vue'

@Component({
  components: {
    BusinessContactInfo,
    CooperativeType,
    FolioNumber,
    NameRequestInfo,
    OfficeAddresses,
    RestorationType
  },
  mixins: [
    CommonMixin
  ]
})
export default class RestorationBusinessName extends Vue {
  @Getter isEntityType!: boolean
  @Getter isPremiumAccount!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isTypeCoop!: boolean
  @Getter getDefineCompanyStep!: DefineCompanyIF
  @Getter getShowErrors!: boolean
  @Getter getBusinessContact!: ContactPointIF
  @Getter getFolioNumber!: string
  @Getter isRestorationTypeValid!: boolean

  @Action setBusinessContact!: ActionBindingIF
  @Action setCooperativeType!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setIgnoreChanges!: ActionBindingIF

  protected businessContactFormValid = false
  protected addressFormValid = false
  protected hasValidNameTranslation = true
  protected hasValidCooperativeType = false
  protected coopHelpToggle = false

  // Enum for template
  readonly CorpTypeCd = CorpTypeCd

  get addresses (): RegisteredRecordsAddressesIF {
    return this.getDefineCompanyStep.officeAddresses as RegisteredRecordsAddressesIF
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

    if (this.isTypeBcomp) {
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
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.hasValidNameTranslation
    )
  }

  private onCooperativeType (cooperativeType: CoopTypes): void {
    this.hasValidCooperativeType = !!cooperativeType
    this.setCooperativeType(cooperativeType)
  }

  private onBusinessContactFormValidityChange (valid: boolean): void {
    this.businessContactFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.hasValidNameTranslation
    )
  }

  private onAddressFormValidityChange (valid: boolean): void {
    this.addressFormValid = valid
    this.setDefineCompanyStepValidity(
      this.businessContactFormValid &&
      this.addressFormValid &&
      this.hasValidNameTranslation
    )
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_DEFINE_COMPANY) {
      // scroll to invalid components
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          hasValidNameTranslation: this.hasValidNameTranslation,
          hasValidCooperativeType: this.isTypeCoop ? this.hasValidCooperativeType : true,
          addressFormValid: this.addressFormValid,
          businessContactFormValid: this.businessContactFormValid
        },
        [
          'name-header',
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

#restoration-business-name {
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

header {
  p {
    padding-top:0.5rem
  }
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
