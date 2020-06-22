import { Component, Vue } from 'vue-property-decorator'
import axios from '@/utils/axios-auth'

@Component({})
export default class BcolMixin extends Vue {
  async getErrorObj (errCode: string): Promise<any> {
    try {
      const fetchUrl: string = this.payApi + 'codes/errors/' + errCode
      // Currently no desirable way to handle errors during this request,
      // null is returned in any error situation regardless.
      const errObj: any = await axios.get(fetchUrl)
      if (errObj?.data) {
        return errObj.data
      }
      return null
    } catch (error) {
      return null
    }
  }

  getErrorCode (error: any): string {
    if (error?.response?.data?.errors) {
      const msgCode = error.response.data.errors.find(x =>
        x?.payment_error_type?.startsWith('BCOL')) // eslint-disable-line camelcase

      if (msgCode) {
        return msgCode.payment_error_type
      }
    }
    return null
  }

  get payApi (): string {
    return sessionStorage.getItem('PAY_API_URL')
  }
}
