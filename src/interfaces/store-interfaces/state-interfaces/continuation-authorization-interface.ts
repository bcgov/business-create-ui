export interface ContinuationAuthorizationIF {
  files: Array<{
    file: File // only used by UI
    fileKey: string
    fileName: string
  }>
  date: string // YYYY-MM-DD
  expiryDate?: string // YYYY-MM-DD
}
