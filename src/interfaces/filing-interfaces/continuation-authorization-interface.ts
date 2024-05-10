export interface ContinuationAuthorizationIF {
  files: Array<{
    file: File // only used by UI
    fileKey: string
    fileName: string
    fileUrl: string // presigned URL for future deletion (ticket 21110)
  }>
  authorityName: string
  date: string // YYYY-MM-DD
  expiryDate?: string // YYYY-MM-DD
  isConfirmed: boolean // only used by UI
}
