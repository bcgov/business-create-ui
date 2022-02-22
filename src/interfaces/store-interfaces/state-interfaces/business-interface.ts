import { BusinessContactIF, OfficeAddressIF } from '@/interfaces'

export interface BusinessIF {
  businessId: string
  legalName: string
  businessContact: BusinessContactIF
  officeAddress: OfficeAddressIF
  foundingDate: string
}
