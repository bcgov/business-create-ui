import { AddressIF } from '@/interfaces'

/** Interface to define an office address. */
export interface OfficeAddressIF {
  mailingAddress: AddressIF
  // Delivery Address is required for completing party and offices.
  // Delivery Address is optional for completing party and incorporators.
  deliveryAddress?: AddressIF
}

/** Interface to define an incorporation address. */
export interface RegisteredRecordsAddressesIF {
  registeredOffice: OfficeAddressIF
  // Records Office is required for BCOMPs.
  // Records Office may be optional for other app types.
  recordsOffice?: OfficeAddressIF
  // Custodial Office is present for restoration filings
  custodialOffice?: OfficeAddressIF
}
