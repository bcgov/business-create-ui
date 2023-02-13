import { ApprovalTypes, CorpTypeCd, RestorationTypes, RelationshipTypes } from '@/enums'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  approvalType: ApprovalTypes
  businessInfoValid: boolean
  businessNameValid: boolean
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  restorationTypeValid: boolean
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
