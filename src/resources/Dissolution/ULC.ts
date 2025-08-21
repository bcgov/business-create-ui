import { DissolutionResourceIF } from '@/interfaces'
import { BulletListTypes, FilingCodes, ItemTypes } from '@/enums'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { DissolutionStepsCorp } from './steps'
import { ResourcePhrases } from '../ResourcePhrases'

export const DissolutionResourceUlc: DissolutionResourceIF = {
  entityType: CorpTypeCd.BC_ULC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY),
  steps: DissolutionStepsCorp,
  filingData: [{
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  }],
  detailsTitle: 'Company Details',
  custodialRecords: {
    sectionSubtitle: `Enter the name (person or corporation or firm), email address and mailing and delivery addresses
      of the Custodian of Records who will be responsible for the care and custody of the Company's records. Addresses
      must be located in BC.`,
    custodianTitle: 'Custodian of Records',
    helpSection: {
      header: 'Help with Custodian of Records',
      helpText: [
        `A Company must keep all company records for a period of 2 years. A court order may be required if the Custodian
        of Records information changes within 2 years.`
      ]
    },
    baseAddressValues: {
      country: 'CA',
      region: 'BC'
    }
  },
  affidavit: {
    affidavitActionText: 'deposit the affidavit in the Company\'s records book.',
    helpSection: {
      header: 'The affidavit must state:',
      helpText: [
        'The Company has no assets; and',
        `The Company has no liabilities or has made provision for the payment of each of the Company's unpaid
          liabilities and has obtained the written consent to that provision for payment from each creditor.`
      ],
      note: `The affidavit is to be sworn before a Commissioner for Taking Oaths.`
    },
    sampleSection: {
      fileName: 'corp-sample-affidavit.pdf'
    },
    confirmSection: {
      checkboxLabel: `I confirm the following items are included as required in the Business Corporations Act and have
      been deposited in the Company's records book:`,
      confirmText: [
        'The affidavit references the Business Corporations Act, section 316.',
        `The director identified in the affidavit is a current director of the Company and is the director whose
        signature is on the affidavit.`,
        'The affidavit is sealed by a Commissioner for Taking Affidavits/Oaths.'
      ]
    }
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: ResourcePhrases.OFFENCE_SECTION_427
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
    helpSection: {
      header: 'Help with Resolution',
      helpText: {
        section1: {
          items: [
            {
              type: ItemTypes.TEXT,
              value: 'A Company can pass a director\'s resolution if:'
            },
            {
              type: ItemTypes.BULLET_LIST,
              bulletListType: BulletListTypes.CIRCLE_SMALL,
              value: [
                'The Company has no assets,',
                `The Company has no liabilities or has made adequate provision for the payment of each of its
                 liabilities, and`,
                'The Company has not issued any shares.'
              ]
            },
            {
              type: ItemTypes.TEXT,
              value: 'If the Company has issued shares then an ordinary resolution is required.'
            },
            {
              type: ItemTypes.TEXT,
              value: 'An "ordinary resolution" is a resolution that:'
            },
            {
              type: ItemTypes.BULLET_LIST,
              bulletListType: BulletListTypes.ALPHABETICAL_LOWER,
              value: [
                `passed at a general meeting by a simple majority of the votes cast by shareholders voting shares that
                 carry the right to vote at general meetings, or`,
                `passed, after being submitted to all of the shareholders holding shares that carry the right to vote at
                 general meetings, by being consented to in writing by shareholders holding shares that carry the right
                 to vote at general meetings who, in the aggregate, hold shares carrying at least a special majority of
                 the votes entitled to be cast on the resolution;`
              ]
            },
            {
              type: ItemTypes.TEXT,
              value: 'We recommend seeking professional assistance to create and pass the appropriate resolution.'
            }
          ]
        }
      }
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
