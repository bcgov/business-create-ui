import { CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF } from '@/interfaces'
import { PeopleAndRoleIF } from '../stepper-interfaces/AddPeopleAndRole/add-people-role-interface'

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
}
