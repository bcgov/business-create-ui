import { Rules } from '@/enums'

interface Rule {
  rule: Rules
  text: string
  test: (...args) => boolean // rule function
}

export interface PeopleAndRolesResourceIF {
  header: string
  blurb: string
  helpSection: {
    header: string
    helpText: Array<string>
  }
  addIncorporator: boolean
  addOrganization: boolean
  rules: Array<Rule>
}
