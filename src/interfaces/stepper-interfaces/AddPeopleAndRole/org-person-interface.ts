import { AddressIF, RolesIF } from '@/interfaces'
import { IncorporatorTypes } from '@/enums'
import { EmptyAddress } from '../DefineCompany/address-interface'

export interface OfficerIF {
  id: string
  partyType: IncorporatorTypes
  firstName: string
  middleName?: string
  lastName: string
  orgName: string
  email?: string
}

export interface OrgPersonIF {
  officer: OfficerIF
  roles: RolesIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
}

export const EmptyOfficer: OfficerIF = {
  id: null,
  firstName: '',
  lastName: '',
  middleName: '',
  orgName: '',
  partyType: null,
  email: null
}

// NB: use cloneDeep when assigning EmptyOrgPerson
export const EmptyOrgPerson: OrgPersonIF = {
  officer: { ...EmptyOfficer },
  roles: [],
  mailingAddress: { ...EmptyAddress }
}
