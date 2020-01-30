import { BusinessContactIF, NameRequestIF, IncorporationAddressIf } from '@/interfaces'

export interface DefineCompanyIF {
    valid: boolean
    businessContact : BusinessContactIF,
    officeAddresses : IncorporationAddressIf | null
}
