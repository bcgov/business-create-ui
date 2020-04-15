import { CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF, PeopleAndRoleIF,
  ShareStructureIF } from '@/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombStoneIF
  nameRequest: NameRequestIF
  currentDate: string
  certifyState: CertifyIF
  currentStep: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  defineCompanyStep: DefineCompanyIF
  addPeopleAndRoleStep: PeopleAndRoleIF
  createShareStructureStep: ShareStructureIF
  ignoreChanges: boolean
  haveChanges: boolean
}
