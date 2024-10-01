import { DissolutionResourceIF } from '@/interfaces'
import { FilingCodes } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { DissolutionStepsFirm } from './steps'

export const DissolutionResourceSp: DissolutionResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  steps: DissolutionStepsFirm,
  filingData: [{
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  }],
  pageBlurbDraft: `Confirm the following information, select the dissolution date, and certify your
    dissolution before filing.`,
  detailsTitle: null,
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make or assist in making a false or misleading statement
      in a record filed under the Partnership Act. 
      A person who commits this offence is subject to a maximum fine of $5,000.`,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.SOLE_PROP)
    }
  }
}
