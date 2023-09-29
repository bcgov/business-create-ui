import { EntityState } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import { IsoDatePacific, ApiDateTimeUtc } from '@bcrs-shared-components/interfaces'
import { ContactPointIF, OfficeAddressIF } from '@/interfaces'

/** The Business Warning object. */
export interface BusinessWarningIF {
  code: string // FUTURE: use an enum
  message: string
  warningType: string
  filing: string
}

/** The Business object from the API. */
export interface BusinessIF {
  adminFreeze: boolean
  arMaxDate: IsoDatePacific // not used
  arMinDate: IsoDatePacific // not used
  businessContact: ContactPointIF
  businessId: string
  dissolutionDate: ApiDateTimeUtc // not used
  warnings?: Array<BusinessWarningIF>
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
  taxId?: string // aka Business Number // may be undefined
  state: EntityState
  stateFiling?: string
  startDate: ApiDateTimeUtc
  submitter: string // not used
}
