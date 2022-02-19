/** Interface to define a base address. */
export interface AddressIF {
  streetAddress: string
  streetAddressAdditional?: string
  addressCity: string
  addressRegion: string
  postalCode: string
  addressCountry: string
  deliveryInstructions?: string
}

/** Empty address for initializing address objects. */
export const EmptyAddress: AddressIF = {
  streetAddress: '',
  streetAddressAdditional: '',
  addressCity: '',
  addressRegion: '',
  postalCode: '',
  addressCountry: '',
  deliveryInstructions: ''
}
