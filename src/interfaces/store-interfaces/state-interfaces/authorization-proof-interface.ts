export interface AuthorizationProofIF {
  files: Array<{
    file: File // only used by UI
    fileKey: string
    fileName: string
  }>
  consumerDocumentId?: string
}
