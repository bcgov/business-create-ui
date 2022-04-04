import { AddressIF, EmptyAddress, RolesIF } from '@/interfaces'
import { PartyTypes } from '@/enums'

export interface OfficerIF {
  id?: string
  partyType: PartyTypes
  firstName: string
  middleName?: string
  lastName: string
  organizationName: string
  email?: string
  incorpNumber?: string // GP partners only
  businessNumber?: string // SP proprietors and GP partners only
}

export interface OrgPersonIF {
  officer: OfficerIF
  roles: RolesIF[]
  mailingAddress: AddressIF
  deliveryAddress?: AddressIF
  inheritMailingAddress?: boolean
  confirmBusiness?: boolean // SP proprietors and GP partners only // for UI use only
}

export const EmptyOfficer: OfficerIF = {
  id: null,
  firstName: '',
  lastName: '',
  middleName: '',
  organizationName: '',
  partyType: null
}

// NB: use cloneDeep when assigning EmptyOrgPerson
export const EmptyOrgPerson: OrgPersonIF = {
  officer: { ...EmptyOfficer },
  roles: [],
  mailingAddress: { ...EmptyAddress }
}
