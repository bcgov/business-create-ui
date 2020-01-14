import { CertifyStatementIF } from '../resource-interfaces/certifyStatement-interface'
import { CertifyIF } from '../stepper-interfaces/certify-interface'

// State model example
export interface StateModelIF {
  stateText: string | undefined,
  currentDate: string,
  certifyStatementResource: CertifyStatementIF
  certifyState: CertifyIF
}
