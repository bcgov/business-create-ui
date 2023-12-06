import { AddressIF } from '@/interfaces'
import { AmalgamatingStatuses, AmalgamationTypes, AmlRoles } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/** Interface for LEAR amalgamating businesses. */
interface AmalgamatingLearIF {
  type: 'lear'

  // properties in schema:
  role: AmlRoles
  identifier: string

  // properties for UI only:
  name?: string
  email?: string
  legalType?: CorpTypeCd
  address?: AddressIF
  goodStanding?: boolean
  status?: AmalgamatingStatuses
}

/** Interface for foreign amalgamating businesses. */
interface AmalgamatingForeignIF {
  type: 'foreign'

  // properties in schema:
  role: AmlRoles
  foreignJurisdiction: {
    region?: string
    country: string
  }
  legalName: string
  corpNumber: string

  // properties for UI only:
  status?: AmalgamatingStatuses
}

// type alias (union type)
export type AmalgamatingBusinessIF = AmalgamatingLearIF | AmalgamatingForeignIF

/** State interface for amalgamation-specific data. */
export interface AmalgamationStateIF {
  amalgamatingBusinesses: Array<AmalgamatingBusinessIF>
  amalgamatingBusinessesValid: boolean
  courtApproval: boolean
  type: AmalgamationTypes
}
