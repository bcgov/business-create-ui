import {
  AffidavitResourceIF, FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, KeyValueIF, PeopleAndRolesResourceIF,
  StepIF, CreateRulesResourceIF, CreateMemorandumResourceIF, CreateResolutionResourceIF, CustodianResourceIF
} from '@/interfaces'
import { CorpTypeCd, NameRequestTypes } from '@/enums'

// Interface to define the resource model
export interface IncorporationResourceIF {
  entityType: CorpTypeCd
  displayName: string
  title: string
  description: string
  statement: string
  nameRequestType: NameRequestTypes
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
  incorporationAgreement?: {
    helpSection: Array<HelpSectionIF>
    article: string
    documents: Array<IncorporationAgreementTypeIF>
  }

  // CP only
  createRules?: CreateRulesResourceIF
  createMemorandum?: CreateMemorandumResourceIF
}

export interface RegistrationResourceIF {
  entityType: CorpTypeCd
  displayName: string
  nameRequestType: NameRequestTypes
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
      entityDisplay: string
    }
  }
}

// Interface to define the resource model
export interface DissolutionResourceIF {
  entityType: CorpTypeCd
  displayName: string
  steps: Array<StepIF>
  filingData: Array<FilingDataIF>
  detailsTitle: string
  custodialRecords: CustodianResourceIF
  dissolutionStatements?: Array<KeyValueIF>
  affidavit: AffidavitResourceIF
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

export interface ResourceIF extends DissolutionResourceIF, IncorporationResourceIF, RegistrationResourceIF {}
