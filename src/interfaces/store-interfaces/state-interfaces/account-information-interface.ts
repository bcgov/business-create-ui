// Account information interface
export interface AccountInformationIF {
  accountType: string
  id: number
  label: string
  type: string
}

export const EmptyAccountInformation: AccountInformationIF = {
  accountType: '',
  id: null,
  label: '',
  type: ''
}
