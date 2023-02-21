import { ApprovalTypes, CorpTypeCd, RestorationTypes, RelationshipTypes } from '@/enums'
import { CourtOrderIF } from '@/interfaces'

// *** TODO: save filing JSON using this:
export interface RestorationNameRequestIF {
  legalName: string
  legalType: CorpTypeCd
  nrNumber: string
}

export interface RestorationStateIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  noticeDate?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  restorationTypeValid: boolean
  type: RestorationTypes
}
