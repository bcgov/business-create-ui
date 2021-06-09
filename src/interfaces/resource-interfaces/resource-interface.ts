import { FilingDataIF, HelpSectionIF, IncorporationAgreementTypeIF, StepIF } from '@/interfaces'
import { NameRequestTypes } from '@/enums'

// Interface to define the resource model
export interface ResourceIF {
  entityType: string,
  displayName: string
  title: string
  description: string
  statement: string
  nameRequestType: NameRequestTypes
  steps: Array<StepIF>
  filingData: FilingDataIF
  directors: {
    countMinimum: number
  }
  shareClasses: {
    countMinimum: number
  }
  incorporationAgreement: {
    helpSection: Array<HelpSectionIF>,
    documents: Array<IncorporationAgreementTypeIF>
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
    }
  }
}
