import { getName } from 'country-list'
import { JurisdictionLocation } from '@bcrs-shared-components/enums'
import { CanJurisdictions, UsaJurisdiction } from '@bcrs-shared-components/jurisdiction/list-data'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { AmlRoles, AmlTypes } from '@/enums'

export function hasPrimaryOrHoldingRole (business: AmalgamatingBusinessIF): boolean {
  return business.role === AmlRoles.HOLDING || business.role === AmlRoles.PRIMARY
}

/** Returns the home jurisdiction label for a foreign or extraprovincial amalgamating business. */
export function getAmalgamationJurisdiction (item: AmalgamatingBusinessIF): string {
  if (item?.type === AmlTypes.COLIN) {
    const jurisdiction = item.jurisdiction
    if (!jurisdiction) return '(Unknown)'
    if (jurisdiction === JurisdictionLocation.FD) return 'Canada (Federal)'
    return CanJurisdictions.find(({ value }) => value === jurisdiction)?.text || jurisdiction
  }

  if (item?.type === AmlTypes.FOREIGN) {
    const { country, region } = item.foreignJurisdiction || {}
    if (!country) return '(Unknown)' // should never happen
    if (region === 'FEDERAL' && country === JurisdictionLocation.CA) return 'Canada (Federal)'

    if (region) {
      if (country === JurisdictionLocation.CA) {
        return CanJurisdictions.find(({ value }) => value === region)?.text || region
      }
      if (country === JurisdictionLocation.US) {
        return UsaJurisdiction.find(({ value }) => value === region)?.text || region
      }
      return region
    }

    return getName(country) || '(Unknown)' // should never happen
  }

  return '(Unknown)'
}

/** Moves the Primary/Holding Business to the front, preserving the remaining order. */
export function movePrimaryOrHoldingBusinessToTop (
  businesses: AmalgamatingBusinessIF[]
): AmalgamatingBusinessIF[] {
  const orderedBusinesses = [ ...businesses ]
  const primaryHoldingIndex = orderedBusinesses.findIndex(hasPrimaryOrHoldingRole)

  if (primaryHoldingIndex > 0) {
    orderedBusinesses.unshift(orderedBusinesses.splice(primaryHoldingIndex, 1)[0])
  }

  return orderedBusinesses
}
