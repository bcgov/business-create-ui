import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmlRoles, AmlStatuses, AmlTypes, RestorationTypes } from '@/enums'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { AuthServices, LegalServices } from '@/services'

/**
 * Mixin that provides amalgamation rules, etc.
 */
@Component({})
export default class AmalgamationMixin extends Vue {
  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) getCurrentDate!: string
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeBcCcc!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean

  @Action(useStore) setAmalgamatingBusinesses!: (x: Array<any>) => void

  /** Iterable array of rule functions, sorted by importance. */
  readonly rules = [
    this.notAffiliated,
    this.notInGoodStanding,
    this.limitedRestoration,
    this.futureEffectiveFiling,
    this.foreign,
    this.foreignUlc,
    this.cccMismatch,
    this.ulcMismatch
  ]

  /** If we don't have an address, assume business is not affiliated (except for staff). */
  notAffiliated (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && !business.address && !this.isRoleStaff) {
      return AmlStatuses.ERROR_NOT_AFFILIATED
    }
    return null
  }

  /** Disallow if NIGS (except for staff). */
  notInGoodStanding (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isNotInGoodStanding && !this.isRoleStaff) {
      return AmlStatuses.ERROR_NOT_IN_GOOD_STANDING
    }
    return null
  }

  /** Disallow if limited restoration (except for staff). */
  limitedRestoration (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isLimitedRestoration && !this.isRoleStaff) {
      return AmlStatuses.ERROR_LIMITED_RESTORATION
    }
    return null
  }

  /**
   * Get the business information, mailing address, email, and first filing if in LEAR.
   * Otherwise, return error.
   */
  async fetchBusinessInfoForTing (item: any): Promise<any> {
    // Get the auth info, business info, addresses and filings in parallel.
    // Return data array; if any call failed, that item will be undefined.
    const data = await Promise.allSettled([
      AuthServices.fetchAuthInfo(item.identifier),
      LegalServices.fetchBusinessInfo(item.identifier),
      LegalServices.fetchAddresses(item.identifier),
      LegalServices.fetchFirstOrOnlyFiling(item.identifier)
    ]).then(results => results.map((result: any) => result.value))

    const authInfo = data[0]
    const businessInfo = data[1]
    const addresses = data[2]
    const firstFiling = data[3]

    return {
      authInfo,
      businessInfo,
      addresses,
      firstFiling
    }
  }

  /**
   * If there is a state filing and restoration expiry date isn't in the past and the state filing is a
   * limited restoration or limited restoration extension, then this business is in limited restoration.
   * @param business The business to check if is in Limited Restoration or not.
   */
  isLimitedRestoration = async (business: any): Promise<boolean> => {
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
      const tingBusiness = await this.fetchBusinessInfoForTing(item)
      if (!tingBusiness.authInfo) {
        return {
          type: AmlTypes.LEAR,
          role: AmlRoles.AMALGAMATING,
          identifier: item.identifier,
          name: item.name,
          legalType: item.legalType as unknown as CorpTypeCd
        }
      } else {
        return {
          type: AmlTypes.LEAR,
          role: AmlRoles.AMALGAMATING,
          identifier: tingBusiness.businessInfo.identifier,
          name: tingBusiness.businessInfo.legalName,
          email: tingBusiness.authInfo.contacts[0].email,
          legalType: tingBusiness.businessInfo.legalType,
          address: tingBusiness.addresses.registeredOffice.mailingAddress,
          isNotInGoodStanding: (tingBusiness.businessInfo.goodStanding === false),
          isFutureEffective: (tingBusiness.firstFiling.isFutureEffective === true),
          isLimitedRestoration: await this.isLimitedRestoration(tingBusiness)
        }
      }
    }

    this.setAmalgamatingBusinesses(
      await Promise.all(this.getAmalgamatingBusinesses.map(fetchTingInfo))
    )
  }

  /** Disallow if future effective filing. */
  futureEffectiveFiling (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.LEAR && business.isFutureEffective) {
      return AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING
    }
    return null
  }

  /**
   * Disallow altogether if foreign (except for staff).
   * (Could happen if staff added it and regular user resumes draft.)
   */
  foreign (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && !this.isRoleStaff) {
      return AmlStatuses.ERROR_FOREIGN
    }
    return null
  }

  /** Disallow if foreign into ULC if there is also a limited. */
  foreignUlc (business: AmalgamatingBusinessIF): AmlStatuses {
    if (business.type === AmlTypes.FOREIGN && this.isTypeBcUlcCompany && this.isAnyLimited) {
      return AmlStatuses.ERROR_FOREIGN
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

  /** Disallow ULC mismatch. */
  ulcMismatch (business: AmalgamatingBusinessIF): AmlStatuses {
    if (
      business.type === AmlTypes.LEAR &&
      business.legalType === CorpTypeCd.BC_ULC_COMPANY &&
      !this.isTypeBcUlcCompany
    ) {
      return AmlStatuses.ERROR_ULC_MISMATCH
    }
    return null
  }

  // TODO: cannot add foreign ULC if there is a BC company and ted is ULC

  // TODO: cannot add BC company if there is a foreign ULC and ted is ULC

  //
  // HELPERS
  //

  /** True if there a foreign company in the table. */
  get isAnyForeign (): boolean {
    return this.getAmalgamatingBusinesses.some(business => (business.type === AmlTypes.FOREIGN))
  }

  /** True if there a CCC in the table. */
  get isAnyCcc (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_CCC)
    )
  }

  /** True if there a limited company in the table. */
  get isAnyLimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_COMPANY)
    )
  }

  /** True if there is an unlimited company in the table. */
  get isAnyUnlimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === AmlTypes.LEAR && business.legalType === CorpTypeCd.BC_ULC_COMPANY)
    )
  }
}
