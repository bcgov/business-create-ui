import { CertifyIF, DefineCompanyIF, TombStoneIF } from '@/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombStoneIF,
  currentDate: string;
  certifyState: CertifyIF;
  currentStep: number;
  isSaving: boolean;
  isSavingResuming: boolean;
  isFilingPaying: boolean;
  defineCompanyStep: DefineCompanyIF;
}
