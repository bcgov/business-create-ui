import { FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, PeopleAndRolesResourceIF,
  StepIF, CreateRulesResourceIF, CreateMemorandumResourceIF } from '@/interfaces'
import { CorpTypeCd, NameRequestTypes } from '@/enums'

// Interface to define the resource model
export interface ResourceIF {
  entityType: CorpTypeCd
  displayName: string
  title: string
  description: string
  statement: string
  nameRequestType: NameRequestTypes
  steps: Array<StepIF>
  filingData: FilingDataIF
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
