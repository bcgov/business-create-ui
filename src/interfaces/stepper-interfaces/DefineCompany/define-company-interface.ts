import { BusinessContactIF, IncorporationAddressIF } from '@/interfaces'

export interface DefineCompanyIF {
    valid: boolean
    businessContact: BusinessContactIF
    officeAddresses: IncorporationAddressIF | {}
    folioNumber?: string
}
