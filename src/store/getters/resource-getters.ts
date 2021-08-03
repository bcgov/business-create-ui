import {
  CertifyStatementIF,
  FilingDataIF,
  HelpSectionIF,
  IncorporationAgreementTypeIF,
  ResourceIF,
  StepIF
} from '@/interfaces'

/** The company rules and values based on entity type. */
export const getCompanyResources = (state: any): ResourceIF => {
  return state.resourceModel
}

/** The company rules and values based on entity type. */
export const getDisplayName = (state: any): string => {
  return state.resourceModel.displayName
}

/** The completing party statement resources. */
export const getCompletingPartyStatement = (state: any): CertifyStatementIF => {
  return state.resourceModel.reviewAndConfirm.completingPartyStatement
}

/** The incorporation agreement help info. */
export const getIncorporationAgreementHelp = (state: any): Array<HelpSectionIF> => {
  return state.resourceModel.incorporationAgreement.helpSection
}

/** The incorporation agreement sample article. */
export const getSampleArticle = (state: any): string => {
  return state.resourceModel.incorporationAgreement.article
}

/** The incorporation agreement options. */
export const getIncorporationAgreementDocuments = (state: any): Array<IncorporationAgreementTypeIF> => {
  return state.resourceModel.incorporationAgreement.documents
}

/** The minimum directors required. */
export const getMinimumDirectorCount = (state: any): number => {
  return state.resourceModel.directors.countMinimum
}

/** Returns the array of steps. */
export const getSteps = (state: any): Array<StepIF> => {
  return state.resourceModel.steps
}

/** Returns the resource filing data. */
export const getFilingData = (state: any): FilingDataIF => {
  return state.resourceModel.filingData
}
