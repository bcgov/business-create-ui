<template>
  <div>
    <section>
      <header>
        <h2>1. Company Name</h2>
      </header>
      <v-card flat class="step-container">
        <div class="meta-container">
          <label>Name Request</label>

          <div class="value name-request">
            <p>Generate a Name Request (NR):</p>

            <v-container id="business-buttons-container" class="list-item justify-space-between">
              <v-btn id="select-bc-btn" large color="primary" :disabled="isEntityType" @click="onClickBC()">
                <span class="font-weight-bold">Benefit Company NR</span>
              </v-btn>

              <v-btn id="select-cp-btn" large color="success" :disabled="isEntityType" @click="onClickCP()">
                <span class="font-weight-bold">Cooperative Association NR</span>
              </v-btn>

              <v-btn id="reset-btn" large :disabled="!isEntityType" @click="onClickReset()">
                <v-icon>mdi-undo</v-icon>
                <span>Reset</span>
              </v-btn>
            </v-container>
          </div>
        </div>
      </v-card>
    </section>
    <section class="mt-4" v-if="isEntityType">
      <header>
        <h2 v-if="entityFilter(EntityTypes.BCOMP)">2. Registered and Records Office Addresses</h2>
        <h2 v-else-if="entityFilter(EntityTypes.COOP)">2. Registered Office Addresses</h2>
        <p v-if="entityFilter(EntityTypes.BCOMP)">
          Enter the business' Registered Office and Records Office Mailing and Delivery Addresses.
        </p>
        <p v-else-if="entityFilter(EntityTypes.COOP)">
          Enter the business' Registered Office Mailing and Delivery Addresses.
        </p>
      </header>
      <OfficeAddresses
        :inputAddresses="addresses"
        @update:addresses="onAddressChange($event)"
        @valid="onAddressFormValidityChange($event)"/>
    </section>
    <section class="mt-4">
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
import { Component, Vue, Mixins } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF, BusinessContactIF, IncorporationAddressIf, AddressIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Enums
import { EntityTypes } from '@/enums'

// Components
import { BusinessContactInfo, OfficeAddresses } from '@/components/DefineCompany'

@Component({
  components: {
    BusinessContactInfo,
    OfficeAddresses
  }
})
export default class DefineCompany extends Mixins(EntityFilterMixin) {
  // State
  @State(state => state.stateModel.defineCompanyStep.businessContact)
  readonly businessContact!: BusinessContactIF

  @State(state => state.stateModel.defineCompanyStep.officeAddresses)
  readonly addresses!: AddressIF

  // Global getters
  @Getter isEntityType!: GetterIF

  // Global actions
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF

  private businessContactFormValid: boolean = false
  private addressFormValid: boolean = false

  // Entity Enum
  readonly EntityTypes: {} = EntityTypes

  /**
   * Method called when Benefit Company button is clicked.
   */
  private onClickBC (): void {
    // Placeholder to assign the NR Data we are expecting *Development Purpose*
    this.setNameRequestState({ nrNumber: 'NR7654321', entityType: EntityTypes.BCOMP, filingId: null })
  }

  /**
   * Method called when Cooperative Association button is clicked.
   */
  private onClickCP (): void {
    // Placeholder to assign the NR Data we are expecting *Development Purpose*
    this.setNameRequestState({ nrNumber: 'NR7654321', entityType: EntityTypes.COOP, filingId: null })
  }

  /**
   * Method called when Reset Entity Type button is clicked.
   */
  private onClickReset (): void {
    this.setNameRequestState({})
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
