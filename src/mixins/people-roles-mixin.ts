import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AuthorizedActions, NumWord, PartyTypes, RoleTypes, RuleIds } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AddressIF, ConfirmDialogType, OrgPersonIF, PeopleAndRoleIF,
  PeopleAndRolesResourceIF, RegistrationStateIF } from '@/interfaces'
import { IsAuthorized } from '@/utils/Authorizations'

/**
 * Mixin that provides common people and roles methods.
 */
@Component({})
export default class PeopleRolesMixin extends Vue {
  // Refs
  $refs!: {
    confirmDialog: ConfirmDialogType
  }

  // For components that import this mixin
  readonly AuthorizedActions = AuthorizedActions
  readonly IsAuthorized = IsAuthorized

  // Enums for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly NumWord = NumWord
  readonly RuleIds = RuleIds

  // NB: some of these are used by components that use this mixin
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getUserAddress!: AddressIF
  @Getter(useStore) getUserEmail!: string
  @Getter(useStore) getUserFirstName!: string
  @Getter(useStore) getUserLastName!: string
  @Getter(useStore) isEntityPartnership!: boolean
  @Getter(useStore) isEntitySoleProp!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean
  @Getter(useStore) isLimitedRestorationFiling: boolean

  @Action(useStore) setAddPeopleAndRoleStepValidity!: (x: boolean) => void
  @Action(useStore) setIsAutoPopulatedBusinessNumber!: (x: boolean) => void
  @Action(useStore) setOrgPersonList!: (x: OrgPersonIF[]) => void
  @Action(useStore) setRegistrationBusinessNumber!: (x: string) => void

  // Local variables
  currentOrgPerson = null as OrgPersonIF
  showOrgPersonForm = false
  activeIndex = NaN // new org/person

  /** Called when component is mounted. */
  async mounted (): Promise<void> {
    // set initial validity
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
  }

  /** Whether a Completing Party is required. */
  get requireCompletingParty (): boolean {
    return this.getPeopleAndRolesResource.rules.some(r => r.id === RuleIds.NUM_COMPLETING_PARTY)
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
    return this.orgPersonList.filter(person => this.isCompletingParty(person))
  }

  /** The list of incorporators. */
  get incorporators (): OrgPersonIF[] {
    return this.orgPersonList.filter(person => this.isIncorporator(person))
  }

  /** The list of directors. */
  get directors (): OrgPersonIF[] {
    return this.orgPersonList.filter(person => this.isDirector(person))
  }

  /** The list of proprietors. */
  get proprietors (): OrgPersonIF[] {
    return this.orgPersonList.filter(person => this.isProprietor(person))
  }

  /** The list of partners. */
  get partners (): OrgPersonIF[] {
    return this.orgPersonList.filter(person => this.isPartner(person))
  }

  /** The list of applicant-persons. */
  get applicantPersons (): OrgPersonIF[] {
    return this.orgPersonList.filter(person =>
      this.isApplicant(person) && this.isPerson(person)
    )
  }

  /** The list of applicant-orgs. */
  get applicantOrgs (): OrgPersonIF[] {
    return this.orgPersonList.filter(person =>
      this.isApplicant(person) && this.isOrganization(person)
    )
  }

  /** The list of people without roles. */
  get peopleWithNoRoles (): OrgPersonIF[] {
    return this.orgPersonList.filter(people => people.roles.length === 0)
  }

  /** The completing party (or undefined if not found). */
  get completingParty () : OrgPersonIF {
    return this.orgPersonList.find(person => this.isCompletingParty(person))
  }

