import { DissolutionResourceIF, IncorporationResourceIF } from '@/interfaces'
import {
  BenefitCompanyResource,
  CommunityContributionCompanyResource,
  CooperativeResource,
  LimitedCompanyResource,
  UnlimitedCompanyResource
} from './Incorporations'

import {
  BenefitCompanyDissolutionResource,
  CommunityContributionCompanyDissolutionResource,
  CooperativeDissolutionResource,
  LimitedCompanyDissolutionResource,
  UnlimitedDissolutionResource
} from './Dissolutions'

export const IncorporationResources: Array<IncorporationResourceIF> = [
  BenefitCompanyResource,
  CommunityContributionCompanyResource,
  CooperativeResource,
  LimitedCompanyResource,
  UnlimitedCompanyResource
]

export const DissolutionResources: Array<DissolutionResourceIF> = [
  BenefitCompanyDissolutionResource,
  CommunityContributionCompanyDissolutionResource,
  CooperativeDissolutionResource,
  LimitedCompanyDissolutionResource,
  UnlimitedDissolutionResource
]

export * from './BreadCrumbResource'
