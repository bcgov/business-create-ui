import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { cloneDeep, isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { PartyTypes, RoleTypes, RuleIds } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { AddressIF, BusinessLookupIF, ConfirmDialogType, EmptyBusinessLookup,
  FormIF, OrgPersonIF, PeopleAndRolesResourceIF, RegistrationStateIF, RolesIF } from '@/interfaces'
import { EmptyAddress } from '@bcrs-shared-components/interfaces'
import { Rules } from '@/rules'
import { PersonAddressSchema } from '@/schemas'
import { LegalServices } from '@/services'
import { VuetifyRuleFunction } from '@/types'

/**
 * Mixin that provides common add/edit org/person methods.
 */
@Component({})
export default class AddEditOrgPersonMixin extends Vue {
  // Refs
  $refs!: {
    addPersonOrgForm: FormIF
    mailingAddressNew: any
    deliveryAddressNew: any
    confirmDialog: ConfirmDialogType
  }

  @Prop({ required: true }) readonly initialValue!: OrgPersonIF
  @Prop({ required: true }) readonly activeIndex!: number // is NaN for new org/person
  @Prop({ required: true }) readonly existingCompletingParty!: OrgPersonIF

  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter(useStore) getRegistration!: RegistrationStateIF
  @Getter(useStore) isBaseCompany!: boolean
  @Getter(useStore) isFullRestorationFiling!: boolean
  @Getter(useStore) isLimitedRestorationFiling: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isSbcStaff!: boolean
  @Getter(useStore) isTypeBcomp!: boolean
  @Getter(useStore) isTypeCoop!: boolean
  @Getter(useStore) isTypePartnership!: boolean
  @Getter(useStore) isTypeSoleProp!: boolean

  @Action(useStore) setAddPeopleAndRoleStepValidity!: (x: boolean) => void
  @Action(useStore) setIsAutoPopulatedBusinessNumber!: (x: boolean) => void
  @Action(useStore) setRegistrationBusinessNumber!: (x: string) => void

  // Local properties
  orgPerson = null as OrgPersonIF
  addPersonOrgFormValid = true
  enableRules = false
  inProgressBusinessLookup = EmptyBusinessLookup

  // Address related properties
  inProgressMailingAddress = {} as AddressIF
  inProgressDeliveryAddress = {} as AddressIF
  inheritMailingAddress = true
  mailingAddressValid = false
  deliveryAddressValid = false
  reassignCompletingParty = false

  /** Model value for roles checboxes. */
  selectedRoles = [] as Array<RoleTypes>

  // Person Address schema for template
  readonly PersonAddressSchema = PersonAddressSchema

  // Enums and rules for template
  readonly CorpTypeCd = CorpTypeCd
  readonly RoleTypes = RoleTypes
  readonly PartyTypes = PartyTypes
  readonly Rules = Rules

  /** Whether a Completing Party is required. */
  get requireCompletingParty (): boolean {
    return this.getPeopleAndRolesResource.rules.some(r => r.id === RuleIds.NUM_COMPLETING_PARTY)
  }

  /** Whether an Incorporator is required. */
  get requireIncorporator (): boolean {
    return this.getPeopleAndRolesResource.rules.some(r => r.id === RuleIds.NUM_INCORPORATORS)
  }

  /** Whether a Director(s) is required. */
  get requireDirector (): boolean {
    return this.getPeopleAndRolesResource.rules.some(r => r.id === RuleIds.NUM_DIRECTORS)
  }

  /** The validation rules for the Roles. */
  get roleRules (): Array<VuetifyRuleFunction> {
    return [() => this.selectedRoles.length > 0 || 'A role is required']
  }

  /** Whether Completing Party is checked. */
  get isCompletingParty (): boolean {
    return this.selectedRoles.includes(RoleTypes.COMPLETING_PARTY)
  }

  /** Whether Incorporator is checked. */
  get isIncorporator (): boolean {
    return this.selectedRoles.includes(RoleTypes.INCORPORATOR)
  }

  /** Whether Director is checked. */
  get isDirector (): boolean {
    return this.selectedRoles.includes(RoleTypes.DIRECTOR)
  }

  /** Whether Proprietor is checked. */
  get isProprietor (): boolean {
    return this.selectedRoles.includes(RoleTypes.PROPRIETOR)
  }

  /** Whether Partner is checked. */
  get isPartner (): boolean {
    return this.selectedRoles.includes(RoleTypes.PARTNER)
  }

  /** Whether Applicant is checked. */
  get isApplicant (): boolean {
    return this.selectedRoles.includes(RoleTypes.APPLICANT)
  }

  /** Whether current data object is a person. */
  get isPerson (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Whether current data object is an organization (corporation/firm). */
  get isOrg (): boolean {
    return (this.orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
  }

  /** Whether current business object is selected using lookup. */
  get hasBusinessSelectedFromLookup (): boolean {
    return this.orgPerson?.isLookupBusiness && !!this.inProgressBusinessLookup.identifier
  }

  get showRoles (): boolean {
    return (
      this.showCompletingPartyRole ||
      this.showIncorporatorRole ||
      this.showDirectorRole
    )
  }

  /** Whether the Completing Party role should be shown. */
  get showCompletingPartyRole (): boolean {
    if (!this.requireCompletingParty) return false

    const showCompletingParty = this.orgPerson.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)
    // either this is the completing party,
    // or this is staff adding/editing a person
    return (showCompletingParty || (this.isRoleStaff && this.isPerson))
  }

  /** Whether the Incorporator role should be shown. */
  get showIncorporatorRole (): boolean {
    return this.requireIncorporator
  }

  /** Whether the Director role should be shown. */
  get showDirectorRole (): boolean {
    // only a person can be a director
    return (this.requireDirector && this.isPerson)
  }

  /** Whether the Proprietor role should be shown. */
  get showProprietorRole (): boolean {
    return this.orgPerson.roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
  }

  /** Whether the Partner role should be shown. */
  get showPartnerRole (): boolean {
    return this.orgPerson.roles.some(role => role.roleType === RoleTypes.PARTNER)
  }

  /** Whether the Completing Party role should be disabled. */
  get disableCompletingPartyRole (): boolean {
    // only staff can edit Completing Party role
    return !this.isRoleStaff
  }

  /** Whether the Incorporator role should be disabled. */
  get disableIncorporatorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showDirectorRole && this.showIncorporatorRole)
  }

  /** Whether the Director role should be disabled. */
  get disableDirectorRole (): boolean {
    // disable this role if it's the only role displayed
    return (!this.showCompletingPartyRole && !this.showIncorporatorRole && this.showDirectorRole)
  }

  /**
   * Whether to show the delivery address by default.
   * Applies to some entity types only.
   */
  get showDeliveryAddressByDefault (): boolean {
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

  /** Called when component is created. */
  created (): void {
    // mark this step as invalid while adding or editing
    this.setAddPeopleAndRoleStepValidity(false)

    if (this.initialValue) {
      this.orgPerson = { ...this.initialValue }
      this.orgPerson.officer = { ...this.initialValue.officer }

      // set checkbox array
      this.selectedRoles = this.orgPerson.roles.map(r => r.roleType)

      // set address properties
      this.inProgressMailingAddress = { ...this.orgPerson.mailingAddress }
      if (this.isDirector || this.isProprietor || this.isPartner) {
        this.inProgressDeliveryAddress = { ...this.orgPerson.deliveryAddress }
        // initialize inheritMailingAddress checkbox
        this.updateSameAsMailingChkBox()
      }

      if (this.initialValue.isLookupBusiness) {
        this.inProgressBusinessLookup = {
          name: this.initialValue.officer.organizationName,
          identifier: this.initialValue.officer.identifier,
          bn: this.initialValue.officer.businessNumber
        }
      }
    }

    // if editing, enable validation from the start
    if (!isNaN(this.activeIndex)) this.enableRules = true
  }

  /** decide if the "Delivery Address same as Mailing Address" check box should be checked */
  updateSameAsMailingChkBox (): void {
    // safety check
    if (!this.isDirector && !this.isProprietor && !this.isPartner) return

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
  private isEmptyAddress (address: AddressIF): boolean {
    return !address ||
           (!address.addressCity &&
           (!address.addressCountry || address.addressCountry === 'CA') &&
           (!address.addressRegion || address.addressRegion === 'BC') &&
           !address.deliveryInstructions &&
           !address.postalCode &&
           !address.streetAddress &&
           !address.streetAddressAdditional)
  }

  /** Address component event handler - called when mailing address has changed. */
  updateMailingAddress (address: AddressIF): void {
    // only update if equal
    // (workaround for BaseAddress always telling us there's a new address)
    if (!isEqual(this.inProgressMailingAddress, address)) {
      this.inProgressMailingAddress = address
    }
  }

  /** Address component event handler - called when delivery address has changed. */
  updateDeliveryAddress (address: AddressIF): void {
    // only update if equal
    // (workaround for BaseAddress always telling us there's a new address)
    if (!isEqual(this.inProgressDeliveryAddress, address)) {
      this.inProgressDeliveryAddress = address
    }
  }

  /**
   * Address component event handler - called when it is rendered and when
   * the user has changed a mailing address field.
   */
  updateMailingAddressValidity (valid: boolean): void {
    this.mailingAddressValid = valid
    // validate the main form to update dummy component rules
    this.$refs.addPersonOrgForm && this.$refs.addPersonOrgForm.validate()
  }

  /**
   * Address component event handler - called when it is rendered and when
   * the user has changed a delivery address field.
   */
  updateDeliveryAddressValidity (valid: boolean): void {
    this.deliveryAddressValid = valid
    // validate the main form to update dummy component rules
    this.$refs.addPersonOrgForm && this.$refs.addPersonOrgForm.validate()
  }

  swapIsLookupBusiness (): void {
    this.orgPerson.isLookupBusiness = !this.orgPerson?.isLookupBusiness
  }

  /**
   * BusinessLookup component event handler - called when it is rendered and when
   * the user undo selected business.
   */
  resetBusinessDetails (): void {
    this.updateBusinessDetails(EmptyBusinessLookup)
    this.inProgressMailingAddress = {} as AddressIF
    this.inProgressDeliveryAddress = {} as AddressIF
    this.orgPerson.officer.email = ''
    if (!this.enableRules) {
      this.$refs.mailingAddressNew.$refs.addressForm.reset()
      if (this.$refs.deliveryAddressNew) {
        this.$refs.deliveryAddressNew.$refs.addressForm.reset()
      }
    }
  }

  /**
   * BusinessLookup component event handler - called when it is rendered and when
   * the user has selected a business.
   */
  async updateBusinessDetails (businessLookup: BusinessLookupIF): Promise<void> {
    this.orgPerson.officer.organizationName = businessLookup.name
    this.orgPerson.officer.identifier = businessLookup.identifier
    // sanitize Business Number
    this.orgPerson.officer.businessNumber = (businessLookup.bn?.length === 9)
      ? businessLookup.bn
      : (businessLookup.bn?.length > 9) ? businessLookup.bn.slice(0, 9) : null

    this.inProgressBusinessLookup = { ...businessLookup }
    if (businessLookup.identifier) {
      const addresses = await LegalServices.fetchAddresses(businessLookup.identifier)
        .then((data) => {
          // SP and GP have businessOffice instead of registeredOffice
          return data?.registeredOffice || data?.businessOffice
        }).catch(() => {
          return undefined
        })
      if (addresses) {
        this.inProgressMailingAddress = { ...addresses.mailingAddress }
        this.inProgressDeliveryAddress = { ...addresses.deliveryAddress }
      }
    }
  }

  async assignCompletingPartyRole (): Promise<void> {
    if (
      this.orgPerson &&
      this.isCompletingParty &&
      this.existingCompletingParty &&
      this.orgPerson.officer.id !== this.existingCompletingParty.officer.id
    ) {
      // open confirmation dialog and wait for response
      const response = await this.$refs.confirmDialog.open(
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

  /** Called when the user clicks the Done button. */
  async validateAddPersonOrgForm (): Promise<void> {
    this.enableRules = true
    await this.$nextTick()

    // validate all the forms
    // NB: main form depends on address forms
    this.mailingAddressValid = this.$refs.mailingAddressNew.$refs.addressForm.validate()
    this.deliveryAddressValid = !this.$refs.deliveryAddressNew ||
      this.$refs.deliveryAddressNew.$refs.addressForm.validate()
    this.addPersonOrgFormValid = this.$refs.addPersonOrgForm.validate()

    // only proceed if main form is valid
    if (this.addPersonOrgFormValid) {
      if (this.reassignCompletingParty) {
        this.emitReassignCompletingPartyEvent()
      }
      const person = this.setPerson()
      if (this.isProprietor && person.officer.partyType === PartyTypes.ORGANIZATION && person.officer.businessNumber) {
        // Show an acknowledgement message if business number is different from what was entered in step 1
        if (this.getRegistration.businessNumber &&
            person.officer.businessNumber !== this.getRegistration.businessNumber) {
          await this.showBNWarning(person.officer.organizationName, person.officer.businessNumber)
        }

        // Auto populate business number for Proprietor (Org)
        // 1. If not entered in step 1
        // 2. If different from what was entered in step 1
        if (person.officer.businessNumber !== this.getRegistration.businessNumber) {
          this.setRegistrationBusinessNumber(person.officer.businessNumber)
          this.setIsAutoPopulatedBusinessNumber(true)
        }
      }

      this.emitPersonInfo(person)
      this.resetAddPersonData(false) // don't emit event
    } else {
      // scroll to top of form to present validations
      await this.scrollToTop(document.getElementsByClassName('appoint-form')[0])
    }
  }

  private async showBNWarning (businessName: string, businessNumber: string): Promise<boolean> {
    return this.$refs.confirmDialog.open(
      'Business number',
      `The business number retrieved from our system for ${businessName} is different from ` +
      `what was entered in step 1. The business number ${businessNumber} will be used to ` +
      'inform CRA for this registration.',
      {
        width: '40rem', persistent: true, yes: 'Ok', no: null, cancel: null
      }
    ).catch(() => false)
  }

  /** Copy of function in Common mixin (since this mixin cannot extend another mixin). */
  private async scrollToTop (element: any): Promise<void> {
    const isVitestRunning = (import.meta.env.JEST_WORKER_ID !== undefined)
    // don't call window.scrollTo during Vitest tests because happy-dom doesn't implement it
    if (element && !isVitestRunning) await element.scrollIntoView({ behavior: 'smooth' })
  }

  /** Helper to set the current director data. */
  private setPerson (): OrgPersonIF {
    const person: OrgPersonIF = { ...this.orgPerson }
    person.officer = { ...this.orgPerson.officer }
    if (isNaN(this.activeIndex)) {
      // assign a new (random but unique) ID
      person.officer.id = uuidv4()
    }
    person.mailingAddress = { ...this.inProgressMailingAddress }
    if (this.isDirector || this.isProprietor || this.isPartner) {
      person.deliveryAddress = this.setPersonDeliveryAddress()
    }
    person.roles = this.setPersonRoles()
    return person
  }

  private setPersonDeliveryAddress (): AddressIF {
    if (this.inheritMailingAddress) {
      this.inProgressDeliveryAddress = this.inProgressMailingAddress
    }
    // return a new object (not a copy)
    return { ...this.inProgressDeliveryAddress }
  }

  private setPersonRoles (): RolesIF[] {
    const roles: RolesIF[] = []

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
    if (this.isApplicant) {
      roles.push({ roleType: RoleTypes.APPLICANT, appointmentDate: this.getCurrentDate })
    }

    return roles
  }

  resetAddPersonData (emitEvent: boolean): void {
    // first reset the address form(s)
    this.$refs.mailingAddressNew.$refs.addressForm.reset()
    if (this.$refs.deliveryAddressNew) {
      this.$refs.deliveryAddressNew.$refs.addressForm.reset()
    }

    // then reset the main form (which depends on the above)
    this.$refs.addPersonOrgForm.reset()

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

  // Event emitters
  @Emit('addEditPerson')
  private emitPersonInfo (personInfo: OrgPersonIF): OrgPersonIF {
    return personInfo
  }

  @Emit('resetEvent')
  private emitResetEvent (): void {}

  @Emit('removePerson')
  emitRemovePerson (activeIndex: number): number {
    return activeIndex
  }

  @Emit('removeCompletingPartyRole')
  private emitReassignCompletingPartyEvent (): void {}
}
