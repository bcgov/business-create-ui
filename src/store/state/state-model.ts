import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  stateText: 'Base State Text',
  currentDate: null,
  certifyStatementResource: null,
  certifyState: {
    certifyFormValid: false,
    certifiedBy: null
  }
}
