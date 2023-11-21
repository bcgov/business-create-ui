import { AmalgamationTypes, ApprovalTypes, RelationshipTypes } from '@/enums'
import { CourtOrderIF } from '@/interfaces'

export interface AmalgamationStateIF {
  applicationDate?: string // YYYY-MM-DD
  approvalType: ApprovalTypes
  approvalTypeValid: boolean
  businessNameValid: boolean
  courtOrder?: CourtOrderIF
  expiry?: string // YYYY-MM-DD
  noticeDate?: string // YYYY-MM-DD
  relationships?: RelationshipTypes[]
  restorationTypeValid: boolean
  type: AmalgamationTypes
}
