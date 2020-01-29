import { BaseAddressObjIF } from '@/interfaces/address-interfaces/address-interface'

export interface IncorporationFilingIF {
  filing: {
    header: {
      name: string
      certifiedBy: string
      email: string
      date: string
    },
    incorporationApplication: {
      nameRequest: {
        nrNumber: string
        legalType: string
      },
      offices: {
        registeredOffice: BaseAddressObjIF
        recordsOffice?: BaseAddressObjIF
      },
      contactPoint: {
        email: string
        phone: string
      }
    }
  }
}
