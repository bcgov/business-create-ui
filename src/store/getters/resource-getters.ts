import {
  CertifyStatementIF,
  FilingDataIF,
  HelpSectionIF,
  IncorporationAgreementTypeIF,
  StateIF,
  StepIF
} from '@/interfaces'

//
// The getters in this file return values from the current resource
// model -- in other words, for the currently-selected entity type.
//

/** The company title. */
export const getCompanyTitle = (state: StateIF): string => {
  return state.resourceModel.title
}

/** The company description. */
export const getCompanyDescription = (state: StateIF): string => {
  return state.resourceModel.description
}

/** The company display name. */
export const getCompanyDisplayName = (state: StateIF): string => {
  return state.resourceModel.displayName
}

/** The completing party statement resources. */
export const getCompletingPartyStatement = (state: StateIF): CertifyStatementIF => {
  return state.resourceModel.reviewAndConfirm.completingPartyStatement
}

/** The incorporation agreement help info. */
export const getIncorporationAgreementHelp = (state: StateIF): Array<HelpSectionIF> => {
  return state.resourceModel.incorporationAgreement.helpSection
}

/** The incorporation agreement sample article. */
export const getSampleArticle = (state: StateIF): string => {
  return state.resourceModel.incorporationAgreement.article
}

/** The incorporation agreement options. */
export const getIncorporationAgreementDocuments = (state: StateIF): Array<IncorporationAgreementTypeIF> => {
  return state.resourceModel.incorporationAgreement.documents
}

/** The minimum directors required. */
export const getMinimumDirectorCount = (state: StateIF): number => {
  return state.resourceModel.directors.countMinimum
}

/** The array of steps. */
export const getSteps = (state: StateIF): Array<StepIF> => {
  return state.resourceModel.steps
}

/** The maximum number of steps. */
export const getMaxStep = (state: StateIF): number => {
  const steps = getSteps(state)
  return (steps ? steps.filter(step => step.step !== -1).length : -1)
}

/** The resource filing data. */
export const getFilingData = (state: StateIF): FilingDataIF => {
  return state.resourceModel.filingData
}
