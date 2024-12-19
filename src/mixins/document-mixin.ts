import { Component, Vue } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import { AxiosInstance as axios } from '@/utils'
import { PresignedUrlIF, PdfInfoIF } from '@/interfaces'
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
      validationErrorMsg: 'Document must be set to fit onto 8.5” x 11” letter-size paper.'
    }
  }
  readonly DOCUMENT_TYPES = {
    contInAuthorization: {
      class: 'CORP',
      type: 'CNTA'
    },
    affidavitDocument: {
      class: 'CORP',
      type: 'DIRECTOR_AFFIDAVIT'
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

  /**
   * Gets a pre-signed URL for the specified filename.
   * @param filename the file name
   * @returns the presigned url object
   */
  async getPresignedUrl (fileName: string): Promise<PresignedUrlIF> {
    const url = `documents/${fileName}/signatures`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      })
  }

  /**
   * Uploads the specified file to the specified (Minio) URL.
   * @param url the URL to upload to
   * @param file the file to upload
   * @param key the file key
   * @param userId the file user id
   * @returns a promise to return the axios response or the error response
   */
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
   * Deletes a Minio document from Legal API.
   * @param documentKey the document key
   * @returns a promise to return the axios response or the error response
   */
  async deleteDocument (documentKey: string): Promise<AxiosResponse> {
    // safety checks
    if (!documentKey) {
      throw new Error('Invalid parameters')
    }

    const url = `documents/${documentKey}`

    return axios.delete(url)
  }

  /**
   * Downloads a Minio document from Legal API and prompts browser to open/save it.
   * @param documentKey the document key
   * @param documentName the document filename
   * @returns a promise to return the axios response or the error response
   */
  async downloadDocument (documentKey: string, documentName: string): Promise<AxiosResponse> {
    // safety checks
    if (!documentKey || !documentName) {
      throw new Error('Invalid parameters')
    }

    const url = `documents/${documentKey}`
    const config = {
      headers: { 'Accept': 'application/pdf' },
      responseType: 'blob' as 'json'
    }

    return axios.get(url, config).then(response => {
      if (!response) throw new Error('Null response')

      /* solution below is from https://github.com/axios/axios/issues/1392 */

      // it is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      const blob = new Blob([response.data], { type: 'application/pdf' })

      // use Navigator.msSaveOrOpenBlob if available (possibly IE)
      // warning: this is now deprecated
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/msSaveOrOpenBlob
      if (window.navigator && window.navigator['msSaveOrOpenBlob']) {
        window.navigator['msSaveOrOpenBlob'](blob, documentName)
      } else {
        // for other browsers, create a link pointing to the ObjectURL containing the blob
        const url = window.URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        window.document.body.appendChild(a)
        a.setAttribute('style', 'display: none')
        a.href = url
        a.download = documentName
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }

      return response
    })
  }

  /**
   * Checks whether all pages of given pdf file are of specified size.
   * @param file the pdf file to be checked
   * @param pageSize the page size to check for
   * @return a promise to return whether the pdf file is expected page size
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
      // check width and height
      const isValidPageSize = (width / pageSizeInfo.pointsPerInch === pageSizeInfo.width) &&
        (height / pageSizeInfo.pointsPerInch === pageSizeInfo.height)
      if (!isValidPageSize) return false
    }
    return true
  }

  /**
   * Retrieves file information for the given pdf file, specifically whether the file is
   * encrypted or locked.
   * @param file the pdf file
   * @return a promise to return the PDF info object, or null on error
   */
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
      return null // invalid pdf file
    }
  }

  /**
   * Returns file size as a string in MB, KB or bytes.
   * @param file the file whose size to return
   */
  friendlyFileSize (file: File): string {
    const size = file?.size || 0
    const sizeKB = size / 1024
    const sizeMB = sizeKB / 1024
    if (sizeMB > 1) return `${sizeMB.toFixed(1)} MB`
    if (sizeKB > 1) return `${sizeKB.toFixed(0)} KB`
    return `${size} bytes`
  }

  /**
   * Uploads the specified file to Document Record Service.
   * @param file the file to upload
   * @param documentClass the document class defined for the document service. e.g. 'CORP'
   * @param documentType the type of document. e.g. 'CNTA'
   * @param consumerDocumentId the identifier of one or more documents associated with the filing.
   * @returns a promise to return the axios response or the error response
   */
  async uploadDocumentToDRS (
    file: File,
    documentClass: string,
    documentType: string,
    consumerDocumentId: string = undefined
  ): Promise<AxiosResponse> {
    const consumerFilingDate = new Date().toISOString()
    let url = `documents/${documentClass}/${documentType}`
    url += `?consumerFilingDate=${consumerFilingDate}&consumerFilename=${file.name}`
    if (consumerDocumentId) {
      url += `&consumerDocumentId=${consumerDocumentId}`
    }

    const formData = new FormData()
    formData.append('file', file)

    return axios.post(url, formData)
      .then(response => {
        return response
      }).catch(error => {
        return error.response
      })
  }

  /**
   * Deletes a document from Document Record Service.
   * @param documentServiceId the unique identifier of document on Document Record Service
   * @returns a promise to return the axios response or the error response
   */
  async deleteDocumentFromDRS (documentServiceId: string): Promise<AxiosResponse> {
    // safety checks
    if (!documentServiceId) {
      throw new Error('Invalid parameters')
    }

    const url = `documents/drs/${documentServiceId}`

    return axios.delete(url)
  }
}
