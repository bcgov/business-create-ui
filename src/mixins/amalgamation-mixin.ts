import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmlRoles, AmlStatuses, AmlTypes, RestorationTypes } from '@/enums'
import { AmalgamatingBusinessIF } from '@/interfaces'
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

  /** Iterable array of rule functions, sorted by importance. */
  readonly rules = [
    this.notAffiliated,
    this.notHistorical,
    this.notInGoodStanding,
    this.limitedRestoration,
    this.futureEffectiveFiling,
    this.foreign,
    this.foreignUnlimited,
    this.cccMismatch,
    this.foreignUnlimited2,
    this.xproUlcCcc,
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

  /** Disallow if foreign into ULC if there is also a limited company. */
  foreignUnlimited (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && this.isTypeBcUlcCompany && this.isAnyLimited) {
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

  /** Disallow if foreign into ULC if there is also a limited company. */
  foreignUnlimited2 (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && this.isTypeBcUlcCompany && this.isAnyLimited) {
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

  /**
   * Disallow only foreign businesses (including EPs).
   * (An amalgamation where all TINGs are foreign will be Phase 2.)
   */
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

  /**
   * Get the business information, mailing address, email, and first filing if in LEAR.
   * Otherwise, return error.
   */
  async fetchAmalgamatingBusinessInfo (item: any): Promise<any> {
    // Get the auth info, business info, addresses and filings concurrently.
    // Return data array; if any call failed, that item will be null.
    const data = await Promise.allSettled([
      AuthServices.fetchAuthInfo(item.identifier),
      LegalServices.fetchBusinessInfo(item.identifier),
      LegalServices.fetchAddresses(item.identifier),
      LegalServices.fetchFirstOrOnlyFiling(item.identifier)
    ]).then(results => results.map((result: any) => result.value || null))

    return {
      authInfo: data[0],
      businessInfo: data[1],
      addresses: data[2],
      firstFiling: data[3]
    }
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
    const stateFiling = await LegalServices.fetchFiling(business.businessInfo.stateFiling)
    return (
      stateFiling.restoration.type === RestorationTypes.LIMITED ||
      stateFiling.restoration.type === RestorationTypes.LTD_EXTEND
    )
  }

  /**
   * Re-fetch the draft amalgamating businesses information and set in the store.
   * Need to do that because the businesses might have changed from last draft save.
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
          email: tingBusiness.authInfo?.contacts[0].email || null,
          legalType: tingBusiness.businessInfo.legalType,
          address: tingBusiness.addresses?.registeredOffice.mailingAddress || null,
          isNotInGoodStanding: (tingBusiness.businessInfo.goodStanding === false),
          isFutureEffective: (tingBusiness.firstFiling.isFutureEffective === true),
          isLimitedRestoration: await this.isLimitedRestoration(tingBusiness)
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
