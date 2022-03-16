import { DissolutionResourceIF } from '@/interfaces'
import { BulletListTypes, CorpTypeCd, FilingCodes, ItemTypes, RouteNames, ViewComponentNames } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CorpEntityDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

// SB TODO : cleanup this code
export const SolePropCompanyDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY),
  steps: CorpEntityDissolutionSteps,
  filingData: [{
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  }],
  detailsTitle: 'Company Details',

  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.BENEFIT_COMPANY)
    }
  },
  createResolution: {
    reviewConfirmHeader: 'Resolution',
    introSection: {
      header: '1. Resolution',
      items: [
        {
          type: ItemTypes.TEXT,
          value: 'Before submitting your voluntary dissolution you must <b>complete, sign, and date</b> a '
        },
        {
          type: ItemTypes.TOOLTIP,
          value: {
            label: 'resolution',
            text: 'Resolution - A formal statement of a decision.'
          }
        },
        {
          type: ItemTypes.TEXT,
          value: 'and deposit the resolution in the Company\'s records book.'
        }
      ]
    },

    confirmSection: {
      header: '2. Confirm Resolution Completion',
      text: [
        {
          type: ItemTypes.TEXT,
          value: 'I confirm a resolution was passed by'
        },
        {
          type: ItemTypes.PLACEHOLDER,
          value: `legal_name`
        },
        {
          type: ItemTypes.TEXT,
          value: 'and has been deposited in the Company\'s records book.'
        }
      ],
      items: []
    }
  }
}
