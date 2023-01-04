import {
  AffidavitResourceIF, FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, KeyValueIF,
  PeopleAndRolesResourceIF, StepIF, CreateRulesResourceIF, CreateMemorandumResourceIF,
  CreateResolutionResourceIF, CustodianResourceIF
} from '@/interfaces'
import { CorpTypeCd } from '@/enums'

/** Dissolution resource interface. */
export interface DissolutionResourceIF {
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  detailsTitle: string
  custodialRecords?: CustodianResourceIF
  dissolutionStatements?: Array<KeyValueIF>
  affidavit?: AffidavitResourceIF
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
      entityDisplay: string
    }
  }

  // CP only
  createResolution?: CreateResolutionResourceIF
}

/** Incorporation resource interface. */
export interface IncorporationResourceIF {
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  peopleAndRoles: PeopleAndRolesResourceIF
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
      entityDisplay: string
    }
  }

  // BEN / CC / BC / ULC only:
  shareClasses?: {
    countMinimum: number
  }
  incorporationArticles?: {
    articles: string,
    articlesTooltip: string,
    provisions?: string,
    provisionTooltip?: string
  }
  incorporationAgreement?: {
    helpSection: Array<HelpSectionIF>
    article: string
    documents: Array<IncorporationAgreementTypeIF>
  }

  // CP only
  createRules?: CreateRulesResourceIF
  createMemorandum?: CreateMemorandumResourceIF
}

/** Registration resource interface. */
export interface RegistrationResourceIF {
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  peopleAndRoles: PeopleAndRolesResourceIF
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
      entityDisplay: string
    }
  }
}

/** Restoration resource interface. */
export interface RestorationResourceIF {
  // *** TODO: update
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  peopleAndRoles: PeopleAndRolesResourceIF
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
      entityDisplay: string
    }
  }
}

export interface ResourceIF extends DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF,
  RestorationResourceIF {}
