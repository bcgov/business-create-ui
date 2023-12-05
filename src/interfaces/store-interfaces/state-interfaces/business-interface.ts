import { EntityState } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { IsoDatePacific, ApiDateTimeUtc } from '@bcrs-shared-components/interfaces'
import { ContactPointIF, OfficeAddressIF } from '@/interfaces'

/** The Business Warning object. */
export interface BusinessWarningIF {
  code: string // FUTURE: use an enum
  message: string
  warningType: string
  filing: string
}

/** The Alternate Name (aka operating name) object. */
export interface AlternateNameIF {
  entityType: CorpTypeCd
  identifier: string
  nameRegisteredDate: ApiDateTimeUtc
  nameStartDate: IsoDatePacific
  operatingName: string
}

/** The Business object from the API. */
export interface BusinessIF {
  adminFreeze: boolean
  alternateNames?: Array<AlternateNameIF>
  arMaxDate: IsoDatePacific // not used
  arMinDate: IsoDatePacific // not used
  businessContact: ContactPointIF
  businessId: string
  dissolutionDate: ApiDateTimeUtc // not used
  fiscalYearEndDate: IsoDatePacific // not used
  foundingDate: ApiDateTimeUtc | string
  goodStanding: boolean
  hasRestrictions: boolean // FUTURE: is this obsolete???
  identifier: string
  lastAddressChangeDate: IsoDatePacific
  lastAnnualGeneralMeetingDate: IsoDatePacific // not used
  lastAnnualReportDate: IsoDatePacific
  lastDirectorChangeDate: IsoDatePacific
  lastLedgerTimestamp: ApiDateTimeUtc // not used
  lastModified: ApiDateTimeUtc // not used
  legalName: string
  legalType: CorpTypeCd
  officeAddress: OfficeAddressIF
  nextAnnualReport: ApiDateTimeUtc // used for BCOMP only
  startDate: ApiDateTimeUtc
  state: EntityState
  stateFiling?: string
  submitter: string // not used
  taxId?: string // aka Business Number // may be undefined
  warnings?: Array<BusinessWarningIF>
}
