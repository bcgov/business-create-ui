import { AxiosResponse } from 'axios'
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { DocumentUpload } from '@/interfaces'

@Component({})
export default class DocumentMixin extends Vue {
  readonly UPLOAD_FAILED_MESSAGE = 'An error occurred while uploading.  Please try again.'
  readonly MAX_FILE_SIZE = 10 * 1024 // 10 MB in KB

  async getPresignedUrl (fileName: string): Promise<DocumentUpload> {
    const url = `documents/${fileName}/signatures`
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
    const options = {
      headers: {
        'Content-Type': file.type,
        'x-amz-meta-userid': `${userId}`,
        'x-amz-meta-key': `${key}`,
        'Content-Disposition': `attachment; filename=${file.name}`
      }
    }
    return axios.put(url, file, options)
      .then(response => {
        return response
      }).catch(error => {
        return error.response
      })
  }
}