  /** Whether the Number of Completing Party rule is valid. Always true if rule doesn't exist. */
  get validNumCompletingParty (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_COMPLETING_PARTY)
    if (!rule) return true
    return rule.test(this.completingParties.length)
  }

  /** Whether the Number of Incorporators rule is valid. Always true if rule doesn't exist. */
  get validNumIncorporators (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_INCORPORATORS)
    if (!rule) return true
    return rule.test(this.incorporators.length)
  }

  /** Whether the Number of Directors rule is valid. Always true if rule doesn't exist. */
  get validNumDirectors (): boolean {
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
    return (this.validNumDirectors && num > this.directors.length / 2) // more than half
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

  /** Whether the Applicant Person rule is valid. Always true if rule doesn't exist. */
  get validApplicantPerson (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_APPLICANT_PERSON)
    if (!rule) return true
    return rule.test(this.applicantPersons.length)
  }

  /** Whether the Applicant Org rule is valid. Always true if rule doesn't exist. */
  get validApplicantOrg (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_APPLICANT_ORG)
    if (!rule) return true
    return rule.test(this.applicantOrgs.length)
  }

  /** Whether the Number of Proprietors rule is valid. Always true if rule doesn't exist. */
  get validNumProprietors (): boolean {
    const rule = this.getPeopleAndRolesResource.rules.find(r => r.id === RuleIds.NUM_PROPRIETORS)
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

  /** Returns true if specified org/person is a person. */
  public isPerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.PERSON)
  }

  /** Returns true if specified org/person is an organization. */
  public isOrganization (orgPerson: OrgPersonIF): boolean {
    return (orgPerson?.officer.partyType === PartyTypes.ORGANIZATION)
  }

  /** Returns true if specified org/person is an applicant. */
  public isApplicant (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.APPLICANT)
  }

  /** Returns true if specified org/person is a completing party. */
  public isCompletingParty (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)
  }

  /** Returns true if specified org/person is a director. */
  public isDirector (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
  }

  /** Returns true if specified org/person is an incorporator. */
  public isIncorporator (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.INCORPORATOR)
  }

  /** Returns true if specified org/person is a partner. */
  public isPartner (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.PARTNER)
  }

  /** Returns true if specified org/person is a proprietor. */
  public isProprietor (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
  }

  /** Called by ListPeopleAndRoles component event. */
  onEditPerson (index: number): void {
    this.currentOrgPerson = { ...this.orgPersonList[index] }
    this.activeIndex = index
    this.showOrgPersonForm = true
  }

  /** Called by (Reg)AddEditOrgPerson component event. */
  onAddEditPerson (person: OrgPersonIF): void {
    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    if (isNaN(this.activeIndex)) {
      // add person
      newList.push(person)
    } else {
      // update person
      newList.splice(this.activeIndex, 1, person)
    }
    // set updated list
    this.setOrgPersonList(newList)
    this.resetData()
  }

  /** Called by ListPeopleAndRoles component event. */
  async onRemovePerson (index: number): Promise<void> {
    const orgPerson = this.orgPersonList[index]
    const isProprietor = this.isProprietor(orgPerson)
    const isPartner = this.isPartner(orgPerson)

    if (this.isPerson(orgPerson)) {
      if (!await this.confirmRemoveProprietorPerson()) return
    } else if (this.isOrganization(orgPerson) && (isProprietor || isPartner)) {
      if (!await this.confirmRemoveProprietorOrganization()) return
    } else {
      if (!await this.confirmRemove()) return
    }

    const newList: OrgPersonIF[] = Object.assign([], this.orgPersonList)
    newList.splice(index, 1)

    // Remove auto populated business number for Proprietor (Org)
    if (isProprietor && this.isOrganization(orgPerson) && this.getRegistration.isAutoPopulatedBusinessNumber) {
      // We don't empty business number if user changed it after auto population
      if (orgPerson.officer.businessNumber === this.getRegistration.businessNumber) {
        this.setRegistrationBusinessNumber(undefined)
      }
      this.setIsAutoPopulatedBusinessNumber(false)
    }

    // set updated list
    this.setOrgPersonList(newList)
    this.resetData()
  }

  /** Called by AddEditOrgPerson component event when reassigning the CP. */
  onRemoveCompletingPartyRole () {
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

  /** Called to clean up after adding/editing/remove a person or cancelling the AddEdit component. */
  resetData (): void {
    this.currentOrgPerson = null
    this.activeIndex = NaN // new org/person
    this.showOrgPersonForm = false
    // set validity according to current state
    this.setAddPeopleAndRoleStepValidity(this.hasValidRoles())
  }

  private hasValidRoles (): boolean {
    return (
      this.validNumCompletingParty &&
      this.validNumIncorporators &&
      this.validNumDirectors &&
      this.validDirectorCountry &&
      this.validDirectorProvince &&
      (this.validApplicantPerson || this.validApplicantOrg) &&
      this.validNumProprietors &&
      this.validNumPartners &&
      !this.validPeopleWithNoRoles
    )
  }

  async confirmAddProprietorPerson (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Person',
      'By adding an individual as the proprietor, you will be registering a ' +
        'business with that proprietor as the owner who performs all business ' +
        'operations and assumes all liabilities. Do you wish to continue?',
      'Continue',
      'Cancel'
    )
  }

  async confirmAddProprietorOrganization (): Promise<boolean> {
    return this.showConfirmDialog(
      'Add a Business or a Corporation',
      'By adding an existing business, society or a corporation as the proprietor, you will ' +
        'be registering an existing company under another name (e.g., a numbered ' +
        'company that does business under a DBA name). Do you wish to continue?',
      'Continue',
      'Cancel'
    )
  }

  private async confirmRemoveProprietorPerson (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person',
      'Remove this person from your business?',
      'Remove',
      'Cancel'
    )
  }

  private async confirmRemoveProprietorOrganization (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person or Business / Corporation',
      'Remove this person or business / corporation from your business?',
      'Remove',
      'Cancel'
    )
  }

  private async confirmRemove (): Promise<boolean> {
    return this.showConfirmDialog(
      'Remove Person or Corporation / Firm',
      'Remove this Person or Corporation or Firm from your Company?',
      'Remove',
      'Cancel'
    )
  }

  /** Helper to show the confirm dialogs. */
  private async showConfirmDialog (title: string, message: string, yes: string, no: string): Promise<boolean> {
    return this.$refs.confirmDialog.open(title, message, {
      width: '40rem', persistent: true, yes, no, cancel: null
    }).catch(() => false)
  }
}
