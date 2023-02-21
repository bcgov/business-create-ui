import { IncorporationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, RuleIds, ItemTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { IncorporationStepsCoop } from '@/resources/Incorporation/steps'

export const IncorporationResourceCp: IncorporationResourceIF = {
  entityType: CorpTypeCd.COOP,
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  steps: IncorporationStepsCoop,
  filingData: [{
    entityType: CorpTypeCd.COOP,
    filingTypeCode: FilingCodes.INCORPORATION_CP
  }],
  peopleAndRoles: {
    header: '1. Add People to your Application',
    blurb: `Add the people who will have a role in your Cooperative Association. A Completing
      Party can also be a First Director.`,
    helpSection: {
      header: 'Help with Adding First Directors',
      helpText: [
        'To be in compliance with the Cooperative Association Act (Section 72);',

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
    rules: [
      {
        id: RuleIds.NUM_COMPLETING_PARTY,
        text: 'The Completing Party',
        test: (num) => { return (num === 1) }
      },
      {
        id: RuleIds.NUM_DIRECTORS,
        text: 'At least three First Directors',
        test: (num) => { return (num >= 3) }
      },
      {
        id: RuleIds.DIRECTOR_COUNTRY,
        text: 'The majority of First Directors must reside in Canada',
        test: (country) => { return (country === 'CA') }
      },
      {
        id: RuleIds.DIRECTOR_PROVINCE,
        text: 'At least one First Director must reside in BC',
        test: (country, province) => { return (country === 'CA' && province === 'BC') }
      }
    ]
  },
  createRules: {
    helpSection: {
      header: 'Help with Rules of the Association',
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
            {
              type: ItemTypes.TEXT,
              value: `Balance the rights of individual members with the interests of the
              Cooperative Association as a whole`
            },
            {
              type: ItemTypes.PARTIAL_ITEMS,
              value: [
                {
                  type: ItemTypes.TEXT,
                  value: 'Address the requirements of '
                },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 13 of the Cooperative Association Act',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/99028_01#section13'
                  }
                },
                {
                  type: ItemTypes.TEXT,
                  value: ' and '
                },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 10 of the Cooperative Association Regulation',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/391_2000#section10'
                  }
                }
              ]
            },
            {
              type: ItemTypes.TEXT,
              value: 'Be flexible enough to allow the Cooperative Association to respond to changing conditions'
            }
          ]
        },
        section3: {
          label: 'The template can be used if:',
          items: [
            `The Cooperative Association will <span class="font-weight-bold">not</span> be a Housing or Community\
              Service Cooperative Association.`,
            'The Cooperative Association has share capital consisting of membership shares with par value.',
            'The Cooperative Association has investment shares that may be issued only to members.'
          ],
          href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/391_2000#ScheduleB'
        },
        section4: {
          items: [
            `Applicants need to define their rules correctly. BC Registries is not responsible for verifying or offering
              advice about creating rules. You may want to get advice from a lawyer for help setting up your rules.`,
            'Use clear, concise, and consistent language to avoid confusion or disputes.'
          ]
        }
      }
    }
  },
  createMemorandum: {
    helpSection: {
      header: 'Help with Memorandum of Association',
      helpText: {
        section1: {
          items: [
            `A memorandum should accurately reflect the intention and values of the Cooperative Association. Be detailed
              and specific, but not too restrictive. This will avoid having to make changes later.`,
            `To form a Cooperative Association, at least three subscribers who are responsible for the Cooperative
              Association's operation are required. They may be individuals or organizations such as a government,
              First Nation, corporation, business, society or another Cooperative Association.`
          ]
        },
        section2: {
          label: 'Include in the Memorandum:',
          items: [
            'The name and purpose of the Cooperative Association',
            'Restrictions on the business and powers of the Cooperative Association',
            `The authorized share capital - list the number and the classes of shares that the cooperative association
              can issue`,
            `A statement that the liability of the members or investment shareholders is limited in accordance with
              the Act`,
            'An optional statement about provisions if the Cooperative Association closes down',
            'The number, class and par value, if applicable, of shares subscribed for by the founding members'
          ]
        },
        section3: {
          label: `For Community Service Cooperative Associations that provide health, social, educational or other
            community services, include:`,
          items: [
            'A provision that the association is a Community Service Cooperative',
            'That the Association does not issue investment shares',
            'That the purpose of the Association is charitable or that it provides the services listed above'
          ]
        }
      }
    }
  },
  reviewAndConfirm: {
    completingPartyStatement: {
      certifyStatements: [],
      certifyClause: `Note: It is an offence to make a false or misleading statement in respect
        of a material fact in a record submitted to the Corporate Registry for filing.
        See section 200 of the Cooperative Association Act.`,
      entityDisplay: 'cooperative association'
    }
  }
}
