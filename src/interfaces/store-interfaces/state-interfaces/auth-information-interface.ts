import { ContactPointIF } from '@/interfaces'

// Auth information interface
export interface AuthInformationIF {
  status?: string
  contacts: ContactPointIF[]
  folioNumber: string
}
