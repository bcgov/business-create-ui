import { DissolutionResourceIF } from '@/interfaces'
import { FilingCodes, ItemTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { DissolutionStepsFirm } from './steps'

export const DissolutionResourceSp: DissolutionResourceIF = {
  entityType: CorpTypeCd.SOLE_PROP,
  displayName: GetCorpFullDescription(CorpTypeCd.SOLE_PROP),
  steps: DissolutionStepsFirm,
  filingData: [{
    entityType: CorpTypeCd.SOLE_PROP,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  }],
  detailsTitle: 'Company Details',
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make or assist in making a false or misleading statement
      in a record filed under the Partnership Act. 
      A person who commits this offence is subject to a maximum fine of $5,000.`,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.SOLE_PROP)
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
          value: 'legal_name'
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
