/**
 * The data object from the COLIN Fetch Public Business call.
 */
export interface ColinBusinessIF {
  businessNumber: string // aka tax id
  corpState: string // not used
  corpStateClass: string // not used
  foundingDate: string // aka incorporation date in BC
  homeCompanyName: string // in foreign jurisdiction
  homeJurisdictionNumber: string // in foreign jurisdiction
  homeRecognitionDate: string // in foreign jurisdiction
  identifier: string // business id in BC
  jurisdiction: string // foreign jurisdiction
  legalName: string // legal name in BC
  legalType: string // may be same as CorpTypeCd
  status: string // not used
}
