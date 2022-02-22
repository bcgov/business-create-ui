import { AddressIF } from '@/interfaces'

/** Interface to define the business addresses. */
export interface BusinessAddressIF {
  mailingAddress: AddressIF
  deliveryAddress: AddressIF
}
