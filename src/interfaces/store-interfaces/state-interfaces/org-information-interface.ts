// Account information interface
export interface OrgInformationIF {
  branchName: string
  id: number
  orgType: string
  mailingAddress: any // not the same as AddressIF
  // NB: there are other fields but we don't need them
}
