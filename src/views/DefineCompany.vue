<template>
  <div>
    <section class="mt-10">
      <header>
        <h2>1. Company Name</h2>
      </header>
      <v-card flat class="step-container">
          <name-request-info />
      </v-card>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header id="office-address-header">
        <h2>2. Registered <span v-if="entityFilter(EntityTypes.BCOMP)">and Records</span> Office Addresses</h2>
        <p>Enter the business' Registered Office <span v-if="entityFilter(EntityTypes.BCOMP)">and Records Office
          </span> Mailing and Delivery Addresses.
        </p>
      </header>
      <OfficeAddresses
        :inputAddresses="addresses"
        @update:addresses="onAddressChange($event)"
        @valid="onAddressFormValidityChange($event)"/>
    </section>

    <section class="mt-10" v-show="isEntityType">
      <header>
        <h2>3. Registered Office Information</h2>
        <p>Enter the contact information for the Registered Office. The Corporate Registry will use this to
           communicate with the company in the future, including sending the following documents and
           notifications: a Certificate of Incorporation, a certified copy of the Incorporation Application,
           a certified copy of the Notice of Articles, payment receipts, and optional notifications such as
           Annual Report reminders.
        </p>
      </header>
      <BusinessContactInfo
        :initialValue="businessContact"
        :isEditing="true"
        :showErrors="showErrors"
        @contactInfoChange="onBusinessContactInfoChange($event)"
        @contactInfoFormValidityChange="onBusinessContactFormValidityChange($event)"/>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF, BusinessContactIF, IncorporationAddressIf } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes } from '@/enums'

// Components
import { BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'
import { NameRequestInfo } from '@/components/common'

@Component({
  components: {
    BusinessContactInfo,
    NameRequestInfo,
    OfficeAddresses
  }
})
export default class DefineCompany extends Mixins(EntityFilterMixin) {
  // State
  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF

  @State(state => state.stateModel.defineCompanyStep.officeAddresses)
  readonly addresses!: IncorporationAddressIf

  // Global getters
  @Getter isEntityType!: GetterIF

  // Global actions
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF

  private businessContactFormValid: boolean = false
  private addressFormValid: boolean = false

  // Entity Enum
  readonly EntityTypes = EntityTypes

  mounted () {
    // always false initially
    // this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid)
  }

  private onBusinessContactInfoChange (businessContact: BusinessContactIF): void {
    this.setBusinessContact(businessContact)
  }

  private onBusinessContactFormValidityChange (validity: boolean): void {
    this.businessContactFormValid = validity
    this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid)
  }

  private onAddressChange (address: IncorporationAddressIf): void {
    this.setOfficeAddresses(address)
  }

  private onAddressFormValidityChange (validity: boolean): void {
    this.addressFormValid = validity
    this.setDefineCompanyStepValidity(this.businessContactFormValid && this.addressFormValid)
  }

  private get showErrors (): boolean {
    return Boolean(this.$route.query.showErrors)
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
</style>
