// Interface to define the resource model example
import { IncorporationAgreementTypeIF } from '@/interfaces'

export interface ResourceIF {
  entityType: string,
  displayName: string
  title: string
  description: string
  statement: string
  nameRequestType: string
  directors: {
    countMinimum: number
  }
  shareClasses: {
    countMinimum: number
  }
  incorporationAgreement: Array<IncorporationAgreementTypeIF>,
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: string
      certifyStatements: Array<string>
      certifyClause: string
    }
  }
}
