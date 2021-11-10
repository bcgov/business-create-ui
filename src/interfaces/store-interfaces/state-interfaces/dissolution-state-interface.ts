import { DissolutionTypes } from '@/enums'
import { DissolutionStatementIF } from '@/interfaces'

export interface DissolutionStateIF {
  dissolutionType: DissolutionTypes
  dissolutionStatementStep: DissolutionStatementIF
  hasCertificateDestroyed: boolean
}
