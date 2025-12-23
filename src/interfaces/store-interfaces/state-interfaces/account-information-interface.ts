import { Account } from 'sbc-common-components/src/util/constants'

/** Interface for account information object (current account) in store. */
export interface AccountInformationIF {
  accountStatus: string
  accountType: Account | null
  additionalLabel?: string
  id: number
  label: string
  productSettings?: string
  type: string
  urlorigin?: string
  urlpath?: string
}
