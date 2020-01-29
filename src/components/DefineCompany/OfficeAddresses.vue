<template>
  <div id="office-addresses" class="office-address-container">
    <v-card flat>
      <ul class="list address-list" v-bind:class="{ 'show-address-form': showAddressForm }">
        <!-- Registered Office Section -->
        <div class="address-edit-header" v-if="showAddressForm">
          <label class="address-edit-title">Registered Office</label>
        </div>

        <!-- Registered Delivery Address -->
        <li class="address-list-container">
          <div class="meta-container">
            <label v-if="!showAddressForm">Registered Office</label>
            <label v-else>Delivery Address</label>

            <div class="meta-container__inner">
              <label v-if="!showAddressForm"><strong>Delivery Address</strong></label>

              <div class="address-wrapper">
                <delivery-address
                  :address="deliveryAddress"
                  :editing="showAddressForm"
                  :schema="addressSchema"
                  @update:address="updateAddress('deliveryAddress', deliveryAddress, $event)"
                  @valid="updateAddressValid('deliveryAddress', $event)"/>
              </div>
            </div>
          </div>
        </li>

        <!-- Registered Mailing Address -->
        <li class="address-list-container">
          <div class="meta-container">
            <label>{{ showAddressForm ? "Mailing Address" : "" }}</label>
            <div class="meta-container__inner">
              <label v-if="!showAddressForm && !isSame(deliveryAddress, mailingAddress, 'actions')">
                <strong>Mailing Address</strong>
              </label>
              <div class="form__row">
                <v-checkbox
                  class="inherit-checkbox"
                  label="Same as Delivery Address"
                  v-if="showAddressForm"
                  v-model="inheritDeliveryAddress"
                  v-on:change="setMailingAddressToDeliveryAddress()"/>
              </div>
              <div
                class="address-wrapper"
                v-if="!isSame(deliveryAddress, mailingAddress, 'actions') || showAddressForm">
                <mailing-address
                  v-if="!showAddressForm || !inheritDeliveryAddress"
                  :address="mailingAddress"
                  :editing="showAddressForm"
                  :schema="addressSchema"
                  @update:address="updateAddress('mailingAddress', mailingAddress, $event)"
                  @valid="updateAddressValid('mailingAddress', $event)"/>
              </div>
              <span v-else id="sameAsAbove">Mailing Address same as above</span>
            </div>
          </div>
        </li>

        <!--Records Office Address section -->
        <div v-if="entityFilter(EntityTypes.BCOMP)">
          <div class="address-edit-header" v-if="showAddressForm">
            <label class="address-edit-title">Records Office</label>
            <v-checkbox
              class="records-inherit-checkbox"
              label="Same as Registered Office"
              v-if="showAddressForm"
              v-model="inheritRegisteredAddress"
              v-on:change="setRecordOfficeToRegisteredOffice()"/>
          </div>
          <div v-if="!inheritRegisteredAddress">
            <!-- Records Delivery Address -->
            <li class="address-list-container">
              <div class="meta-container">
                <label v-if="!showAddressForm">Records Office</label>
                <label v-else>Delivery Address</label>

                <div class="meta-container__inner">
                  <label v-if="!showAddressForm"><strong>Delivery Address</strong></label>
                  <div class="address-wrapper">
                    <delivery-address
                      :address="recDeliveryAddress"
                      :editing="showAddressForm"
                      :schema="addressSchema"
                      @update:address="updateAddress('recDeliveryAddress', recDeliveryAddress, $event)"
                      @valid="updateAddressValid('recDeliveryAddress', $event)"/>
                  </div>
                </div>
              </div>
            </li>

            <!-- Records Mailing Address -->
            <li class="address-list-container">
              <div class="meta-container">
                <label>{{ showAddressForm ? "Mailing Address" : "" }}</label>
                <div class="meta-container__inner">
                  <label v-if="!isSame(recDeliveryAddress, recMailingAddress, 'actions') && !showAddressForm">
                    <strong>Mailing Address</strong>
                  </label>
                  <div class="form__row">
                    <v-checkbox
                      class="inherit-checkbox"
                      label="Same as Delivery Address"
                      v-if="showAddressForm"
                      v-model="inheritRecDeliveryAddress"
                      v-on:change="setRecordMailingAddressToDeliveryAddress()"/>
                  </div>
                  <div
                    class="address-wrapper"
                    v-if="!isSame(recDeliveryAddress, recMailingAddress, 'actions') || showAddressForm">
                    <mailing-address
                      v-if="!showAddressForm || !inheritRecDeliveryAddress"
                      :address="recMailingAddress"
                      :editing="showAddressForm"
                      :schema="addressSchema"
                      @update:address="updateAddress('recMailingAddress', recMailingAddress, $event)"
                      @valid="updateAddressValid('recMailingAddress', $event)"/>
                  </div>
                  <span v-else>Mailing Address same as above</span>
                </div>
              </div>
            </li>
          </div>

          <div v-else>
            <li class="address-list-container" v-if="!showAddressForm">
              <div class="meta-container">
                <label>Records Office</label>
                <div class="meta-container__inner">
                  <span id="sameAsRegistered">Same as Registered Office</span>
                </div>
              </div>
            </li>
          </div>
        </div>
      </ul>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Watch, Mixins } from 'vue-property-decorator'
