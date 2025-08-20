import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmlRoles, AmlStatuses, AmlTypes, AuthorizedActions, EntityStates, FilingStatus, RestorationTypes,
  RoleTypes } from '@/enums'
import { AmalgamatingBusinessIF, ContactPointIF, EmptyContactPoint, EmptyNameRequest, NameRequestIF,
  NameTranslationIF, OrgPersonIF, PeopleAndRoleIF, RegisteredRecordsAddressesIF, ResourceIF, ShareClassIF,
  ResolutionIF } from '@/interfaces'
import { CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AuthServices, LegalServices } from '@/services'
import { AmalgamationRegResources, AmalgamationShortResources } from '@/resources'
import { IsAuthorized } from '@/utils'

/**
 * Mixin that provides amalgamation rules, etc.
 * Note that the error text is declared in BusinessStatus.vue.
 */
@Component({})
export default class AmalgamationMixin extends Vue {
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) getEntityType!: CorpTypeCd
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isAmalgamationFilingRegular!: boolean
  @Getter(useStore) isAmalgamationFilingVertical!: boolean
  @Getter(useStore) isEntityBcCcc!: boolean
  @Getter(useStore) isEntityBcUlcCompany!: boolean
  @Getter(useStore) isEntityCccContinueIn!: boolean
  @Getter(useStore) isEntityUlcContinueIn!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: Array<any>) => void
  @Action(useStore) setBusinessContact!: (x: ContactPointIF) => void
  @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  @Action(useStore) setEntityType!: (x: CorpTypeCd) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestApprovedName!: (x: string) => void
  @Action(useStore) setNameTranslations!: (x: NameTranslationIF[]) => void
  @Action(useStore) setOfficeAddresses!: (x: RegisteredRecordsAddressesIF) => void
  @Action(useStore) setOrgPersonList!: (x: OrgPersonIF[]) => void
  @Action(useStore) setResources!: (x: ResourceIF) => void
  @Action(useStore) setShareClasses!: (x: ShareClassIF[]) => void
  @Action(useStore) setResolutions!: (x: ResolutionIF[]) => void

  /** Iterable array of rule functions, in order of evaluation. */
  readonly rules = [
    this.notAffiliated,
    this.notHistorical,
    this.notFrozen,
    this.notInGoodStanding,
    this.limitedRestoration,
    this.futureEffectiveFiling,
    this.draftTask,
    this.pendingFiling,
    this.foreign,
    this.foreignUnlimited,
    this.cccMismatch,
    this.foreignUnlimited2,
    this.xproUlcCcc,
    this.foreignUnlimited3,
    this.needBcCompany,
    this.foreignHorizontal
  ]

  /** If we don't have addresses, assume business is not affiliated (except if authorized). */
  notAffiliated (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      !business.addresses &&
      !IsAuthorized(AuthorizedActions.AML_OVERRIDES)
    ) {
      return AmlStatuses.ERROR_NOT_AFFILIATED
    }
    return null
  }

  /**
   * Disallow historical business.
   * (Could happen if it was added while active and is now historical.)
   */
  notHistorical (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isHistorical) {
      return AmlStatuses.ERROR_HISTORICAL
    }
    return null
  }

  /** Disallow frozen business. */
  notFrozen (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isFrozen) {
      return AmlStatuses.ERROR_FROZEN
    }
    return null
  }

  /** Disallow if NIGS (except if authorized). */
  notInGoodStanding (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      business.isNotInGoodStanding &&
      !IsAuthorized(AuthorizedActions.AML_OVERRIDES)
    ) {
      return AmlStatuses.ERROR_NOT_IN_GOOD_STANDING
    }
    return null
  }

  /** Disallow if limited restoration (except if authorized). */
  limitedRestoration (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      business.isLimitedRestoration &&
      !IsAuthorized(AuthorizedActions.AML_OVERRIDES)
    ) {
      return AmlStatuses.ERROR_LIMITED_RESTORATION
    }
    return null
  }

  /** Disallow if a future effective filing exists. */
  futureEffectiveFiling (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isFutureEffective) {
      return AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING
    }
    return null
  }

  /** Disallow if a draft task exists. */
  draftTask (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isDraftTask) {
      return AmlStatuses.ERROR_DRAFT_TASK
    }
    return null
  }

  /** Disallow if a pending filing exists. */
  pendingFiling (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isPendingFiling) {
      return AmlStatuses.ERROR_PENDING_FILING
    }
    return null
  }

  /**
   * Disallow altogether if foreign or extrapro (except if authorized).
   * (Could happen if staff added it and regular user resumes draft.)
   */
  foreign (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.FOREIGN &&
      !IsAuthorized(AuthorizedActions.AML_OVERRIDES)
    ) {
      return AmlStatuses.ERROR_FOREIGN
    }
    return null
  }

  /** Disallow if foreign and there is also a BC company, into ULC/CUL. */
  foreignUnlimited (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.FOREIGN &&
      this.isAnyBcCompany &&
      (this.isEntityBcUlcCompany || this.isEntityUlcContinueIn)
    ) {
      return AmlStatuses.ERROR_FOREIGN_UNLIMITED
    }
    return null
  }

  /** Disallow CC/CCC mismatch. */
  cccMismatch (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      (business.legalType === CorpTypeCd.BC_CCC || business.legalType === CorpTypeCd.CCC_CONTINUE_IN) &&
      (!this.isEntityBcCcc && !this.isEntityCccContinueIn)
    ) {
      return AmlStatuses.ERROR_CCC_MISMATCH
    }
    return null
  }

  /** Disallow if BC/C and there is also a foreign, into ULC/CUL. */
  foreignUnlimited2 (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      (business.legalType === CorpTypeCd.BC_COMPANY || business.legalType === CorpTypeCd.CONTINUE_IN) &&
      this.isAnyForeign &&
      (this.isEntityBcUlcCompany || this.isEntityUlcContinueIn)
    ) {
      return AmlStatuses.ERROR_FOREIGN_UNLIMITED2
    }
    return null
  }

  /** Disallow extrapro (A company) into ULC/CC/CUL/CCC. */
  xproUlcCcc (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.FOREIGN &&
      (
        this.isEntityBcUlcCompany || this.isEntityBcCcc ||
        this.isEntityUlcContinueIn || this.isEntityCccContinueIn
      )
    ) {
      return AmlStatuses.ERROR_XPRO_ULC_CCC
    }
    return null
  }

  /** Disallow if ULC/CUL and there is also a foreign. */
  foreignUnlimited3 (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      (business.legalType === CorpTypeCd.BC_ULC_COMPANY || business.legalType === CorpTypeCd.ULC_CONTINUE_IN) &&
      this.isAnyForeign
    ) {
      return AmlStatuses.ERROR_FOREIGN_UNLIMITED3
    }
    return null
  }

  /** Disallow if there are no BC companies. */
  needBcCompany (): AmlStatuses {
    if (!this.isAnyBcCompany) {
      return AmlStatuses.ERROR_NEED_BC_COMPANY
    }
    return null
  }

  /** Disallow if foreign in a short-form horizontal amalgamation. */
  foreignHorizontal (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && this.isAmalgamationFilingHorizontal) {
      return AmlStatuses.ERROR_FOREIGN_HORIZONTAL
    }
    return null
  }

  /** Resets company name values to original in Resulting Business Name Component. */
  resetValues (): void {
    this.setNameRequest(EmptyNameRequest)
    this.setNameRequestApprovedName(null)
    this.setCorrectNameOption(null)
    this.setNameTranslations([])
  }

  /**
   * Fetches the business' auth information, business info, addresses, first task, and first filing.
   * @param identifier The business identifier.
   * @returns An object of business information sub-objects, some of which may be null.
   */
  async fetchAmalgamatingBusinessInfo (identifier: string): Promise<any> {
    // Make all API calls concurrently without rejection.
    // NB - if any call failed, that item will be null.
    const [ authInfo, businessInfo, addresses, firstTask, firstFiling ] =
      await Promise.allSettled([
        AuthServices.fetchAuthInfo(identifier),
        LegalServices.fetchBusinessInfo(identifier),
        LegalServices.fetchAddresses(identifier),
        LegalServices.fetchFirstTask(identifier),
        LegalServices.fetchFirstOrOnlyFiling(identifier)
      ]).then(results => results.map((result: any) => result.value || null))

    return { authInfo, businessInfo, addresses, firstTask, firstFiling }
  }

  /**
   * This business is in limited restoration if there is a state filing and restoration expiry date isn't
   * in the past and the state filing is a limited restoration or a limited restoration extension.
   * @param business The business to check if is in Limited Restoration or not.
   */
  async isLimitedRestoration (business: any): Promise<boolean> {
    // check for no state filing
    if (!business.businessInfo.stateFiling) return false
    // check for expired restoration
    if (this.getCurrentDate > business.businessInfo.restorationExpiryDate) return false
    // fetch state filing
    const stateFiling =
      await LegalServices.fetchFiling(business.businessInfo.stateFiling).catch(() => null) // on error, return null
    return (
      stateFiling?.restoration?.type === RestorationTypes.LIMITED ||
      stateFiling?.restoration?.type === RestorationTypes.LTD_EXTEND
    )
  }

  /**
   * This business is future effective if the first filing in the ledger is future effective and is still
   * not complete or corrected (ie, it's paid or pending).
   * @param business The business to check if is Future Effective or not.
   */
  isFutureEffective (business: any): boolean {
    // check if business has a future-effective filing in its ledger
    if (
      business.firstFiling?.isFutureEffective === true &&
      business.firstFiling?.status !== FilingStatus.COMPLETED &&
      business.firstFiling?.status !== FilingStatus.CORRECTED
    ) {
      return true
    }

    // check if business is part of a future-effective amalgamation
    if (
      business.businessInfo?.warnings?.some((w: any) => w.warningType === 'FUTURE_EFFECTIVE_AMALGAMATION')
    ) {
      return true
    }

    return false
  }

  /**
   * This business is draft task if the first task in the Todo List is still draft (or pending).
   * @param business The business to check if is Draft Task or not.
   */
  isDraftTask (business: any): boolean {
    return (
      business.firstTask?.header.status === FilingStatus.DRAFT ||
      business.firstTask?.header.status === FilingStatus.PENDING
    )
  }

  /**
   * This business is pending filing if the first filing in the ledger is still not complete or corrected
   * (ie, it's paid or pending).
   * @param business The business to check if is Pending Filing or not.
   */
  isPendingFiling (business: any): boolean {
    return (
      business.firstFiling?.status !== FilingStatus.COMPLETED &&
      business.firstFiling?.status !== FilingStatus.CORRECTED
    )
  }

  /**
   * Re-fetches the draft amalgamating businesses information and updates the store.
   * @returns The holding/primary business (if there is one).
   */
  async refetchAmalgamatingBusinessesInfo (): Promise<AmalgamatingBusinessIF> {
    const fetchTingInfo = async (item: any): Promise<AmalgamatingBusinessIF> => {
      // check if foreign
      if (item.foreignJurisdiction) {
        return {
          type: AmlTypes.FOREIGN,
          role: AmlRoles.AMALGAMATING,
          identifier: item.identifier,
          legalName: item.legalName,
          foreignJurisdiction: item.foreignJurisdiction
        } as AmalgamatingBusinessIF
      } else {
        const business = await this.fetchAmalgamatingBusinessInfo(item.identifier)

        // if auth info is empty then business is not (no longer) affiliated with current account
        if (!business.authInfo) {
          return {
            type: AmlTypes.LEAR,
            role: item.role,
            identifier: item.identifier,
            name: item.name,
            legalType: item.legalType
          } as AmalgamatingBusinessIF
        }

        return {
          type: AmlTypes.LEAR,
          role: item.role, // amalgamating or holding
          identifier: business.businessInfo.identifier,
          name: business.businessInfo.legalName,
          authInfo: business.authInfo,
          legalType: business.businessInfo.legalType,
          addresses: business.addresses,
          isNotInGoodStanding: (business.businessInfo.goodStanding === false),
          isFrozen: (business.businessInfo.adminFreeze === true),
          isFutureEffective: this.isFutureEffective(business),
          isDraftTask: this.isDraftTask(business),
          isPendingFiling: this.isPendingFiling(business),
          isLimitedRestoration: await this.isLimitedRestoration(business),
          isHistorical: (business.businessInfo.state === EntityStates.HISTORICAL)
        } as AmalgamatingBusinessIF
      }
    }

    const promises = this.getAmalgamatingBusinesses.map(fetchTingInfo)
    const amalgamatingBusinesses = await Promise.all(promises)
    this.setAmalgamatingBusinesses(amalgamatingBusinesses)

    // return the holding/primary business (or undefined)
    return this.getAmalgamatingBusinesses.find(business =>
      (business.role === AmlRoles.HOLDING || business.role === AmlRoles.PRIMARY)
    )
  }

  /**
   * (Re)fetches the holding/primary business' data and updates the prepopulated data.
   * @param business The holding/primary business.
   * @param isNew Whether the business is new (ie, set by user, not restored from draft).
   */
  async updatePrepopulatedData (business: AmalgamatingBusinessIF, isNew = false): Promise<void> {
    // safety checks
    if (!business || business.type !== AmlTypes.LEAR) throw new Error('Invalid business')
    if (!business.authInfo) throw new Error('Missing share classes')

    // first, fetch directors and share structure
    // NB - addresses and auth info have already been fetched (and checked above)
    // NB - make all API calls concurrently without rejection
    // NB - if any call failed, that item will be null
    const [ directors, shareStructure, resolutions ] =
      await Promise.allSettled([
        LegalServices.fetchDirectors(business.identifier),
        LegalServices.fetchShareStructure(business.identifier),
        LegalServices.fetchResolutions(business.identifier)
      ]).then(results => results.map((result: any) => result.value || null))

    // check for errors before changing anything
    if (!directors) throw new Error('Unable to fetch directors')
    if (!shareStructure) throw new Error('Unable to fetch share structure')

    // unset previous holding/primary business, if any
    const previous = this.getAmalgamatingBusinesses.find((b: AmalgamatingBusinessIF) =>
      b.role === AmlRoles.HOLDING || b.role === AmlRoles.PRIMARY
    )
    if (previous) {
      previous.role = AmlRoles.AMALGAMATING
    }

    // set this business as the new holding/primary business
    if (this.isAmalgamationFilingVertical) business.role = AmlRoles.HOLDING
    if (this.isAmalgamationFilingHorizontal) business.role = AmlRoles.PRIMARY

    // overwrite office addresses
    this.setOfficeAddresses(business.addresses)

    // overwrite directors (but keep completing party, if there is one)
    const completingParty = this.getAddPeopleAndRoleStep.orgPeople.find((p: OrgPersonIF) =>
      p.roles.some(role => role.roleType === RoleTypes.COMPLETING_PARTY)
    )
    if (completingParty) this.setOrgPersonList([ ...directors, completingParty ])
    else this.setOrgPersonList(directors)

    // overwrite share structure
    this.setShareClasses(shareStructure.shareClasses)
    this.setResolutions(resolutions)

    // overwrite business contact -- only when user has marked new holding/primary business,
    // otherwise leave existing data from restored draft
    if (isNew) {
      const businessContact = business.authInfo?.contacts[0]
      if (businessContact) {
        this.setBusinessContact({
          email: businessContact.email,
          confirmEmail: businessContact.email,
          phone: businessContact.phone,
          extension: businessContact.extension
        })
      } else {
        // safety check - clear old business contact
        this.setBusinessContact({ ...EmptyContactPoint })
      }
    }

    // set new resulting business name and legal type
    // and update resources (since legal type may have changed)
    this.setNameRequestApprovedName(business.name)
    this.setEntityType(this.getLegalType(business.legalType))
    this.updateResources()
  }

  /**
   * Updates the resources, for use when the entity type may have changed.
   * NB - this is specific to amalgamation filings.
   */
  updateResources (): void {
    if (this.isAmalgamationFilingRegular) {
      const resources = AmalgamationRegResources.find(x => x.entityType === this.getEntityType) as ResourceIF
      this.setResources(resources)
    } else if (this.isAmalgamationFilingHorizontal || this.isAmalgamationFilingVertical) {
      const resources = AmalgamationShortResources.find(x => x.entityType === this.getEntityType) as ResourceIF
      this.setResources(resources)
    } else {
      throw new Error('invalid amalgamation filing type')
    }
  }

  //
  // HELPERS
  // (not all are used atm)
  //

  /** True if there a foreign company in the table. */
  get isAnyForeign (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (business.type === AmlTypes.FOREIGN))
  }

  /** True if there a BEN/CBEN in the table. */
  get isAnyBen (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (
      business.type === AmlTypes.LEAR &&
      (
        business.legalType === CorpTypeCd.BENEFIT_COMPANY ||
        business.legalType === CorpTypeCd.BEN_CONTINUE_IN
      )
    ))
  }

  /** True if there is a CC/CCC in the table. */
  get isAnyCcc (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (
      business.type === AmlTypes.LEAR &&
      (
        business.legalType === CorpTypeCd.BC_CCC ||
        business.legalType === CorpTypeCd.CCC_CONTINUE_IN
      )
    ))
  }

  /** True if there is a BC/C in the table. */
  get isAnyLimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (
      business.type === AmlTypes.LEAR &&
      (
        business.legalType === CorpTypeCd.BC_COMPANY ||
        business.legalType === CorpTypeCd.CONTINUE_IN
      )
    ))
  }

  /** True if there is a ULC/CUL in the table. */
  get isAnyUnlimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (
      business.type === AmlTypes.LEAR &&
      (
        business.legalType === CorpTypeCd.BC_ULC_COMPANY ||
        business.legalType === CorpTypeCd.ULC_CONTINUE_IN
      )
    ))
  }

  /** True if there is a BC company in the table. */
  get isAnyBcCompany (): boolean {
    return (this.isAnyBen || this.isAnyCcc || this.isAnyLimited || this.isAnyUnlimited)
  }

  /** The legal type of the new amalgamation filing. */
  getLegalType (legalType: CorpTypeCd): CorpTypeCd {
    switch (legalType) {
      case CorpTypeCd.CONTINUE_IN:
        return CorpTypeCd.BC_COMPANY

      case CorpTypeCd.BEN_CONTINUE_IN:
        return CorpTypeCd.BENEFIT_COMPANY

      case CorpTypeCd.CCC_CONTINUE_IN:
        return CorpTypeCd.BC_CCC

      case CorpTypeCd.ULC_CONTINUE_IN:
        return CorpTypeCd.BC_ULC_COMPANY

      default:
        return legalType
    }
  }
}
