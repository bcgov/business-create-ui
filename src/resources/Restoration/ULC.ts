import { RestorationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, RuleIds } from '@/enums'
import { RestorationSteps } from './steps'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

export const RestorationResourceUlc: RestorationResourceIF = {
  entityType: CorpTypeCd.BC_ULC_COMPANY,
  displayName: GetCorpFullDescription(CorpTypeCd.BC_ULC_COMPANY),
  steps: RestorationSteps,
  filingData: [{
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    filingTypeCode: FilingCodes.RESTORATION_ULC
  }],
  peopleAndRoles: {
    header: '1. Add People or Corporations/Firms to your Application',
    blurb: `Add the people and Corporations/firms who will have a role in your company. People
      can have multiple roles; Corporations/firms can only be Incorporators.`,
    helpSection: null,
    addIncorporator: true,
    addOrganization: 'Add a Corporation or Firm',
    rules: [
      {
        id: RuleIds.NUM_APPLICANT,
        text: 'The applicant(s)',
        test: (num) => { return (num >= 1) }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: `the Completing Party, have examined the Company
        Articles and the Incorporation Agreement applicable to the company that is to be
        incorporated by the filing of this Incorporation Application and confirm that:`,
      certifyStatements: [
        `The Company Articles and the Incorporation Agreement both contain a signature
          line for each person identified as an incorporator in the Incorporation Application
          with the name of that person set out legibly under the signature line,`,

        'An original signature has been placed on each of those signature lines,',

        `I have no reason to believe that the signature placed on a signature line is not the
          signature of the person whose name is set out under that signature line, and`,

        'I have relevant knowledge of the company and that I am authorized to make this filing.'
      ],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 427 of the Business Corporations Act.`,
      entityDisplay: null
    }
  }
}
