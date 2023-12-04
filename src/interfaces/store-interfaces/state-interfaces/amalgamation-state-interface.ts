import { AmalgamationTypes } from '@/enums'
import { BusinessIF } from '@/interfaces'

export interface AmalgamationStateIF {
  amalgamatingBusinesses: Array<BusinessIF>
  type: AmalgamationTypes
}
