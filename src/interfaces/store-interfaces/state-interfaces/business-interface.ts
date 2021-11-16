import { BaseAddressObjIF, BusinessContactIF } from '@/interfaces'

export interface BusinessIF {
  businessId: string
  legalName: string
  businessContact: BusinessContactIF
  officeAddress: BaseAddressObjIF
  foundingDate: string
}
