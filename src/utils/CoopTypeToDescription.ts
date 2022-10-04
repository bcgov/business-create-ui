import { CoopTypes } from '@/enums'

/**
 * Converts the coop type to a description.
 * @param type the coop type
 * @returns the description
 */
export function CoopTypeToDescription (type: CoopTypes): string {
  switch (type) {
    case CoopTypes.COMMUNITY_SERVICE_COOPERATIVE: return 'Community Service Cooperative'
    case CoopTypes.ORDINARY_COOPERATIVE: return 'Ordinary Cooperative'
    case CoopTypes.HOUSING_COOPERATIVE: return 'Housing Cooperative'
  }
  return type // should never happen
}
