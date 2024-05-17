import { ContinuationAuthorizationIF, ExistingBusinessInfoIF } from '@/interfaces'

// TODO: Add properties as needed
export interface ContinuationInStateIF {
  businessHomeValid: boolean
  continuationAuthorization: ContinuationAuthorizationIF
  existingBusinessInfo: ExistingBusinessInfoIF
}
