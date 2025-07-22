import { Component, Vue } from 'vue-property-decorator'
import { PdfInfoIF } from '@/interfaces'
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

  pdfjsLib: any

  // use beforeCreate() instead of created() to avoid type conflict with components that use this mixin
  async beforeCreate (): Promise<void> {
    // NB: we load the lib and worker this way to avoid a memory leak (esp in unit tests)
    // NB: must use legacy build for unit tests not running in Node 18+
    this.pdfjsLib = pdfjs
    this.pdfjsLib.GlobalWorkerOptions.workerSrc = await import('pdfjs-dist/legacy/build/pdf.worker.entry')
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
}
