import { CertifyIF, DefineCompanyIF } from '@/interfaces'

// State model example
export interface StateModelIF {
  currentDate: string | null;
  certifyState: CertifyIF;
  currentStep: number;
  isSaving: boolean;
  isSavingResuming: boolean;
  isFilingPaying: boolean;
  defineCompanyStep: DefineCompanyIF;
}
