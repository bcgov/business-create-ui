import { PersonIF } from '@/interfaces'

export interface SpecialResolutionIF {
  resolutionDate: string
  resolution: string
  signingDate: string
  signatory: PersonIF
}

export interface ResolutionIF {
  date: string
  id: number
  type: string
}
