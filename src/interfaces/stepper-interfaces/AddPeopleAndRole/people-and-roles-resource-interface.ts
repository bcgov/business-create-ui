import { RuleIds } from '@/enums'

interface RuleIF {
  id: RuleIds
  text: string
  test: (...args) => boolean // rule function
}

export interface PeopleAndRolesResourceIF {
  header: string
  subheader?: string
  blurb: string | Array<string>
  helpSection: {
    header: string
    helpText: Array<string>
  }
  blurb2?: string | Array<string>
  addIncorporator?: boolean
  addPerson?: boolean
  showDirectors?: boolean
  addOrganization?: boolean
  addBusiness?: boolean
  rules: Array<RuleIF>
}
