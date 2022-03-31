import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { cloneDeep, isEqual, times } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { CorpTypeCd, PartyTypes, RoleTypes } from '@/enums'
import { AddressIF, ConfirmDialogType, EmptyAddress, FormIF, OrgPersonIF, PeopleAndRolesResourceIF,
  RolesIF } from '@/interfaces'
import { Rules } from '@/rules'
import { PersonAddressSchema } from '@/schemas'

/**
 * Mixin that provides common add/edit org/person methods.
 */
@Component({ components: {} })
export default class AddEditOrgPersonMixin extends Vue {
  // Refs
  $refs!: {
    addPersonOrgForm: FormIF
    mailingAddressNew: any
    deliveryAddressNew: any
    reassignCPDialog: ConfirmDialogType
  }

  @Prop() readonly initialValue!: OrgPersonIF
  @Prop() readonly activeIndex: number
  @Prop() readonly existingCompletingParty: OrgPersonIF
  @Prop() readonly addIncorporator: boolean

  @Getter getCurrentDate!: string
  @Getter isRoleStaff!: boolean
  @Getter isTypeBcomp!: boolean
  @Getter isTypeCoop!: boolean
  @Getter isTypeSoleProp!: boolean
  @Getter isTypePartnership!: boolean
  @Getter getEntityType!: CorpTypeCd
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  // Local properties
  private orgPerson: OrgPersonIF = null
  private addPersonOrgFormValid = true

  // Address related properties
  private inProgressMailingAddress: AddressIF
  private inProgressDeliveryAddress: AddressIF
  private inheritMailingAddress = true
  private mailingAddressValid = false
  private deliveryAddressValid = false
  private reassignCompletingParty = false

  /** Model value for roles checboxes. */
  private selectedRoles: Array<RoleTypes> = []

  // Person Address schema for template
  readonly PersonAddressSchema = PersonAddressSchema

  // Enums and rules for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly Rules = Rules

  /** The validation rules for the Roles. */
  protected get roleRules (): Array<Function> {
    return [ () => this.selectedRoles.length > 0 || 'A role is required' ]
  }

  /** Whether Completing Party is checked. */
  protected get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** Whether Incorporator is checked. */
  protected get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** Whether Director is checked. */
  protected get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** Whether Proprietor is checked. */
  protected get isProprietor (): boolean {
    return this.selectedRoles.includes(RoleTypes.PROPRIETOR)
  }

  /** Whether Partner is checked. */
  protected get isPartner (): boolean {
    return this.selectedRoles.includes(RoleTypes.PARTNER)
  }

  /** Whether current data object is a person. */
  protected get isPerson (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Whether current data object is an organization (corporation/firm). */
  protected get isOrg (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
  }

  /** Whether the Completing Party role should be shown. */
  protected get showCompletingPartyRole (): boolean {
    const isRoleCompletingParty = this.orgPerson.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)
    // either this is the completing party,
    // or this is staff adding/editing a person
    return (isRoleCompletingParty || (this.isRoleStaff && this.isPerson))
  }

  /** Whether the Incorporator role should be shown. */
  protected get showIncorporatorRole (): boolean {
    // show this role according to prop from parent parent component (ie, per resource file)
    return this.addIncorporator
  }

  /** Whether the Director role should be shown. */
  protected get showDirectorRole (): boolean {
    // only a person can be a director
    return this.isPerson
  }

  /** Whether the Proprietor role should be shown. */
  protected get showProprietorRole (): boolean {
    const isRoleProprietor = this.orgPerson.roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
    return isRoleProprietor
  }

  /** Whether the Partner role should be shown. */
  protected get showPartnerRole (): boolean {
    const isRolePartner = this.orgPerson.roles.some(role => role.roleType === RoleTypes.PARTNER)
    return isRolePartner
  }

