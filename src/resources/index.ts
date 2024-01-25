import {
  AmalgamationResourceIF,
  ContinuationInResourceIF,
  DissolutionResourceIF,
  IncorporationResourceIF,
  RegistrationResourceIF,
  RestorationResourceIF
} from '@/interfaces'

import {
  AmalgamationRegResourceBc,
  AmalgamationRegResourceBen,
  AmalgamationRegResourceCc,
  AmalgamationRegResourceUlc
} from './AmalgamationRegular/'

import {
  AmalgamationShortResourceBc,
  AmalgamationShortResourceBen,
  AmalgamationShortResourceCc,
  AmalgamationShortResourceUlc
} from './AmalgamationShort/'

import {
  ContinuationInResourceBc,
  ContinuationInResourceBen,
  ContinuationInResourceCc,
  ContinuationInResourceUlc
} from './ContinuationIn/'

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

export const AmalgamationRegResources: Array<AmalgamationResourceIF> = [
  AmalgamationRegResourceBc,
  AmalgamationRegResourceBen,
  AmalgamationRegResourceCc,
  AmalgamationRegResourceUlc
]

export const AmalgamationShortResources: Array<AmalgamationResourceIF> = [
  AmalgamationShortResourceBc,
  AmalgamationShortResourceBen,
  AmalgamationShortResourceCc,
  AmalgamationShortResourceUlc
]

export const ContinuationInResources: Array<ContinuationInResourceIF> = [
  ContinuationInResourceBc,
  ContinuationInResourceBen,
  ContinuationInResourceCc,
  ContinuationInResourceUlc
]

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

export * from './BreadcrumbResource'
