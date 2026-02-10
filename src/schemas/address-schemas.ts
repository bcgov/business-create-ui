import { required, maxLength } from 'vuelidate/lib/validators'
import { AddressSchemaIF } from '@/interfaces'
import { isRequiredPostalCode, isValidPostalCode } from '@bcrs-shared-components/validators'

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
    maxLength: maxLength(7), // max for Canada (as per isCanada validator above)
    isValidPostalCode
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
    maxLength: maxLength(7), // max for Canada (as per isCanada validator above)
    isValidPostalCode
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
    isRequiredPostalCode,
    maxLength: maxLength(15),
    isValidPostalCode
  },
  deliveryInstructions: {
    maxLength: maxLength(80)
  }
}

export const RegistrationDeliveryAddressSchema = OfficeAddressSchema
export const RegistrationMailingAddressSchema = PersonAddressSchema
