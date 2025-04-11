import { AuthorizationProofIF, ExistingBusinessInfoIF } from '@/interfaces'

export interface ContinuationInStateIF {
  continuationAuthorizationPageValid: boolean
  authorizationProof: AuthorizationProofIF
  existingBusinessInfo: ExistingBusinessInfoIF
}
