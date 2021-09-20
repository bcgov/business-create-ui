import { AxiosResponse } from 'axios'
import axios from '@/utils/axios-auth'
import { Component, Vue } from 'vue-property-decorator'
import { DocumentUpload } from '@/interfaces'
import { PdfPageSize } from '@/enums'
import pdfjsLib from 'pdfjs-dist/build/pdf'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.worker.min.js'

@Component({})
export default class DocumentMixin extends Vue {
  readonly UPLOAD_FAILED_MESSAGE = 'An error occurred while uploading.  Please try again.'
  readonly MAX_FILE_SIZE = 10 * 1024 // 10 MB in KB
  readonly pageSizeDict = {
    'LETTER': {
      'pointsPerInch': 72,
      'width': 8.5,
      'height': 11,
      'validationErrorMsg': 'Document must be set to fit onto 8.5” x 11” letter-size paper'
    }
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

  /**
   * Checks whether pdf file is using specified page size by checking width and height of 1st page of pdf file
   * @param file pdf file to be checked
   * @param pageSize enum value used to represent page size to check for
   * @return Promise<boolean> whether pdf file is expected page size
   */
  async isPageSize (file: File, pageSize: PdfPageSize): Promise<boolean> {
    const pageSizeInfo = this.pageSizeDict[pageSize]
    const pdfBufferData = await file.arrayBuffer()
    const pdfData = new Uint8Array(pdfBufferData) // put it in a Uint8Arrayza
    const pdf = await pdfjsLib.getDocument({ data: pdfData })
    const p1 = await pdf.getPage(1)
    const [x, y, w, h] = p1._pageInfo.view
    const width = w - x
    const height = h - y
    const isvalidPageSize = (width / pageSizeInfo.pointsPerInch === pageSizeInfo.width) &&
      (height / pageSizeInfo.pointsPerInch === pageSizeInfo.height)
    return isvalidPageSize
  }
}
