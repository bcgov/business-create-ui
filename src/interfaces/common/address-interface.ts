/** Interface to define a base address. */
export interface AddressIF {
  addressCity: string
  addressCountry: string
  addressRegion: string
  addressType?: string
  deliveryInstructions?: string
  postalCode: string
  streetAddress: string
  streetAddressAdditional?: string
}

/** Empty address for initializing address objects. */
export const EmptyAddress: AddressIF = {
  addressCity: '',
  addressCountry: '',
  addressRegion: '',
  addressType: null,
  deliveryInstructions: '',
  postalCode: '',
  streetAddress: '',
  streetAddressAdditional: ''
}
