import { DissolutionTypes } from '@/enums'
import { DissolutionStatementIF, OrgPersonIF } from '@/interfaces'

export interface DissolutionStateIF {
  dissolutionType: DissolutionTypes
  dissolutionStatementStep: DissolutionStatementIF
  custodianOfRecords: {
    valid: boolean,
    custodian: OrgPersonIF
  }
}
