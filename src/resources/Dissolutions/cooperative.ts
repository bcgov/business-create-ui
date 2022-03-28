import { DissolutionResourceIF } from '@/interfaces'
import { BulletListTypes, CorpTypeCd, DissolutionStatementTypes, FilingCodes, ItemTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CoopDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const CooperativeDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  steps: CoopDissolutionSteps,
  filingData: [
    {
      entityType: CorpTypeCd.COOP,
      filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
    },
    {
      entityType: CorpTypeCd.COOP,
      filingTypeCode: FilingCodes.AFFIDAVIT
    },
    {
      entityType: CorpTypeCd.COOP,
      filingTypeCode: FilingCodes.SPECIAL_RESOLUTION
    }
  ],
  detailsTitle: 'Association Details',
  dissolutionStatements: [
    {
      key: DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197,
      value: 'The Cooperative Association has, by special resolution, voluntarily resolved to dissolve ' +
        'the Cooperative Association under section 197 of the Cooperative Association Act. ' +
        '<b>The Cooperative Association has no assets and has no liabilities.</b>'
    },
    {
      key: DissolutionStatementTypes.NO_ASSETS_PROVISIONS_LIABILITIES_197,
      value: 'The Cooperative Association has, by special resolution, voluntarily resolved to dissolve the ' +
        'Cooperative Association under section 197 of the Cooperative Association Act. <b>The Cooperative ' +
        'Association has no assets and has made provision for the payment of each of the Cooperative Association\'s ' +
        'unpaid liabilities</b> and has obtained the written consent to that provision for payment from each ' +
        'creditor whose identity is known to the Cooperative Association and who has an unpaid claim against the ' +
        'Cooperative Association that exceeds $200.00.'
    }
  ],
  custodialRecords: {
    sectionSubtitle: `Enter the name and email address of the Custodian of Records, who will be responsible for the care
    and custody of the Cooperative's records. Enter the physical delivery address where the dissolved Cooperative's
    records will be maintained, and the mailing address where the custodian can be reached. These addresses must be
    located in Canada.`,
    custodianTitle: `Custodian of Records`,
    helpSection: {
      header: 'Help with Custodian of Records',
      helpText: [
        `A Cooperative Association must appoint a person to have custody and control of its records, including
        documents, instruments and accounting records, for 2 years.`
      ]
    },
    baseAddressValues: {
      country: 'CA',
      region: ''
    }
  },
  affidavit: {
    affidavitActionText: 'upload a copy as part of the voluntary dissolution.',
    helpSection: {
      header: `Upload a copy of an affidavit stating:`,
      helpText: [
        `The Cooperative Association has no assets; and`,
        `The Cooperative Association has no liabilities or has made provision for the payment of each of the Cooperative
        Association's unpaid liabilities and has obtained the written consent to that provision for payment from each
        creditor.`
      ],
      note: `The affidavit is to be sworn before a Commissioner for Taking Oaths for British Columbia with a seal
        affixed.`
    },
    sampleSection: {
      fileName: 'coop-sample-affidavit.pdf'
    },
    confirmSection: {
      checkboxLabel: `I confirm the following items are included as required in the Cooperative Associations Act:`,
      confirmText: [
        `The affidavit references only the BC Cooperative Association Act, section 197.`,
        `The director identified in the affidavit is a current director of the Cooperative Association and is the
        director whose signature is on the affidavit.`,
        `The affidavit contains one of the dissolution statements from Step 1 of this voluntary dissolution filing.`,
        `The affidavit is sealed by a Commissioner for Taking Affidavits/Oaths for British Columbia.`
      ]
    }
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 200 of the Cooperative Association Act.`,
      entityDisplay: GetCorpFullDescription(CorpTypeCd.COOP)
    }
  },
  createResolution: {
    reviewConfirmHeader: 'Special Resolution',
    introSection: {
      header: '1. Special Resolution',
      items: [
        {
          type: ItemTypes.TEXT,
          value: 'Before submitting your voluntary dissolution you must <b>complete, sign, and date</b> a '
        },
        {
          type: ItemTypes.TOOLTIP,
          value: {
            label: 'special resolution',
            text: 'Special Resolution - A decision passed by two thirds of a Cooperative Association.'
          }
        },
        {
          type: ItemTypes.TEXT,
          value: 'as part of this voluntary dissolution.'
        }
      ]
    },
    sampleFormSection: {
      header: '2. Special Resolution (Form 06 COO)',
      text: `For your convenience, we have provided the special resolution form (Form 06 COO).  This form should be
        completed, signed and a printed copy retained with your other Cooperative Association records.  Do not mail the
        paper form to BC Registries.  Once you have completed this form, enter the details from the paper form into this
        filing.`,
      previewImagePath: 'BCRegistries_CoopSpecialResolution-x2.png',
      downloadDocLabel: 'Download the Special Resolution Form 06 COO',
      downloadDocPath: 'files/cooperative_sample_special_resolution_form_06.pdf'
    },
    helpSection: {
      header: `Help with Special Resolution`,
      helpText: {
        section1: {
          items: [
            {
              type: ItemTypes.TEXT,
              value: `A special resolution is a resolution of the members of a Cooperative Association.  It is
                submitted to vote on the resolution.  It is passed by either being consented to in writing by all
                members or in a general meeting.`
            },
            {
              type: ItemTypes.PARTIAL_ITEMS,
              value: [
                {
                  type: ItemTypes.TEXT,
                  value: 'For details on how many members need to vote in a general meeting, refer to the '
                },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'Cooperative Association Act',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/99028_01#section1'
                  }
                },
                {
                  type: ItemTypes.TEXT,
                  value: '.'
                }
              ]
            },
            {
              type: ItemTypes.TEXT,
              value: 'The special resolution must include:'
            },
            {
              type: ItemTypes.BULLET_LIST,
              bulletListType: BulletListTypes.CIRCLE_SMALL,
              value: [
                `The name of the Cooperative Association, incorporation number, date the resolution was passed, and the
                 text of the resolution which clearly authorizes the Cooperative Association to make an application for
                 dissolution.`,
                `The signature of a current director, officer or lawyer of the Cooperative Association and the date of
                 signature.`
              ]
            }
          ]
        }
      }
    },
    resolutionDateSection: {
      header: '3. Resolution Date',
      description: 'Enter the date the special resolution passed.'
    },
    resolutionTextSection: {
      header: '4. Resolution Text',
      description: 'Enter the special resolution text as it appears on your printed form.',
      textLabel: 'Resolution Text',
      textPlaceholder: 'Resolution Text'
    },
    resolutionSignatureSection: {
      header: '5. Resolution Signature',
      description: 'Enter the full name of the person who signed the special resolution and the date they signed it.'
    },
    confirmSection: {
      header: '6. Confirm Special Resolution Content',
      text: [
        {
          type: ItemTypes.TEXT,
          value: 'I confirm the following:'
        }
      ],
      reviewSummaryText: `A printed copy of the signed special resolution (Form 06 COO) has been retained with the
                           Cooperative Association's records.`,
      items: [
        {
          type: ItemTypes.PARTIAL_ITEMS,
          value: [
            {
              type: ItemTypes.TEXT,
              value: `The Cooperative Association name is identified <b>exactly</b> as follows throughout the special
                      resolution: `
            },
            {
              type: ItemTypes.PLACEHOLDER,
              value: `legal_name`
            }
          ]
        },
        {
          type: ItemTypes.PARTIAL_ITEMS,
          value: [
            { type: ItemTypes.TEXT, value: 'The special resolution was passed by ' },
            { type: ItemTypes.PLACEHOLDER, value: 'legal_name_inline' },
            { type: ItemTypes.TEXT, value: 'and authorizes the dissolution.' }
          ]
        },
        {
          type: ItemTypes.TEXT,
          value: `A printed copy of the signed special resolution (Form 06 COO) has been retained with the Cooperative
            Association's records.`
        }
      ]
    }
  }
}
