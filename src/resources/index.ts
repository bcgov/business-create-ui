import { DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF } from '@/interfaces'

import {
  BenefitCompanyResource,
  CommunityContributionCompanyResource,
  CooperativeResource,
  LimitedCompanyResource,
  UnlimitedCompanyResource
} from './Incorporations'

import {
  SoleProprietorshipResource,
  GeneralPartnershipResource
} from './Registrations'

import {
  BenefitCompanyDissolutionResource,
  CommunityContributionCompanyDissolutionResource,
  CooperativeDissolutionResource,
  LimitedCompanyDissolutionResource,
  UnlimitedDissolutionResource,
  soloPropCompanyDissolutionResource
} from './Dissolutions'

export const IncorporationResources: Array<IncorporationResourceIF> = [
  BenefitCompanyResource,
  CommunityContributionCompanyResource,
  CooperativeResource,
  LimitedCompanyResource,
  UnlimitedCompanyResource
]

export const RegistrationResources: Array<RegistrationResourceIF> = [
  SoleProprietorshipResource,
  GeneralPartnershipResource
]

export const DissolutionResources: Array<DissolutionResourceIF> = [
  BenefitCompanyDissolutionResource,
  CommunityContributionCompanyDissolutionResource,
  CooperativeDissolutionResource,
  LimitedCompanyDissolutionResource,
  UnlimitedDissolutionResource,
  soloPropCompanyDissolutionResource
]

export * from './BreadCrumbResource'
