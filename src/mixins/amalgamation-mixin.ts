import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmlRoles, AmlStatuses, AmlTypes, EntityStates, FilingStatus, RestorationTypes } from '@/enums'
import { AmalgamatingBusinessIF, EmptyNameRequest, NameRequestIF, NameTranslationIF } from '@/interfaces'
import { CorrectNameOptions } from '@bcrs-shared-components/enums/'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AuthServices, LegalServices } from '@/services'

/**
 * Mixin that provides amalgamation rules, etc.
 * Note that the error text is declared in BusinessStatus.vue.
 */
@Component({})
export default class AmalgamationMixin extends Vue {
  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) isAmalgamationFilingHorizontal!: boolean
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeBcCcc!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: Array<any>) => void
  @Action(useStore) setCorrectNameOption!: (x: CorrectNameOptions) => void
  @Action(useStore) setNameRequest!: (x: NameRequestIF) => void
  @Action(useStore) setNameRequestApprovedName!: (x: string) => void
  @Action(useStore) setNameTranslations!: (x: NameTranslationIF[]) => void

  /** Iterable array of rule functions, in order of processing. */
  readonly rules = [
    this.notAffiliated,
    this.notHistorical,
    this.notFrozen,
    this.notInGoodStanding,
    this.limitedRestoration,
    this.futureEffectiveFiling,
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

  /** If we don't have an address, assume business is not affiliated (except for staff). */
  notAffiliated (business: AmalgamatingBusinessIF): AmlStatuses {
    if (!this.isRoleStaff && business.type === AmlTypes.LEAR && !business.address) {
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

  /** Disallow if NIGS (except for staff). */
  notInGoodStanding (business: AmalgamatingBusinessIF): AmlStatuses {
    if (!this.isRoleStaff && business.type === AmlTypes.LEAR && business.isNotInGoodStanding) {
      return AmlStatuses.ERROR_NOT_IN_GOOD_STANDING
    }
    return null
  }

  /** Disallow if limited restoration (except for staff). */
  limitedRestoration (business: AmalgamatingBusinessIF): AmlStatuses {
    if (!this.isRoleStaff && business.type === AmlTypes.LEAR && business.isLimitedRestoration) {
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

  /** Disallow if a pending filing exists. */
  pendingFiling (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isPendingFiling) {
      return AmlStatuses.ERROR_PENDING_FILING
    }
    return null
  }

  /**
   * Disallow altogether if foreign or extra-pro (except for staff).
   * (Could happen if staff added it and regular user resumes draft.)
   */
  foreign (business: AmalgamatingBusinessIF): AmlStatuses {
    if (!this.isRoleStaff && business.type === AmlTypes.FOREIGN) {
      return AmlStatuses.ERROR_FOREIGN
    }
    return null
  }

  /** Disallow if foreign and there is also a BC company, into ULC. */
  foreignUnlimited (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && this.isAnyBcCompany && this.isTypeBcUlcCompany) {
      return AmlStatuses.ERROR_FOREIGN_UNLIMITED
    }
    return null
  }

  /** Disallow CCC mismatch. */
  cccMismatch (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_CCC && !this.isTypeBcCcc) {
      return AmlStatuses.ERROR_CCC_MISMATCH
    }
    return null
  }

  /** Disallow if BC and there is also a foreign, into ULC. */
  foreignUnlimited2 (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      business.legalType === CorpTypeCd.BC_COMPANY &&
      this.isAnyForeign &&
      this.isTypeBcUlcCompany
    ) {
      return AmlStatuses.ERROR_FOREIGN_UNLIMITED2
    }
    return null
  }

  /** Disallow extra-pro (A company) into ULC or CCC. */
  xproUlcCcc (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.FOREIGN &&
      (this.isTypeBcUlcCompany || this.isTypeBcCcc)
    ) {
      return AmlStatuses.ERROR_XPRO_ULC_CCC
    }
    return null
  }

  /** Disallow if ULC and there is also a foreign. */
  foreignUnlimited3 (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      business.legalType === CorpTypeCd.BC_ULC_COMPANY &&
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
   * Get the business information, mailing address, email, and first filing if in LEAR.
   * Otherwise, return error.
   */
  async fetchAmalgamatingBusinessInfo (item: any): Promise<any> {
    // Get the auth info, business info, addresses and filings concurrently.
    // NB - if any call failed, that item will be null.
    const [ authInfo, businessInfo, addresses, firstFiling ] =
      await Promise.allSettled([
        AuthServices.fetchAuthInfo(item.identifier),
        LegalServices.fetchBusinessInfo(item.identifier),
        LegalServices.fetchAddresses(item.identifier),
        LegalServices.fetchFirstOrOnlyFiling(item.identifier)
      ]).then(results => results.map((result: any) => result.value || null))

    return { authInfo, businessInfo, addresses, firstFiling }
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
    return (
      business.firstFiling?.isFutureEffective === true &&
      business.firstFiling?.status !== FilingStatus.COMPLETED &&
      business.firstFiling?.status !== FilingStatus.CORRECTED
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
   * Re-fetch the draft amalgamating businesses information and set in the store.
   * Need to do that because the businesses might have changed since last draft save.
   */
  async refetchAmalgamatingBusinessesInfo (): Promise<void> {
    const fetchTingInfo = async (item: any): Promise<AmalgamatingBusinessIF> => {
      const tingBusiness = await this.fetchAmalgamatingBusinessInfo(item)
      // no auth info and business info means foreign, otherwise LEAR (affiliated or non-affiliated)
      if (!tingBusiness.authInfo && !tingBusiness.businessInfo) {
        return {
          type: AmlTypes.FOREIGN,
          role: AmlRoles.AMALGAMATING,
          corpNumber: item.corpNumber,
          legalName: item.legalName,
          foreignJurisdiction: item.foreignJurisdiction
        } as AmalgamatingBusinessIF
      } else {
        return {
          type: AmlTypes.LEAR,
          role: AmlRoles.AMALGAMATING,
          identifier: tingBusiness.businessInfo.identifier,
          name: tingBusiness.businessInfo.legalName,
          email: tingBusiness.authInfo?.contacts[0].email,
          legalType: tingBusiness.businessInfo.legalType,
          address: tingBusiness.addresses?.registeredOffice.mailingAddress,
          isNotInGoodStanding: (tingBusiness.businessInfo.goodStanding === false),
          isFrozen: (tingBusiness.businessInfo.adminFreeze === true),
          isFutureEffective: this.isFutureEffective(tingBusiness),
          isPendingFiling: this.isPendingFiling(tingBusiness),
          isLimitedRestoration: await this.isLimitedRestoration(tingBusiness),
          isHistorical: (tingBusiness.businessInfo.state === EntityStates.HISTORICAL)
        } as AmalgamatingBusinessIF
      }
    }

    const promises = this.getAmalgamatingBusinesses.map(fetchTingInfo)
    const amalgamatingBusinesses = await Promise.all(promises)
    this.setAmalgamatingBusinesses(amalgamatingBusinesses)
  }

  //
  // HELPERS
  // (not all are used atm)
  //

  /** True if there a foreign company in the table. */
  get isAnyForeign (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (business.type === AmlTypes.FOREIGN))
  }

  /** True if there a Benefit Company in the table. */
  get isAnyBen (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BENEFIT_COMPANY)
    )
  }

  /** True if there is a BC CCC in the table. */
  get isAnyCcc (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_CCC)
    )
  }

  /** True if there is a BC (Limited) Company in the table. */
  get isAnyLimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_COMPANY)
    )
  }

  /** True if there is an BC ULC Company in the table. */
  get isAnyUnlimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_ULC_COMPANY)
    )
  }

  /** True if there is a BC company in the table. */
  get isAnyBcCompany (): boolean {
    return (this.isAnyBen || this.isAnyCcc || this.isAnyLimited || this.isAnyUnlimited)
  }
}
