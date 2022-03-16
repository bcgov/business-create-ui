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
  addIncorporator: boolean
  addOrganization: boolean
  addProprietor: boolean
  rules: Array<Rule>
}