import { isEmpty } from 'lodash'

// Schemas
import { officeAddressSchema } from '@/schemas'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

// Interfaces
import { BaseAddressObjIF, IncorporationAddressIf, AddressIF } from '@/interfaces'

// Constants
import { ADDRESSCHANGED } from '@/constants'

// Enums
import { EntityTypes } from '@/enums'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

@Component({
  components: {
    'delivery-address': BaseAddress,
    'mailing-address': BaseAddress
  }
})
export default class OfficeAddresses extends Mixins(CommonMixin, EntityFilterMixin) {
  /**
   * Addresses object from the parent page.
   * If this is null then this is a new filing; otherwise these are the addresses from a draft filing.
   * This will be emitted back to the parent page when the addresses are updated.
   */
  @Prop({ default: null })
  readonly inputAddresses!: IncorporationAddressIf | null;

  private addresses: IncorporationAddressIf | null = this.inputAddresses;

  // Whether to show the editable forms for the addresses (true) or just the static display addresses (false).
  @Prop({ default: true })
  private showAddressForm!: boolean;

  // The two addresses that are the current state of the BaseAddress components.
  private deliveryAddress = {} as AddressIF;
  private mailingAddress = {} as AddressIF;

  // The two addresses that are the current state of the BaseAddress components.
  private recDeliveryAddress = {} as AddressIF;
  private recMailingAddress = {} as AddressIF;

  // Validation events from BaseAddress.
  private deliveryAddressValid: boolean = true;
  private mailingAddressValid: boolean = true;
  private recDeliveryAddressValid: boolean = true;
  private recMailingAddressValid: boolean = true;

  private inheritDeliveryAddress: boolean = true;

  // State of the checkbox for determining whether or not the mailing address is the same as the delivery address
  // For Records Office
  private inheritRecDeliveryAddress: boolean = true;

  // State of the checkbox for determining whether the Record address is the same as the Registered address
  private inheritRegisteredAddress: boolean = true;

  // The Address schema containing Vuelidate rules.
  private addressSchema: {} = officeAddressSchema;

  // Entity Enum
  readonly EntityTypes: {} = EntityTypes;

  /**
   * Lifecycle callback to set up the component when it is mounted.
   */
  private mounted (): void {
    if (this.addresses) {
      this.deliveryAddress = this.addresses.registeredOffice.deliveryAddress
      this.mailingAddress = this.addresses.registeredOffice.mailingAddress
      this.inheritDeliveryAddress = this.isSame(
        this.addresses.registeredOffice.deliveryAddress,
        this.addresses.registeredOffice.mailingAddress)

      if (this.entityFilter(EntityTypes.BCOMP)) {
        this.recDeliveryAddress = this.addresses.recordsOffice!.deliveryAddress
        this.recMailingAddress = this.addresses.recordsOffice!.mailingAddress
        this.inheritRegisteredAddress = (
          this.isSame(this.addresses.registeredOffice.deliveryAddress, this.addresses.recordsOffice!.deliveryAddress) &&
          this.isSame(this.addresses.registeredOffice.mailingAddress, this.addresses.recordsOffice!.mailingAddress)
        )
        this.inheritRecDeliveryAddress = this.isSame(
          this.addresses.recordsOffice!.deliveryAddress,
          this.addresses.recordsOffice!.mailingAddress)
      }
    }
    this.emitValid()
  }

  // Computed values.
  /**
   * Computed value of whether or not the address form is valid.
   *
   * @returns a boolean that is true if the data on the form is valid, or false otherwise.
   */
  private get formValid (): boolean {
    return (
      this.deliveryAddressValid &&
      (this.inheritDeliveryAddress || this.mailingAddressValid) &&
      this.recDeliveryAddressValid && (this.inheritRecDeliveryAddress || this.recMailingAddressValid)
    )
  }

  // Event Handlers.
  /**
   * Event handler that sets the Registered Office Mailing Address to
   * Registered Office Delivery Address.
   */
  private setMailingAddressToDeliveryAddress () : void {
    if (this.inheritDeliveryAddress) {
      this.mailingAddress = { ...this.deliveryAddress }
      this.emitAddresses()
    }
  }

