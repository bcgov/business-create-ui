// Reference to vuetify form api: https://vuetifyjs.com/en/api/v-form/#functions
export interface FormIF extends HTMLFormElement {
  reset(): void
  validate(): boolean
  resetValidation(): void
}
