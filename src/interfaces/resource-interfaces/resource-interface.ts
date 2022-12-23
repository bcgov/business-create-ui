import {
  AffidavitResourceIF, FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, KeyValueIF,
  PeopleAndRolesResourceIF, StepIF, CreateRulesResourceIF, CreateMemorandumResourceIF,
  CreateResolutionResourceIF, CustodianResourceIF
} from '@/interfaces'
import { CorpTypeCd } from '@/enums'

/** Incorporation Resource interface. */
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

/** Registration Resource interface. */
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

/** Dissolution Resource interface. */
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

export interface ResourceIF extends IncorporationResourceIF, RegistrationResourceIF, DissolutionResourceIF {}
