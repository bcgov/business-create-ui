import { BusinessContactIF, IncorporationAddressIf } from '@/interfaces'

export interface DefineCompanyIF {
    valid: boolean
    businessContact: BusinessContactIF
    officeAddresses: IncorporationAddressIf | {}
    folioNumber?: string
}
