import { DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF } from '@/interfaces'

import {
  DissolutionResourceBc,
  DissolutionResourceBen,
  DissolutionResourceCc,
  DissolutionResourceCp,
  DissolutionResourceGp,
  DissolutionResourceSp,
  DissolutionResourceUlc
} from './Dissolution/'

import {
  IncorporationResourceBc,
  IncorporationResourceBen,
  IncorporationResourceCc,
  IncorporationResourceCp,
  IncorporationResourceUlc
} from './Incorporation/'

import {
  RegistrationResourceGp,
  RegistrationResourceSp
} from './Registration/'

export const DissolutionResources: Array<DissolutionResourceIF> = [
  DissolutionResourceBc,
  DissolutionResourceBen,
  DissolutionResourceCc,
  DissolutionResourceCp,
  DissolutionResourceGp,
  DissolutionResourceSp,
  DissolutionResourceUlc
]

export const IncorporationResources: Array<IncorporationResourceIF> = [
  IncorporationResourceBc,
  IncorporationResourceBen,
  IncorporationResourceCc,
  IncorporationResourceCp,
  IncorporationResourceUlc
]

export const RegistrationResources: Array<RegistrationResourceIF> = [
  RegistrationResourceGp,
  RegistrationResourceSp
]

export * from './BreadCrumbResource'
