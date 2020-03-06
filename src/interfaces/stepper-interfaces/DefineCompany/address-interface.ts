export interface AddressIF {
    addressCity: string;
    addressCountry: string;
    addressRegion: string;
    deliveryInstructions?: string;
    postalCode: string;
    streetAddress: string;
    streetAddressAdditional?: string;
  }

// Interface to define the joint base address response
export interface BaseAddressObjIF {
    deliveryAddress?: AddressIF;
    mailingAddress: AddressIF;
  }

// Interface to define the Bcorps address response
export interface IncorporationAddressIf {
    registeredOffice: BaseAddressObjIF;
    recordsOffice?: BaseAddressObjIF;
}

export interface BaseAddressType extends Vue {
  $refs: any;
}
