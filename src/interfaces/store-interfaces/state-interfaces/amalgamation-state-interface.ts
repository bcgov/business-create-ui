import { AddressIF } from '@/interfaces'
import { AmlStatuses, AmalgamationTypes, AmlRoles, AmlTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/** Interface for LEAR amalgamating businesses. */
interface AmalgamatingLearIF {
  type: AmlTypes.LEAR

  // properties in schema:
  role: AmlRoles
  identifier: string

  // properties for UI only:
  name?: string
  email?: string
  legalType?: CorpTypeCd
  address?: AddressIF
  status?: AmlStatuses // computed status (base on business rules)
  isNotInGoodStanding?: boolean // whether business is in good standing
  isFutureEffective?: boolean // whether business has a FE filing
  isLimitedRestoration?: boolean // whether business is in limited restoration
}

/** Interface for foreign amalgamating businesses. */
interface AmalgamatingForeignIF {
  type: AmlTypes.FOREIGN

  // properties in schema:
  role: AmlRoles
  foreignJurisdiction: {
    region?: string
    country: string
  }
  legalName: string
  corpNumber: string

  // properties for UI only:
  status?: AmlStatuses
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
