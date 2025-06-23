// Account information interface
export interface AccountInformationIF {
  accountType: string
  id: number
  label: string
  type: string
  // NB: there are other fields but we don't need them
  [x: string | number | symbol]: unknown
}

export const EmptyAccountInformation: AccountInformationIF = {
  accountType: '',
  id: null,
  label: '',
  type: ''
}
