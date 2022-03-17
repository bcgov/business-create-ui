import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CorpTypeCd, NumWord, PartyTypes, RoleTypes, RuleIds } from '@/enums'
import { ActionBindingIF, ConfirmDialogType, OrgPersonIF, PeopleAndRoleIF, PeopleAndRolesResourceIF,
  TombstoneIF } from '@/interfaces'

/**
 * Mixin that provides common people and roles methods.
 */
@Component({})
export default class PeopleRolesMixin extends Vue {
  // Refs
  $refs!: {
    confirmDialog: ConfirmDialogType
  }

  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getTombstone!: TombstoneIF

  @Action setOrgPersonList!: ActionBindingIF
  @Action setAddPeopleAndRoleStepValidity!: ActionBindingIF

  // Enums for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly NumWord = NumWord
  readonly RuleIds = RuleIds

  protected currentOrgPerson: OrgPersonIF = null
  protected showOrgPersonForm = false
  protected activeIndex = -1

  /** Sets this step's validity when component is mounted. */
  protected async mounted (): Promise<void> {
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())

    // *** FOR DEBUGGING
    // await this.addPersonConfirm()
    // await this.addBusinessCorporationConfirm()
    // await this.removePersonConfirm()
    // await this.removePersonBusinessConfirm()
  }

  /** Single string if blurb is a string. */
  get blurb (): string {
    return (!Array.isArray(this.getPeopleAndRolesResource.blurb) &&
      this.getPeopleAndRolesResource.blurb)
  }

  /** Single string if blurbs is a string. */
  get blurb2 (): string {
    return (!Array.isArray(this.getPeopleAndRolesResource.blurb2) &&
      this.getPeopleAndRolesResource.blurb2)
  }

  /** List of strings if blurb is an array. */
  get blurbs (): string[] {
    return (Array.isArray(this.getPeopleAndRolesResource.blurb) &&
      this.getPeopleAndRolesResource.blurb)
  }

  /** List of strings if blurb2 is an array. */
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

  /** Whether the Number of Proprietors rule is valid. Always true if rule doesn't exist. */
  get validNumProprietors (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_PROPRIETORS)
    if (!rule) return true
    return rule.test(this.partners.length)
  }

  /** Whether there are any people without roles. Used as a safety check. */
  get validPeopleWithNoRoles (): boolean {
    return (this.peopleWithNoRoles.length > 0)
  }

  /** Returns true if specified org/person is a director. */
  public isDirector (orgPerson: OrgPersonIF): boolean {
    return orgPerson.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
  }

  protected onEditPerson (index: number): void {
    this.currentOrgPerson = { ...this.orgPersonList[index] }
    this.activeIndex = index
    this.showOrgPersonForm = true
  }

  protected onAddEditPerson (person: OrgPersonIF): void {
    // if this is the completing party, assign email address from user profile
    if (person.roles.find(role => role.roleType === RoleTypes.COMPLETING_PARTY) &&
        // email cannot be null or empty
        this.getTombstone.userEmail) {
      person.officer.email = this.getTombstone.userEmail
    }

    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    if (this.activeIndex === -1) {
      // Add Person.
      newList.push(person)
    } else {
      // Edit Person.
      newList.splice(this.activeIndex, 1, person)
    }
    // set updated list
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  protected onRemovePerson (index: number): void {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    newList.splice(index, 1)
    this.setOrgPersonList(newList)
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
    this.resetData()
  }

  protected onRemoveCompletingPartyRole () {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    const completingParty =
      newList.find(people => people.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY))
    if (completingParty) {
      // remove the Completing Party role
      completingParty.roles = completingParty.roles.filter(role => role.roleType !== RoleTypes.COMPLETING_PARTY)
      // remove email address that we got from user profile
      delete completingParty.officer.email // schema doesn't accept null or empty string
      // set updated list
      this.setOrgPersonList(newList)
    }
  }

  protected resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = -1
    this.showOrgPersonForm = false
  }

  protected hasValidRoles (): boolean {
    return (
      this.validNumCompletingParty &&
      this.validMinimumIncorporators &&
      this.validMinimumDirectors &&
      this.validDirectorCountry &&
      this.validDirectorProvince &&
      this.validNumProprietors &&
      !this.validPeopleWithNoRoles
    )
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

  protected async addPersonConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Person',
      'By adding an individual as the proprietor, you will be registering a ' +
        'business with that proprietor as the owner who performs all business ' +
        'operations and assumes all liabilities. Do you wish to continue?',
      'Continue'
    )
  }

  protected async addBusinessCorporationConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Business or a Corporation',
      'By adding an existing business or a corporation as the proprietor, you will ' +
        'be registering an existing company under another name (e.g., a numbered ' +
        'company that does business under a DBA name). Do you with to continue?',
      'Continue'
    )
  }

  protected async removePersonConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person',
      'Remove this person from your business?',
      'Remove'
    )
  }

  protected async removePersonBusinessConfirm (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person or Business / Corporation',
      'Remove this person or business / corporation from your business?',
      'Remove'
    )
  }
}
