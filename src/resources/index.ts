import { DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF, RestorationResourceIF }
  from '@/interfaces'

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

import {
  RestorationResourceBc,
  RestorationResourceBen,
  RestorationResourceCc,
  RestorationResourceUlc
} from './Restoration/'

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

export const RestorationResources: Array<RestorationResourceIF> = [
  RestorationResourceBc,
  RestorationResourceBen,
  RestorationResourceCc,
  RestorationResourceUlc
]

export * from './BreadCrumbResource'
