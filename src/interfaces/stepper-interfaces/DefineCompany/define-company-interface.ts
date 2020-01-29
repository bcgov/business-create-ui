import { BusinessContactIF } from './business-contact-interface'
import { IncorporationAddressIf } from './address-interface'

export interface DefineCompanyIF {
    valid: boolean
    businessContact : BusinessContactIF;
    officeAddresses : IncorporationAddressIf | null;
}
