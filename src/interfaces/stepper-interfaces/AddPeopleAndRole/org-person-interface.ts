import { AddressIF, RolesIF } from '@/interfaces'
import { IncorporatorTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: number | null
    partyType: IncorporatorTypes;
    firstName: string;
    middleName?: string;
    lastName: string;
    orgName: string
  },
  roles: RolesIF[];
  mailingAddress: AddressIF;
  deliveryAddress?: AddressIF;
}
