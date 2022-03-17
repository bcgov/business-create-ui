export interface CreateResolutionResourceIF {
  reviewConfirmHeader: string
  helpSection?: {
    header: string
    helpText: any
  }
  introSection: any,
  sampleFormSection?: any
  resolutionDateSection?: any
  resolutionTextSection?: any
  resolutionSignatureSection?: any
  confirmSection: any
  uploadSection?: any
}
