import { AddressIF, RolesIF } from '@/interfaces'
import { IncorporatorTypes } from '@/enums'

export interface OrgPersonIF {
  officer: {
    id: string
    partyType: IncorporatorTypes
    firstName: string
    middleName?: string
    lastName: string
    orgName: string
    email?: string
  }
  roles: RolesIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
}
