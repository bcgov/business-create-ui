import { RuleIds } from '@/enums'

interface Rule {
  id: RuleIds
  text: string
  test: (...args) => boolean // rule function
}

export interface PeopleAndRolesResourceIF {
  header: string
  blurb: string | Array<string>
  helpSection: {
    header: string
    helpText: Array<string>
  }
  blurb2?: string | Array<string>
  addIncorporator?: boolean
  addOrganization?: string
  addBusiness?: boolean
  rules: Array<Rule>
}
