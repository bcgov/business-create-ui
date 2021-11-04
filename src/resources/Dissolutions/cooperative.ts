import { DissolutionResourceIF } from '@/interfaces'
import { CorpTypeCd, DissolutionStatementTypes, FilingCodes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CoopDissolutionSteps } from '@/resources/Dissolutions/stepTemplates'

export const CooperativeDissolutionResource: DissolutionResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  steps: CoopDissolutionSteps,
  filingData: {
    entityType: CorpTypeCd.COOP,
    filingTypeCode: FilingCodes.DISSOLUTION_VOLUNTARY
  },
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
  }
}
