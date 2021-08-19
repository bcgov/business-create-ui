import { BusinessContactIF, IncorporationAddressIF } from '@/interfaces'
import { CoopType } from '@/enums'

export interface DefineCompanyIF {
    valid: boolean
    cooperativeType: CoopType
    businessContact: BusinessContactIF
    officeAddresses: IncorporationAddressIF | {}
    folioNumber?: string
}
