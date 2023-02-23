import {
  AffidavitResourceIF, FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, KeyValueIF,
  PeopleAndRolesResourceIF, StepIF, CreateRulesResourceIF, CreateMemorandumResourceIF,
  CreateResolutionResourceIF, CustodianResourceIF, CompletingPartyStatementIF
} from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'

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
    completingPartyStatement: CompletingPartyStatementIF
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
    completingPartyStatement: CompletingPartyStatementIF
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
    completingPartyStatement: CompletingPartyStatementIF
  }
}

/** Restoration resource interface. */
export interface RestorationResourceIF {
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  peopleAndRoles: PeopleAndRolesResourceIF
  reviewAndConfirm: {
    completingPartyStatement: CompletingPartyStatementIF
  }
}

export interface ResourceIF extends DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF,
  RestorationResourceIF {}
