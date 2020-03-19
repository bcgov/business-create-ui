import { BaseAddressObjIF } from '@/interfaces'

export interface OrgPersonIF {
  person: {
    id: number | null
    partyType: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    orgName: string
  },
  roles: string[];
  address: BaseAddressObjIF;
}
