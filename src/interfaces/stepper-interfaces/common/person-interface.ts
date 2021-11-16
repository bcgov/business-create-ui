export interface PersonIF {
  givenName: string
  additionalName?: string
  familyName: string
  email?: string
}

export const EmptyPerson: PersonIF = {
  givenName: '',
  familyName: '',
  additionalName: ''
}
