import { CertifyStatementIF, IncorporationAgreementTypeIF, ResourceIF, StepIF } from '@/interfaces'

/** The company rules and values based on entity type. */
export const getCompanyResources = (state: any): ResourceIF => {
  return state.resourceModel
}

/** The completing party statement resources. */
export const getCompletingPartyStatement = (state: any): CertifyStatementIF => {
  return state.resourceModel.reviewAndConfirm.completingPartyStatement
}

/** The incorporation agreement options. */
export const getIncorporationAgreement = (state: any): IncorporationAgreementTypeIF => {
  return state.resourceModel.incorporationAgreement
}

/** The minimum directors required. */
export const getMinimumDirectorCount = (state: any): number => {
  return state.resourceModel.directors.countMinimum
}

/** Returns the array of steps. */
export const getSteps = (state: any): Array<StepIF> => {
  return state.resourceModel.steps
}
