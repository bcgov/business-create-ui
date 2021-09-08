import { ResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes, Rules, ItemTypes } from '@/enums'
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

        `A minimum of three Directors is required. The First Directors of the Cooperative Association
          must be appointed in writing by a majority of the subscribers. The majority of Directors
          must reside in Canada and at least one Director must reside in BC.`,

        `Full names and residential addresses of each of the First Directors must be included. The
          residential address of a Director must be a complete physical address. BC Registries and
          Online Services cannot accept general delivery, post office box numbers, rural routes, sites
          or comp. numbers as part of the address. You must also include a postal code. If an area
          does not have street names or numbers, provide a description that would readily allow a
          person to locate the Director.`
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
  createRules: {
    helpSection: {
      header: `Help with Rules of the Association`,
      helpText: {
        section1: {
          label: 'Each Cooperative Association must set its own rules to cover:',
          items: [
            'Governance',
            'Overarching goals, needs, and actions to fulfill its purpose',
            'Election of directors',
            'Requirements for membership',
            'Financial information management',
            'Special rights and restrictions related to investment shares',
            'How meetings are conducted'
          ]
        },
        section2: {
          label: 'The Rules need to:',
          items: [
            { type: ItemTypes.TEXT, value: `Balance the rights of individual members with the interests of the
              Cooperative Association as a whole` },
            { type: ItemTypes.PARTIAL_ITEMS,
              value: [
                { type: ItemTypes.TEXT, value: 'Address the requirements of ' },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 13 of the Cooperative Association Act',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/99028_01#section13'
                  }
                },
                { type: ItemTypes.TEXT, value: ' and ' },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 10 of the Cooperative Association Regulation',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/391_2000#section10'
                  }
                }
              ]
            },
            { type: ItemTypes.TEXT,
              value: 'Be flexible enough to allow the Cooperative Association to respond to changing conditions' }
          ]
        },
        section3: {
          items: [
            `Applicants need to define their rules correctly. BC Registries is not responsible for verifying or offering
              advice about creating rules. You may want to get advice from a lawyer for help setting up your rules.`,
            'Use clear, concise, and consistent language to avoid confusion or disputes.'
          ]
        }
      }
    }
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