  private setRecordOfficeToRegisteredOffice () : void {
    if (this.inheritRegisteredAddress) {
      this.recDeliveryAddress = { ...this.deliveryAddress }
      this.recMailingAddress = { ...this.mailingAddress }
      this.emitAddresses()
    }
  }

  private setRecordMailingAddressToDeliveryAddress () : void {
    if (this.inheritRecDeliveryAddress) {
      this.recMailingAddress = { ...this.recDeliveryAddress }
      this.emitAddresses()
    }
  }

  private updateAddress (addressChangedEntity:string, baseAddress: AddressIF, newAddress: AddressIF): void {
    Object.assign(baseAddress, newAddress)
    switch (addressChangedEntity) {
      case 'deliveryAddress':
        if (this.inheritDeliveryAddress) {
          this.mailingAddress = { ...newAddress }
        }
        if (this.inheritRegisteredAddress) {
          this.recDeliveryAddress = { ...newAddress }
          this.recMailingAddress = { ...this.mailingAddress }
        }
        break
      case 'mailingAddress':
        if (this.inheritRegisteredAddress) {
          this.recMailingAddress = { ...newAddress }
        }
        break
      case 'recDeliveryAddress':
        if (this.inheritRecDeliveryAddress) {
          this.recMailingAddress = { ...newAddress }
        }
        break
      default:
        console.log(`Error: Address- ${addressChangedEntity} not found`)
    }
    this.emitAddresses()
  }

  /**
   * Event callback to keep track of the validity of the address.
   *
   * @param valid a boolean indicating the validity of the address.
   */
  private updateAddressValid (addressToValidate: string, isValid: boolean): void {
    switch (addressToValidate) {
      case 'deliveryAddress':
        this.deliveryAddressValid = isValid
        break
      case 'mailingAddress':
        console.log('Mailing Address valid' + isValid)
        this.mailingAddressValid = isValid
        break
      case 'recDeliveryAddress':
        this.recDeliveryAddressValid = isValid
        break
      case 'recMailingAddress':
        this.recMailingAddressValid = isValid
        break
      default:
        console.log(`Error: Address- ${addressToValidate} not found`)
    }
    this.emitValid()
  }

  // Watchers.
  @Watch('formValid')
  private onFormValidityChange (val:boolean): void{
    this.emitValid()
  }

  // Event Emitters.
  /**
   * Emits the valid state of the addresses.
   *
   * @returns a boolean that is true if the address data is valid, false otherwise.
   */
  @Emit('valid')
  private emitValid (): boolean {
    return this.formValid
  }

  /**
   * Emits updated addresses object to the parent page.
   */
  @Emit('update:addresses')
  private emitAddresses (): object {
    if (this.entityFilter(EntityTypes.BCOMP)) {
      return {
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        },
        recordsOffice: {
          deliveryAddress: this.recDeliveryAddress,
          mailingAddress: this.recMailingAddress
        }
      }
    } else {
      return {
        registeredOffice: {
          deliveryAddress: this.deliveryAddress,
          mailingAddress: this.mailingAddress
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.office-address-container {
   padding-top: 1.25rem;
}

.address-list-container {
  padding: 1rem;
}

.v-btn {
  margin: 0;
  min-width: 6rem;
  text-transform: none;
}

.reset-btn {
  margin-top: 0.5rem;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

.meta-container__inner {
  margin-top: 1rem;
}

label:first-child {
  font-weight: 700;
  &__inner {
    flex: 1 1 auto;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    label:first-child {
      flex: 0 0 auto;
      width: 12rem;
    }
  }

  .meta-container__inner {
    flex: 1 1 auto;
    margin-top: 0;
  }
}

.address-list .form {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .address-list .form {
    margin-top: 0rem;
  }
}

// Address Block Layout
.address-wrapper {
  margin-top: 0.5rem;
}

.address-block__actions {
  position: absolute;
  top: 0;
  right: 0;

  .v-btn {
    min-width: 4rem;
  }

  .v-btn + .v-btn {
    margin-left: 0.5rem;
  }
}

// Form Row Elements
.form__row + .form__row {
  margin-top: 0.25rem;
}

.form__btns {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  .v-btn {
    margin: 0;

    + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
}

.inherit-checkbox {
  margin-top: -3px;
  margin-left: -3px;
  padding: 0;
}
.records-inherit-checkbox {
  margin-top: 0rem;
  margin-left: 4.65rem;
  margin-bottom: -1.5rem;
  padding: 0;

  .v-messages {
    display: none !important;
  }
}

// Registered Office Address Form Behavior
.show-address-form {
  li:first-child {
    padding-bottom: 0;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

// Editing Address Form
.address-edit-header {
  display: flex;
  background-color: rgba(1, 51, 102, 0.15);
  padding: 1.25rem;

  address-edit-title {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.375rem;
  }
}
</style>
