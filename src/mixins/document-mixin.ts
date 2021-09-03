import { AxiosResponse } from 'axios'
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { DocumentUpload } from '@/interfaces'

@Component({})
export default class DocumentMixin extends Vue {
  async getPresignedUrl (fileName: string): Promise<DocumentUpload> {
    let url = `documents/${fileName}/signatures`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      }).catch(error => {
        throw error
      })
  }

  async uploadToUrl (url: string, file:File, key:String, userId: string): Promise<AxiosResponse> {
    var options = {
      headers: {
        'Content-Type': file.type,
        'x-amz-meta-userid': `${userId}`,
        'x-amz-meta-key': `${key}`,
        'Content-Disposition': `attachment; filename=${file.name}`
      }
    }

    try {
      let response = await axios.put(
        url, file, options
      )
      return response
    } catch (error) {
      return error.response
    }
  }
}
