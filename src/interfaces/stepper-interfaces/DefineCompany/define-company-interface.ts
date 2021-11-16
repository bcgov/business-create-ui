import { IncorporationAddressIF } from '@/interfaces'
import { CoopType } from '@/enums'

export interface DefineCompanyIF {
    valid: boolean
    cooperativeType: CoopType
    officeAddresses: IncorporationAddressIF | {}
}
