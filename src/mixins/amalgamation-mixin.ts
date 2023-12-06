import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { AmalgamatingStatuses } from '@/enums'
import { AmalgamatingBusinessIF } from '@/interfaces'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

/**
 * Mixin that provides amalgamation rules, etc.
 */
@Component({})
export default class AmalgamationMixin extends Vue {
  @Getter(useStore) getAmalgamatingBusinesses!: AmalgamatingBusinessIF[]
  @Getter(useStore) isRoleStaff!: boolean
  @Getter(useStore) isTypeBcCcc!: boolean
  @Getter(useStore) isTypeBcUlcCompany!: boolean

  // *** TODO: finish this, maybe name them something recognizable...
  /** Iterable array of rule functions, sorted by importance. */
  readonly rules = [
    this.rule1,
    this.rule2,
    this.rule3,
    this.rule4,
    this.rule5,
    this.rule6
  ]

  // *** I'M STILL WONDERING IF I WANT TO USE THESE
  // readonly isLear = (item: AmalgamatingBusinessIF): boolean => (item?.type === 'lear')
  // readonly isForeign = (item: AmalgamatingBusinessIF): boolean => (item?.type === 'foreign')

  /** True if there a limited company in the table. */
  get isAnyLimited (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === 'lear' && business.legalType === CorpTypeCd.BC_COMPANY)
    )
  }

  /** True if there an unlimited company in the table in Alberta, Nova Scotia or USA. */
  get isAnyUnlimitedAbNsUsa (): boolean {
    return this.getAmalgamatingBusinesses.some(business =>
      (business.type === 'lear' && business.legalType === CorpTypeCd.BC_COMPANY)
    )
  }

  // readonly amalgamationRules = [
  //   {
  //     id: 0,
  //     rule: (v: any) => !!v || 'Required',
  //     status: AmalgamatingStatuses.ERROR_FOREIGN
  //   }
  // ]

  // A BC Company cannot amalgamate with an existing Unlimited Liability Company from Alberta,
  // Nova Scotia, or the USA to form a BC Unlimited Liability Company.

  // disallow foreign into ULC if there is also a limited
  rule1 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    if (business.type === 'foreign' && this.isTypeBcUlcCompany && this.isAnyLimited) {
      return AmalgamatingStatuses.ERROR_FOREIGN
    }
    return null
  }

  // disallow foreign altogether if not staff
  // (could happen if staff added it and regular user resumes draft)
  rule2 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    if (business.type === 'foreign' && !this.isRoleStaff) {
      return AmalgamatingStatuses.ERROR_FOREIGN
    }
    return null
  }

  // disallow foreign into ULC if there is also a limited
  rule3 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    if (business.type === 'foreign' && this.isTypeBcUlcCompany && this.isAnyLimited) {
      return AmalgamatingStatuses.ERROR_FOREIGN
    }
    return null
  }

  // assume business is not affiliated if we don't have address (non-staff only)
  rule4 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    // *** TODO: revert staff check
    if (business.type === 'lear' && !business.address /* && !this.isRoleStaff */) {
      return AmalgamatingStatuses.ERROR_AFFILIATION
    }
    return null
  }

  // identify CCC mismatch
  rule5 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    if (business.type === 'lear' && business.legalType === CorpTypeCd.BC_CCC && !this.isTypeBcCcc) {
      return AmalgamatingStatuses.ERROR_CCC_MISMATCH
    }
    return null
  }

  // disallow NIGS if not staff
  rule6 (business: AmalgamatingBusinessIF): AmalgamatingStatuses {
    // *** TODO: revert staff check
    if (business.type === 'lear' && !business.goodStanding /* && !this.isRoleStaff */) {
      return AmalgamatingStatuses.ERROR_NIGS
    }
    return null
  }

  // check if limited restoration
  // *** TODO

  // check for future effective filing
  // *** TODO
}
