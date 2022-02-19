export interface BusinessContactIF {
  email: string
  confirmEmail?: string
  phone: string
  extension?: number
}

export const EmptyBusinessContact: BusinessContactIF = {
  email: '',
  confirmEmail: null,
  phone: '',
  extension: null
}
