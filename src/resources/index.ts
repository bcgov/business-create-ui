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
  AmalgamationRegResourceUlc,
  AmalgamationRegResourceC,
  AmalgamationRegResourceCben,
  AmalgamationRegResourceCcc,
  AmalgamationRegResourceCul
} from './AmalgamationRegular/'

import {
  AmalgamationShortResourceBc,
  AmalgamationShortResourceBen,
  AmalgamationShortResourceCc,
  AmalgamationShortResourceUlc,
  AmalgamationShortResourceC,
  AmalgamationShortResourceCben,
  AmalgamationShortResourceCcc,
  AmalgamationShortResourceCul
} from './AmalgamationShort/'

import {
  ContinuationInResourceC,
  ContinuationInResourceCben,
  ContinuationInResourceCcc,
  ContinuationInResourceCul
} from './ContinuationIn/'

import {
  DissolutionResourceBc,
  DissolutionResourceBen,
  DissolutionResourceCc,
  DissolutionResourceCp,
  DissolutionResourceGp,
  DissolutionResourceSp,
  DissolutionResourceUlc,
  DissolutionResourceC,
  DissolutionResourceCben,
  DissolutionResourceCcc,
  DissolutionResourceCul
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
  RestorationResourceUlc,
  RestorationResourceC,
  RestorationResourceCben,
  RestorationResourceCcc,
  RestorationResourceCul
} from './Restoration/'

export const AmalgamationRegResources: Array<AmalgamationResourceIF> = [
  AmalgamationRegResourceBc,
  AmalgamationRegResourceBen,
  AmalgamationRegResourceCc,
  AmalgamationRegResourceUlc,
  AmalgamationRegResourceC,
  AmalgamationRegResourceCben,
  AmalgamationRegResourceCcc,
  AmalgamationRegResourceCul
]

export const AmalgamationShortResources: Array<AmalgamationResourceIF> = [
  AmalgamationShortResourceBc,
  AmalgamationShortResourceBen,
  AmalgamationShortResourceCc,
  AmalgamationShortResourceUlc,
  AmalgamationShortResourceC,
  AmalgamationShortResourceCben,
  AmalgamationShortResourceCcc,
  AmalgamationShortResourceCul
]

export const ContinuationInResources: Array<ContinuationInResourceIF> = [
  ContinuationInResourceC,
  ContinuationInResourceCben,
  ContinuationInResourceCcc,
  ContinuationInResourceCul
]

export const DissolutionResources: Array<DissolutionResourceIF> = [
  DissolutionResourceBc,
  DissolutionResourceBen,
  DissolutionResourceCc,
  DissolutionResourceCp,
  DissolutionResourceGp,
  DissolutionResourceSp,
  DissolutionResourceUlc,
  DissolutionResourceC,
  DissolutionResourceCben,
  DissolutionResourceCcc,
  DissolutionResourceCul
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
  RestorationResourceUlc,
  RestorationResourceC,
  RestorationResourceCben,
  RestorationResourceCcc,
  RestorationResourceCul
]

export * from './BreadcrumbResource'
