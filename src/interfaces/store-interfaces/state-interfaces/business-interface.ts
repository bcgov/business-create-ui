import { ContactPointIF, OfficeAddressIF } from '@/interfaces'

export interface BusinessIF {
  businessId: string
  legalName: string
  businessContact: ContactPointIF
  officeAddress: OfficeAddressIF
  foundingDate: string
}
