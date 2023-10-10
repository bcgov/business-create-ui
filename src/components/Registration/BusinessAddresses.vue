<template>
  <div id="business-addresses">
    <!-- EDIT SECTION -->
    <template v-if="isEditing">
      <!-- Mailing Address -->
      <v-row
        no-gutters
        class="edit-section"
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label class="title-label">Mailing Address</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <MailingAddress
            id="address-mailing"
            ref="mailingAddress"
            :address="mailingAddress"
            :editing="true"
            :schema="RegistrationMailingAddressSchema"
            @update:address="updateAddress(MAILING_ADDRESS, $event)"
            @valid="updateAddressValid(MAILING_ADDRESS, $event)"
          />
        </v-col>
      </v-row>

      <!-- Delivery Address -->
      <v-row
        no-gutters
        class="edit-section"
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label class="title-label">Delivery Address</label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <v-checkbox
            id="same-as-mailing-checkbox"
            v-model="inheritMailingAddress"
            class="inherit-checkbox"
            hide-details
            label="Same as Mailing Address"
            :disabled="checkboxDisabled"
            noPoBox="true"
            @update:modelValue="onCheckboxChanged()"
          />
          <template
            v-if="!isSame(mailingAddress, deliveryAddress, ['actions']) || !inheritMailingAddress"
          >
            <DeliveryAddress
              v-if="!inheritMailingAddress"
              id="address-delivery"
              ref="deliveryAddress"
              class="pt-6"
              :address="deliveryAddress"
              :editing="true"
              :schema="RegistrationDeliveryAddressSchema"
              :noPoBox="true"
              @update:address="updateAddress(DELIVERY_ADDRESS, $event)"
              @valid="updateAddressValid(DELIVERY_ADDRESS, $event)"
            />
          </template>
        </v-col>
      </v-row>
    </template>

    <!-- SUMMARY SECTION -->
    <template v-else>
      <v-row
        no-gutters
        class="summary-section"
      >
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label class="summary-section-title">Business Addresses</label>
        </v-col>

        <v-col
          cols="12"
          sm="4"
          class="pr-4 pt-4 pt-sm-0"
        >
          <label class="summary-section-header">Mailing Address</label>
          <div v-if="isEmptyAddress(mailingAddress)">
            (Not entered)
          </div>
          <MailingAddress
            v-else
            :address="mailingAddress"
            :editing="false"
          />
        </v-col>

        <v-col
          cols="12"
          sm="4"
          class="pr-4 pt-4 pt-sm-0"
        >
          <label class="summary-section-header">Delivery Address</label>
          <div v-if="isEmptyAddress(deliveryAddress)">
            (Not entered)
          </div>
          <div v-else-if="isSame(mailingAddress, deliveryAddress)">
            Same as Mailing Address
          </div>
          <DeliveryAddress
            v-else
            :address="deliveryAddress"
            :editing="false"
          />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Emit, mixins, Prop, Watch } from 'vue-facing-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { isEmpty, isEqual } from 'lodash'
import { BaseAddress } from '@bcrs-shared-components/base-address'
import { RegistrationMailingAddressSchema, RegistrationDeliveryAddressSchema } from '@/schemas'
import { CommonMixin } from '@/mixins'
import { AddressIF, BusinessAddressIF, RegistrationStateIF } from '@/interfaces'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'

const REGION_BC = 'BC'
const COUNTRY_CA = 'CA'

// default address in BC, Canada
const DefaultAddress: AddressIF = {
  streetAddress: '',
  streetAddressAdditional: '',
  addressCity: '',
  addressRegion: REGION_BC,
  postalCode: '',
  addressCountry: COUNTRY_CA,
  deliveryInstructions: ''
}

@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  }
})
export default class BusinessAddresses extends mixins(CommonMixin) {
  // Refs for BaseAddress components so we can access form validation
  $refs!: {
    mailingAddress: any
    deliveryAddress: any
  }

  /**
   * Whether to show the editable forms for the addresses (true)
   * or just the static display addresses (false).
   */
  @Prop({ required: true }) readonly isEditing!: boolean

  /** Whether to show errors (editing mode only). */
  @Prop({ required: true }) readonly showErrors!: boolean

  @Getter(useStore) getRegistration!: RegistrationStateIF

  @Action(useStore) setRegistrationBusinessAddress!: (x: BusinessAddressIF) => void

  // BaseAddress state variables
  // (Note that if the initial value is undefined, the class property will not be
  // reactive, which means the changes for the properties will not be detected.)
  mailingAddress = null as AddressIF
  deliveryAddress = null as AddressIF
  private mailingAddressValid = false
  private deliveryAddressValid = false

  // State of checkbox
  inheritMailingAddress = false
  checkboxDisabled = false

