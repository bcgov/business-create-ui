import { ResourceIF } from '@/interfaces'
import { BenefitCompanyResource } from '@/resources/benefitCompany'
import { LimitedCompanyResource } from '@/resources/limitedCompany'
import { UnlimitedCompanyResource } from '@/resources/unlimitedCompany'
import { CommunityContributionCompanyResource } from '@/resources/communityContributionCompany'
import { CooperativeResource } from '@/resources/cooperative'

export const CompanyResources: Array<ResourceIF> = [
  BenefitCompanyResource,
  LimitedCompanyResource,
  UnlimitedCompanyResource,
  CommunityContributionCompanyResource,
  CooperativeResource
]
