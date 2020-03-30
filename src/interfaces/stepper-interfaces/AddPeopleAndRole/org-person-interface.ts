import { AddressIF } from '@/interfaces'
import { Roles, IncorporatorTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: number | null
    partyType: IncorporatorTypes;
    firstName: string;
    middleName?: string;
    lastName: string;
    orgName: string
  },
  roles: Roles[];
  mailingAddress: AddressIF;
  deliveryAddress?: AddressIF;
}
