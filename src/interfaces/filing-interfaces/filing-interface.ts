import { BaseAddressObjIF } from '@/interfaces/address-interfaces/address-interface'

export interface IncorporationFilingIF {
  header: {
    name: string;
    certifiedBy: string;
    email: string;
    date: string;
  },
  incorporation: {
    nameRequest: {
      nrNumber: string;
      legalType: string;
    },
    offices: {
      registeredOffice: BaseAddressObjIF;
      recordsOffice?: BaseAddressObjIF;
    },
    contactPoint: {
      email: string;
      phone: string;
    }
  }
}
