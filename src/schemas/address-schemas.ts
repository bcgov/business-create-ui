import { required, maxLength } from 'vuelidate/lib/validators'
import { AddressSchemaIF } from '@/interfaces'

/**
 * Canadian postal code regex (eg, accepts A1A 1A1 or A1A1A1).
 * Ref: https://en.wikipedia.org/wiki/Postal_codes_in_Canada
 */
const CanadaPostalCodeRegex = /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][ ]?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/i

/** Custom validator for postal codes. */
function validatePostalCode (value: string, parentVm: any): boolean {
  // if Canada, validate postal code format
  if (parentVm.addressCountry === 'CA') return CanadaPostalCodeRegex.test(value)
  // otherwise, no validation
  return true
}

// The Address schema containing Vuelidate rules.
// NB: This should match the subject JSON schema.
export const OfficeAddressSchema: AddressSchemaIF = {
  streetAddress: {
    required,
    maxLength: maxLength(50)
  },
  streetAddressAdditional: {
    maxLength: maxLength(50)
  },
  addressCity: {
    required,
    maxLength: maxLength(40)
  },
  addressCountry: {
    required,
    // FUTURE: create new validation function isCountry('CA')
    isCanada: (val: string) => Boolean(val === 'CA')
  },
  addressRegion: {
    maxLength: maxLength(2),
    // FUTURE: create new validation function isRegion('BC')
    isBC: (val: string) => Boolean(val === 'BC')
  },
  postalCode: {
    required,
    maxLength: maxLength(7), // max for Canada (as per line 35)
    validatePostalCode
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

export const CoopOfficeAddressSchema: AddressSchemaIF = {
  streetAddress: {
    required,
    maxLength: maxLength(50)
  },
  streetAddressAdditional: {
    maxLength: maxLength(50)
  },
  addressCity: {
    required,
    maxLength: maxLength(40)
  },
  addressCountry: {
    required,
    // FUTURE: create new validation function isCountry('CA')
    isCanada: (val: string) => Boolean(val === 'CA')
  },
  addressRegion: {
    maxLength: maxLength(2)
  },
  postalCode: {
    required,
    maxLength: maxLength(7), // max for Canada (as per line 67)
    validatePostalCode
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

export const PersonAddressSchema: AddressSchemaIF = {
  streetAddress: {
    required,
    maxLength: maxLength(50)
  },
  streetAddressAdditional: {
    maxLength: maxLength(50)
  },
  addressCity: {
    required,
    maxLength: maxLength(40)
  },
  addressCountry: {
    required
  },
  addressRegion: {
    maxLength: maxLength(2)
  },
  postalCode: {
    required,
    maxLength: maxLength(15),
    validatePostalCode
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

export const RegistrationDeliveryAddressSchema = OfficeAddressSchema
export const RegistrationMailingAddressSchema = PersonAddressSchema
