import {
  AffidavitResourceIF,
  CertifyStatementIF,
  CustodianResourceIF,
  CreateMemorandumResourceIF,
  CreateRulesResourceIF,
  FilingDataIF,
  IncorporationAgreementTypeIF,
  CreateResolutionResourceIF,
  KeyValueIF,
  StateIF,
  StepIF
} from '@/interfaces'

//
// The getters in this file return values from the current resource
// model -- in other words, for the currently-selected entity type.
//

/** The company display name. */
export const getCompanyDisplayName = (state: StateIF): string => {
  return state.resourceModel.displayName
}

/** The People and Roles object. */
export const getPeopleAndRolesResource = (state: StateIF): any => {
  return state.resourceModel.peopleAndRoles
}

/** The Incorportaion Articles */
export const getIncorporationArticlesResource = (state: StateIF): any => {
  return state.resourceModel.incorporationArticles
}

/** The Create Rules object. */
export const getCreateRulesResource = (state: StateIF): CreateRulesResourceIF => {
  return state.resourceModel.createRules
}

/** The Create Memorandum object. */
export const getCreateMemorandumResource = (state: StateIF): CreateMemorandumResourceIF => {
  return state.resourceModel.createMemorandum
}

/** The Create Resolution object. */
export const getCreateResolutionResource = (state: StateIF): CreateResolutionResourceIF => {
  return state.resourceModel.createResolution
}

/** The completing party statement resources. */
export const getCompletingPartyStatement = (state: StateIF): CertifyStatementIF => {
  return state.resourceModel.reviewAndConfirm.completingPartyStatement
}

/** The Incoporation Agreement object. */
export const getIncorporationAgreementResource = (state: StateIF): any => {
  return state.resourceModel.incorporationAgreement
}

/** The array of steps. */
export const getSteps = (state: StateIF): Array<StepIF> => {
  return state.resourceModel.steps
}

/** The resource filing data. */
export const getFilingData = (state: StateIF): Array<FilingDataIF> => {
  return state.resourceModel.filingData
}

/** The incorporation agreement sample article. */
export const getSampleArticle = (state: StateIF): string => {
  return getIncorporationAgreementResource(state).article
}

/** The incorporation agreement options. */
export const getIncorporationAgreementDocuments = (state: StateIF): Array<IncorporationAgreementTypeIF> => {
  return getIncorporationAgreementResource(state).documents
}

/** The maximum number of steps. */
export const getMaxStep = (state: StateIF): number => {
  const steps = getSteps(state)
  return (steps ? steps.filter(step => step.step !== -1).length : -1)
}

/** The dissolution details title. */
export const getDissolutionDetailsTitle = (state: StateIF): string => {
  return state.resourceModel.detailsTitle
}

/** The dissolution statement options. */
export const getDissolutionStatements = (state: StateIF): Array<KeyValueIF> => {
  return state.resourceModel.dissolutionStatements
}

/** The dissolution custodial records resources. */
export const getCustodialRecordsResources = (state: StateIF): CustodianResourceIF => {
  return state.resourceModel.custodialRecords
}

/** The dissolution statement options. */
export const getAffidavitResources = (state: StateIF): AffidavitResourceIF => {
  return state.resourceModel.affidavit
}
