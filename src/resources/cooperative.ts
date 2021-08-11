import { ResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes, Rules } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { CoopStepsTemplate } from '@/resources/stepTemplates'

export const CooperativeResource: ResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  title: '',
  description: '',
  statement: '',
  nameRequestType: NameRequestTypes.CP,
  steps: CoopStepsTemplate,
  filingData: {
    entityType: CorpTypeCd.COOP,
    filingTypeCode: FilingCodes.INCORPORATION_CP
  },
  peopleAndRoles: {
    header: `1. Add People to your Application`,
    blurb: `Add the people who will have a role in your Cooperative Association. A Completing
      Party can also be a First Director.`,
    helpSection: {
      header: `Help with Adding First Directors`,
      helpText: [
        `To be in compliance with the Cooperative Association Act (Section 72);`,

        `A minimum of thress directors is required. The first directors of the co-op must be
          appointed in writing by a majority of the subscribers. The majority of Directors must
          reside in Canada and at least one Director must reside in BC.`,

        `Full names and residential addresses of each of the first directors must be included. The
          residential address of a director must be a complete physical address. BC Registries and
          Online Services cannot accept general delivery, post office box numbers, rural routes,
          sites or comp. numbers as part of the address. You must also include a postal code. If
          an area does not have stree names or numbers, provide a description that would readily
          allow a person to locate the director.`
      ]
    },
    addIncorporator: false,
    addOrganization: false,
    rules: [
      {
        rule: Rules.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        rule: Rules.NUM_DIRECTORS,
        text: 'At least three First Directors',
        test: (num) => { return (num >= 3) }
      },
      {
        rule: Rules.DIRECTOR_COUNTRY,
        text: 'The majority of First Directors must reside in Canada',
        test: (country) => { return (country === 'CA') }
      },
      {
        rule: Rules.DIRECTOR_PROVINCE,
        text: 'At least one First Director must reside in BC',
        test: (country, province) => { return (country === 'CA' && province === 'BC') }
      }
    ]
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatementHeader: null,
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 200 of the Cooperative Association Act.`,
      entityDisplay: 'cooperative association'
    }
  }
}
