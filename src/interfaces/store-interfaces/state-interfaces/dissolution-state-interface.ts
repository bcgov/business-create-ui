import { DissolutionTypes } from '@/enums'
import { DissolutionStatementIF, OrgPersonIF } from '@/interfaces'

export interface DissolutionStateIF {
  dissolutionType: DissolutionTypes
  dissolutionDate: string
  dissolutionStatementStep: DissolutionStatementIF
  dissolutionDateFieldError: string
  custodianOfRecords: {
    valid: boolean,
    custodian: OrgPersonIF
  }
  hasCertificateDestroyed: boolean
}
