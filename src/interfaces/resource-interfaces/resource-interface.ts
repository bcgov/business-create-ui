// Interface to define the resource model example
import { IncorporationAgreementTypeIF } from '@/interfaces'
import { NameRequestTypes } from '@/enums'
import { StepIF } from './component-resource-interfaces/step-interface'

export interface ResourceIF {
  entityType: string,
  displayName: string
  title: string
  description: string
  statement: string
  nameRequestType: NameRequestTypes
  steps: Array<StepIF>
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
