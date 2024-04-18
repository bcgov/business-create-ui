import { Component, Vue } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import { AxiosInstance as axios } from '@/utils'
import { DocumentUpload, PdfInfoIF } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'

@Component({})
export default class DocumentMixin extends Vue {
  readonly UPLOAD_FAILED_MESSAGE = 'An error occurred while uploading.  Please try again.'
  readonly MAX_FILE_SIZE = 30 * 1024 // 30 MB in KB
  readonly pageSizeDict = {
    LETTER: {
      pointsPerInch: 72,
      width: 8.5,
      height: 11,
      validationErrorMsg: 'Document must be set to fit onto 8.5” x 11” letter-size paper'
    }
  }

  pdfjsLib: any

  // use beforeCreate() instead of created() to avoid type conflict with components that use this mixin
  async beforeCreate (): Promise<void> {
    // NB: we load the lib and worker this way to avoid a memory leak (esp in unit tests)
    // NB: must use legacy build for unit tests not running in Node 18+
    this.pdfjsLib = pdfjs
    this.pdfjsLib.GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.entry')
  }

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
        console.log('Error getting presigned url =', error) // eslint-disable-line no-console
        throw error
      })
  }

  async uploadToUrl (url: string, file: File, key: string, userId: string): Promise<AxiosResponse> {
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

  /**
   * Checks whether pdf file is using specified page size by checking width and height of all pages of pdf file
   * @param file pdf file to be checked
   * @param pageSize enum value used to represent page size to check for
   * @return Promise<boolean> whether pdf file is expected page size
   */
  async isPageSize (file: File, pageSize: PdfPageSize): Promise<boolean> {
    const pageSizeInfo = this.pageSizeDict[pageSize]
    const arrayBuffer = await file.arrayBuffer()
    const data = new Uint8Array(arrayBuffer) // put it in a Uint8Array
    const document = await this.pdfjsLib.getDocument({ data }).promise
    for (let pageNum = 1; pageNum <= document.numPages; pageNum++) {
      const page = await document.getPage(pageNum)
      const [x, y, w, h] = page._pageInfo.view
      const width = w - x
      const height = h - y
      const isValidPageSize = (width / pageSizeInfo.pointsPerInch === pageSizeInfo.width) &&
        (height / pageSizeInfo.pointsPerInch === pageSizeInfo.height)
      if (!isValidPageSize) return false
    }
    return true
  }

  async retrieveFileInfo (file: File): Promise<PdfInfoIF> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const data = new Uint8Array(arrayBuffer) // put it in a Uint8Array
      const document = await this.pdfjsLib.getDocument({ data }).promise
      const perms = await document.getPermissions()
      return { isEncrypted: false, isContentLocked: !!perms }
    } catch (error) {
      if ((error as any).name === 'PasswordException') {
        return { isEncrypted: true, isContentLocked: true }
      }
    }
    return { isEncrypted: false, isContentLocked: false }
  }
}
