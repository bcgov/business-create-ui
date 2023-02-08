import { CorpTypeCd, NameRequestStates, NameRequestTypes } from '@/enums'

/**
 * Name request applicant interface.
 * Includes only the properties we care about.
 */
export interface NameRequestApplicantIF {
  addrLine1: string
  addrLine2: string
  addrLine3: string
  city: string
  countryTypeCd: string
  emailAddress: string
  firstName: string
  lastName: string
  middleName: string
  phoneNumber: string
  postalCd: string
  stateProvinceCd: string
}

/**
 * Name request name interaface.
 * Includes only the properties we care about.
 */
export interface NameRequestNameIF {
  name: string
  state: NameRequestStates
}

/**
 * Name request interface.
 * Includes only the properties we care about.
 */
export interface NameRequestIF {
  applicants: NameRequestApplicantIF // object, not array
  consentFlag: string
  expirationDate: string // yyyy-mm-ddRhh:mm:ss+00:00
  legalType: CorpTypeCd
  names: Array<NameRequestNameIF>
  nrNum: string
  request_action_cd: NameRequestTypes // eslint-disable-line camelcase
  state: NameRequestStates
}

// NB: use cloneDeep when assigning EmptyOrgPerson
export const EmptyNameRequest: NameRequestIF = {
  applicants: {} as NameRequestApplicantIF,
  consentFlag: null,
  expirationDate: null,
  legalType: null,
  names: [],
  nrNum: '',
  request_action_cd: null,
  state: null
}
