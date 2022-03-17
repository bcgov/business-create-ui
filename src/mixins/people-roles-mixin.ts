import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { RoleTypes, RuleIds } from '@/enums'
import { ConfirmDialogType, OrgPersonIF, PeopleAndRoleIF, PeopleAndRolesResourceIF } from '@/interfaces'

/**
 * Mixin that provides people and roles methods.
 */
@Component({})
export default class PeopleRolesMixin extends Vue {
  // Refs
  $refs!: {
    confirmDialog: ConfirmDialogType
  }

  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF

  /** Single string if blurb is a string. */
  get blurb (): string {
    return (!Array.isArray(this.getPeopleAndRolesResource.blurb) &&
      this.getPeopleAndRolesResource.blurb)
  }
  get blurb2 (): string {
    return (!Array.isArray(this.getPeopleAndRolesResource.blurb2) &&
      this.getPeopleAndRolesResource.blurb2)
  }

  /** List of strings if blurb is an array. */
  get blurbs (): string[] {
    return (Array.isArray(this.getPeopleAndRolesResource.blurb) &&
      this.getPeopleAndRolesResource.blurb)
  }
  get blurbs2 (): string[] {
    return (Array.isArray(this.getPeopleAndRolesResource.blurb2) &&
      this.getPeopleAndRolesResource.blurb2)
  }

  /** The complete list of organizations/persons. */
  get orgPersonList (): OrgPersonIF[] {
    return this.getAddPeopleAndRoleStep.orgPeople
  }

  /** The list of completing parties. */
  get completingParties (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.COMPLETING_PARTY)
    )
  }

  /** The list of incorporators. */
  get incorporators (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.INCORPORATOR)
    )
  }

  /** The list of directors. */
  get directors (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.DIRECTOR)
    )
  }

  /** The list of proprietors. */
  get proprietors (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.PROPRIETOR)
    )
  }

  // *** TODO: add the list of partners

  /** The list of partners. */
  get partners (): OrgPersonIF[] {
    return this.orgPersonList.filter(
      people => people.roles.some(party => party.roleType === RoleTypes.PARTNER)
    )
  }

  /** The list of people without roles. */
  get peopleWithNoRoles (): OrgPersonIF[] {
    return this.orgPersonList.filter(people => people.roles.length === 0)
  }

  /** The completing party (or undefined if not found). */
  get completingParty () : OrgPersonIF {
    return this.orgPersonList.find(
      people => people.roles.some(party => party.roleType === RoleTypes.COMPLETING_PARTY)
    )
  }

  /** Whether the Number of Completing Party rule is valid. Always true if rule doesn't exist. */
  get validNumCompletingParty (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_COMPLETING_PARTY)
    if (!rule) return true
    return rule.test(this.completingParties.length)
  }

  /** Whether the Number of Incorporators rule is valid. Always true if rule doesn't exist. */
  get validMinimumIncorporators (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_INCORPORATORS)
    if (!rule) return true
    return rule.test(this.incorporators.length)
  }

  /** Whether the Number of Directors rule is valid. Always true if rule doesn't exist. */
  get validMinimumDirectors (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_DIRECTORS)
    if (!rule) return true
    return rule.test(this.directors.length)
  }

  /** Whether the Director Country rule is valid. Always true if rule doesn't exist. */
  get validDirectorCountry (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.DIRECTOR_COUNTRY)
    if (!rule) return true
    const num = this.directors.filter(d => rule.test(d.mailingAddress.addressCountry)).length
    // evaluate this rule only when there are enough minimum directors
    return (this.validMinimumDirectors && num > this.directors.length / 2) // more than half
  }

  /** Whether the Director Province rule is valid. Always true if rule doesn't exist. */
  get validDirectorProvince (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.DIRECTOR_PROVINCE)
    if (!rule) return true
    const num = this.directors.filter(
      d => rule.test(d.mailingAddress.addressCountry, d.mailingAddress.addressRegion)
    ).length
    return (num > 0) // at least one
  }

  /** Whether the Number of Proprietor rule is valid. Always true if rule doesn't exist. */
  get validNumProprietor (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_PROPRIETOR)
    if (!rule) return true
    return rule.test(this.proprietors.length)
  }

  /** Whether the Number of Partners rule is valid. Always true if rule doesn't exist. */
  get validNumPartners (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_PARTNERS)
    if (!rule) return true
    return rule.test(this.partners.length)
  }

  /** Whether there are any people without roles. Used as a safety check. */
  get validPeopleWithNoRoles (): boolean {
    return (this.peopleWithNoRoles.length > 0)
  }

  /** Returns true if specified org/person is a director. */
  isDirector (orgPerson: OrgPersonIF): boolean {
    return orgPerson.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
  }

  /** Helper to show the confirm dialog. */
  private async showConfirmDialog (title: string, message: string, action: string): Promise<boolean> {
    const confirm = await this.$refs.confirmDialog.open(title, message, {
      width: '40rem',
      persistent: true,
      yes: action,
      no: null,
      cancel: 'Cancel'
    }).catch(() => false)

    return confirm
  }

  async addPersonConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Person',
      'By adding an individual as the proprietor, you will be registering a ' +
        'business with that proprietor as the owner who performs all business ' +
        'operations and assumes all liabilities. Do you wish to continue?',
      'Continue'
    )
  }

  async addBusinessCorporationConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Business or a Corporation',
      'By adding an existing business or a corporation as the proprietor, you will ' +
        'be registering an existing company under another name (e.g., a numbered ' +
        'company that does business under a DBA name). Do you with to continue?',
      'Continue'
    )
  }

  async removePersonConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person',
      'Remove this person from your business?',
      'Remove'
    )
  }

  async removePersonBusinessConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person or Business / Corporation',
      'Remove this person or business / corporation from your business?',
      'Remove'
    )
  }
}
