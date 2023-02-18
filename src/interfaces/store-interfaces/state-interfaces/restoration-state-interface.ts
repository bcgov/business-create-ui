import { ApprovalTypes, CorpTypeCd, RestorationTypes, RelationshipTypes } from '@/enums'
import { CourtOrderIF } from '@/interfaces/filing-interfaces/court-order-interface'

export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessInfoValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  type: RestorationTypes
  expiry?: string // YYYY-MM-DD
  noticeDate?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  restorationTypeValid: boolean
  // defineBusinessValid: boolean
  // startDate: string
  // businessAddress: BusinessAddressIF
  // businessNumber?: string
}