  /** Whether the Completing Party role should be disabled. */
  protected get disableCompletingPartyRole (): boolean {
    // only staff can edit Completing Party role
    return !this.isRoleStaff
  }

  /** Whether the Incorporator role should be disabled. */
  protected get disableIncorporatorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showDirectorRole && this.showIncorporatorRole)
  }

  /** Whether the Director role should be disabled. */
  protected get disableDirectorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showIncorporatorRole && this.showDirectorRole)
  }

  /**
   * Whether to show the delivery address by default.
   * Applies to some entity types only.
   */
  protected get showDeliveryAddressByDefault (): boolean {
    return [
      CorpTypeCd.COOP,
      CorpTypeCd.BENEFIT_COMPANY,
      CorpTypeCd.BC_CCC,
      CorpTypeCd.BC_COMPANY,
      CorpTypeCd.BC_ULC_COMPANY,
      CorpTypeCd.SOLE_PROP,
      CorpTypeCd.PARTNERSHIP
    ].includes(this.getEntityType)
  }

  /** Whether the current data object supports a delivery address. */
  private get supportsDeliveryAddress (): boolean {
    return (this.isDirector || this.isProprietor || (this.isTypeSoleProp && this.isCompletingParty))
  }

  /** Called when component is created. */
  created (): void {
    if (this.initialValue) {
      this.orgPerson = { ...this.initialValue }
      this.orgPerson.officer = { ...this.initialValue.officer }

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // set address properties
      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.supportsDeliveryAddress) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        // initialize inheritMailingAddress checkbox conditionally
        this.updateSameAsMailingChkBox()
      }
    }
  }

  /** decide if the "Delivery Address same as Mailing Address" check box should be checked */
  protected updateSameAsMailingChkBox (): void {
    // safety check
    if (!this.supportsDeliveryAddress) {
      return
    }

    // if not already assigned, initialize delivery address to prevent template errors
    if (!this.inProgressDeliveryAddress) this.inProgressDeliveryAddress = cloneDeep(EmptyAddress)

    this.inheritMailingAddress = isEqual(this.inProgressMailingAddress, this.inProgressDeliveryAddress)

    if (this.inheritMailingAddress && this.showDeliveryAddressByDefault) {
      const isNew = this.isEmptyAddress(this.orgPerson.mailingAddress) &&
                    this.isEmptyAddress(this.orgPerson.deliveryAddress)

      this.inheritMailingAddress = !isNew
    }
  }

  /** Whether the address object is empty or with only with default input values */
  protected isEmptyAddress (address: AddressIF): boolean {
    return !address ||
           (!address.addressCity &&
           (!address.addressCountry || address.addressCountry === 'CA') &&
           (!address.addressRegion || address.addressRegion === 'BC') &&
           !address.deliveryInstructions &&
           !address.postalCode &&
           !address.streetAddress &&
           !address.streetAddressAdditional)
  }

  // Event Handlers
  protected updateMailingAddress (address): void {
    this.inProgressMailingAddress = address
  }

  protected updateDeliveryAddress (address): void {
    this.inProgressDeliveryAddress = address
  }

  protected updateMailingAddressValidity (valid: boolean): void {
    this.mailingAddressValid = valid
    // validate the form to update dummy component rules
    this.$refs.addPersonOrgForm && this.$refs.addPersonOrgForm.validate()
  }

  protected updateDeliveryAddressValidity (valid: boolean): void {
    this.deliveryAddressValid = valid
    // validate the form to update dummy component rules
    this.$refs.addPersonOrgForm && this.$refs.addPersonOrgForm.validate()
  }

  protected async assignCompletingPartyRole (): Promise<void> {
    if (
      this.orgPerson &&
      this.isCompletingParty &&
      this.existingCompletingParty &&
      this.orgPerson.officer.id !== this.existingCompletingParty.officer.id
    ) {
      // open confirmation dialog and wait for response
      const response = await this.$refs.reassignCPDialog.open(
        'Change Completing Party?',
        this.reassignPersonErrorMessage(),
        {
          width: '45rem',
          persistent: true,
          yes: 'Change Completing Party',
          no: null,
          cancel: 'Cancel'
        }
      ).catch(() => false)

      if (response) {
        this.reassignCompletingParty = true
      } else {
        // remove the role
        this.selectedRoles = this.selectedRoles.filter(r => r !== RoleTypes.COMPLETING_PARTY)
      }
    }
  }

  protected async validateAddPersonOrgForm (): Promise<void> {
    // validate the main form and address form(s)
    this.$refs.addPersonOrgForm.validate()
    this.$refs.mailingAddressNew.$refs.addressForm.validate()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.validate()
    }

    // wait for things to stabilize
    await Vue.nextTick()

    // only proceed if form is valid
    if (this.isFormValid) {
      if (this.reassignCompletingParty) {
        this.emitReassignCompletingPartyEvent()
      }
      const person = this.setPerson()
      this.emitPersonInfo(person)
      this.resetAddPersonData(false) // don't emit event
    }
  }

  /** Helper to set the current director data. */
  private setPerson (): OrgPersonIF {
    let person: OrgPersonIF = { ...this.orgPerson }
    person.officer = { ...this.orgPerson.officer }
    if (this.activeIndex === -1) {
      // assign a new (random) ID
      person.officer.id = uuidv4()
    }
    person.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.supportsDeliveryAddress) {
      person.deliveryAddress = this.setPersonDeliveryAddress()
    }
    person.roles = this.setPersonRoles()
    return person
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = this.inProgressMailingAddress
    }
    return { ...this.inProgressDeliveryAddress }
  }

  private setPersonRoles (): RolesIF[] {
    let roles: RolesIF[] = []

    if (this.isCompletingParty) {
      roles.push({ roleType: RoleTypes.COMPLETING_PARTY, appointmentDate: this.getCurrentDate })
    }
    if (this.isIncorporator) {
      roles.push({ roleType: RoleTypes.INCORPORATOR, appointmentDate: this.getCurrentDate })
    }
    if (this.isDirector) {
      roles.push({ roleType: RoleTypes.DIRECTOR, appointmentDate: this.getCurrentDate })
    }
    if (this.isProprietor) {
      roles.push({ roleType: RoleTypes.PROPRIETOR, appointmentDate: this.getCurrentDate })
    }
    if (this.isPartner) {
      roles.push({ roleType: RoleTypes.PARTNER, appointmentDate: this.getCurrentDate })
    }

    return roles
  }

  protected resetAddPersonData (emitEvent: boolean): void {
    this.$refs.addPersonOrgForm.reset()
    this.$refs.mailingAddressNew.$refs.addressForm.reset()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.reset()
    }
    if (emitEvent) {
      this.emitResetEvent()
    }
  }

  private reassignPersonErrorMessage (): string {
    let name = this.existingCompletingParty.officer.firstName
    if (this.existingCompletingParty.officer.middleName) {
      name += ` ${this.existingCompletingParty.officer.middleName}`
    }
    name += ` ${this.existingCompletingParty.officer.lastName}`

    return `The Completing Party role is already assigned to ${name}.\n` +
      'Selecting "Completing Party" here will change the Completing Party.'
  }

  // *** TODO: can probably get rid of this:
  /** True if the form is valid. */
  protected get isFormValid (): boolean {
    let isFormValid = (this.addPersonOrgFormValid && this.mailingAddressValid)
    if (this.supportsDeliveryAddress && !this.inheritMailingAddress) {
      isFormValid = (isFormValid && this.deliveryAddressValid)
    }
    return isFormValid
  }

  // Event emitters
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): void {}

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('removePerson')
  private emitRemovePerson (activeIndex: number): void {}

  @Emit('removeCompletingPartyRole')
  private emitReassignCompletingPartyEvent (): void {}
}