  // Misc for template
  readonly RegistrationMailingAddressSchema = RegistrationMailingAddressSchema
  readonly RegistrationDeliveryAddressSchema = RegistrationDeliveryAddressSchema
  readonly MAILING_ADDRESS = 'mailingAddress'
  readonly DELIVERY_ADDRESS = 'deliveryAddress'

  /** Whether the addresses form is valid. */
  get isFormValid (): boolean {
    return (this.mailingAddressValid && (this.deliveryAddressValid || this.inheritMailingAddress))
  }

  /** Returns true if the address object is empty or with only with default values. */
  isEmptyAddress (address: AddressIF): boolean {
    return (
      isEmpty(address) ||
      this.isSame(address, EmptyAddress) ||
      this.isSame(address, DefaultAddress)
    )
  }

  /** Called when component is created. */
  created (): void {
    // don't allow "same as" if mailing address is not in BC/Canada
    this.checkboxDisabled = (this.mailingAddress.addressRegion !== REGION_BC ||
      this.mailingAddress.addressCountry !== COUNTRY_CA)

    // on first load, init checkbox
    this.inheritMailingAddress = this.isSame(this.mailingAddress, this.deliveryAddress)
  }

  /** Called when the "same as" checkbox value has changed. */
  onCheckboxChanged (): void {
    if (this.inheritMailingAddress) {
      // copy mailing address into delivery address
      this.deliveryAddress = { ...this.mailingAddress }
    } else {
      // reset delivery address
      this.deliveryAddress = { ...DefaultAddress }
    }

    this.setRegistrationBusinessAddress({
      mailingAddress: this.mailingAddress,
      deliveryAddress: this.deliveryAddress
    })
  }

  /**
   * Updates the specified address' data.
   * @param addressToUpdate the address type to set the data of
   * @param address the new address data
   */
  updateAddress (addressToUpdate: string, address: AddressIF): void {
    switch (addressToUpdate) {
      case this.MAILING_ADDRESS:
        // avoid reactive looping
        if (isEqual(this.mailingAddress, address)) break

        // assign new address
        this.mailingAddress = address

        // don't allow "same as" if mailing address is not in BC/Canada
        this.checkboxDisabled = (this.mailingAddress.addressRegion !== REGION_BC ||
          this.mailingAddress.addressCountry !== COUNTRY_CA)

        if (this.inheritMailingAddress) {
          // if checkbox is now disabled, uncheck it
          if (this.checkboxDisabled) this.inheritMailingAddress = false
          // update the delivery address
          this.onCheckboxChanged()
        }

        break
      case this.DELIVERY_ADDRESS:
        // avoid reactive looping
        if (isEqual(this.deliveryAddress, address)) break

        // assign new address
        this.deliveryAddress = address

        break
    }

    this.setRegistrationBusinessAddress({
      mailingAddress: this.mailingAddress,
      deliveryAddress: this.deliveryAddress
    })
  }

  /**
   * Updates the specified address' validity.
   * @param addressToValidate the address type to set the validity of
   * @param valid whether the address is valid
   */
  updateAddressValid (addressToValidate: string, valid: boolean): void {
    switch (addressToValidate) {
      case this.MAILING_ADDRESS:
        this.mailingAddressValid = valid
        break
      case this.DELIVERY_ADDRESS:
        this.deliveryAddressValid = valid
        break
    }
    this.emitValid()
  }

  @Watch('isFormValid')
  private onIsFormValidChanged (): void {
    this.emitValid()
  }

  // NB: needs "immediate" to set initial filing data
  // NB: due to "immediate", this is called before created()
  @Watch('getRegistration.businessAddress', { immediate: true })
  private onBusinessAddressChanged (businessAddress: BusinessAddressIF): void {
    if (!businessAddress) {
      // initialize addresses
      this.mailingAddress = { ...EmptyAddress }
      this.deliveryAddress = { ...DefaultAddress }
    } else {
      // assign new addresses
      this.mailingAddress = businessAddress.mailingAddress
      this.deliveryAddress = businessAddress.deliveryAddress
    }
  }

  @Watch('showErrors')
  private onShowErrorsChanged (): void {
    // only show errors in editing mode
    if (this.showErrors && this.isEditing) {
      // validate mailing address
      this.$refs.mailingAddress.$refs.addressForm.validate()
      if (!this.inheritMailingAddress) {
        // validate delivery address
        this.$refs.deliveryAddress.$refs.addressForm.validate()
      }
    }
  }

  /** Emits the valid state of the address form. */
  @Emit('valid')
  private emitValid (): boolean {
    return this.isFormValid
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.edit-section {
  font-size: $px-16;
  color: $gray7;
}

.title-label,
.item-label,
.summary-section-title {
  font-weight: bold;
  color: $gray9;
}

.inherit-checkbox {
  margin-top: 0;
  padding-top: 0;
  margin-left: -3px;
}

.summary-section-header {
  font-size: $px-14;
  font-weight: bold;
}
</style>
