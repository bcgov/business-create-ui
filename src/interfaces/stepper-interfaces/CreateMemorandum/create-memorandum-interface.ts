import { DocIF } from '@/interfaces'

export interface CreateMemorandumIF {
  valid: boolean
  memorandumConfirmed: boolean
  memorandumDoc: DocIF
  docKey: string
}
