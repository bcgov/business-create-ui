import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { PdfPageSize } from '@/enums/pdfPageSize'
import { waitForUpdate } from '../wait-for-update'

const vuetify = new Vuetify({})

// Note: the following arrayBuffer code is needed as jest does not provide arrayBuffer
//  and this is required to test the scenarios where the pdf.js library is used.
File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer as any
Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer as any

// mock the console.log function to hide PDF library warnings (due to invalid mocked PDF files)
console.log = vi.fn()

function myArrayBuffer () {
  // this: File or Blob
  return new Promise(resolve => {
    const fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fr.readAsArrayBuffer(this)
  })
}

describe('FileUploadPreview component', () => {
  // mock some large PDF files
  const oneMBFile = new File([new ArrayBuffer(1048576)], 'oneMBFile.pdf', { type: 'application/pdf' })
  const elevenMBFile = new File([new ArrayBuffer(1048576 * 11)], 'elevenMBFile.pdf', { type: 'application/pdf' })

  let inputValueGet
  let inputValueSet
  let inputValue = ''
  let inputFilesGet

  // Note: The DataTransfer object can be used to assign files to the file input but this isn't supported
  //  by JSDOM yet.  The following(setFileInput and the code in beforeEach functions) code was required
  //  in order to set the file associated with the file input.
  function setupFileInput (fileInput: Wrapper<Vue>) {
    Object.defineProperty(fileInput.element, 'files', {
      get: inputFilesGet
    })
    Object.defineProperty(fileInput.element, 'value', {
      get: inputValueGet,
      set: inputValueSet
    })
  }

  beforeEach(() => {
    inputFilesGet = vi.fn()
    inputValueGet = vi.fn().mockReturnValue(inputValue)
    inputValueSet = vi.fn().mockImplementation(v => { inputValue = v })
  })

  it('displays file upload preview component', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { maxSize: 10 * 1024 },
      vuetify
    })

    expect(wrapper.find('.file-upload-preview').exists()).toBe(true)
    expect(wrapper.find('.file-upload-preview input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('.file-upload-preview button').exists()).toBe(true)
    expect(wrapper.find('.v-messages__message').text()).toEqual('File must be a PDF. Maximum 30MB.')

    wrapper.destroy()
  })

  it('accepts when file is not required and not provided', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { inputFile: null, isRequired: false },
      vuetify
    })

    const fileInput = wrapper.find('.file-upload-preview input[type="file"]')
    await fileInput.trigger('change')
    expect(wrapper.find('.error--text .v-messages__message').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('rejects when file is required and not provided', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { inputFile: null, isRequired: true },
      vuetify
    })

    const fileInput = wrapper.find('.file-upload-preview input[type="file"]')
    await fileInput.trigger('change')
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('File is required')

    wrapper.destroy()
  })

  it('accepts when file size is below max size', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { maxSize: 10 * 1024 },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = oneMBFile.name
    inputFilesGet.mockReturnValue([oneMBFile])
    await fileInput.trigger('change')
    expect(wrapper.find('.error--text .v-messages__message').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('rejects when max file size is exceeded', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { maxSize: 10 * 1024 },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = elevenMBFile.name
    inputFilesGet.mockReturnValue([elevenMBFile])
    await fileInput.trigger('change')
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Exceeds maximum 10 MB file size')

    wrapper.destroy()
  })

  it('correctly displays custom error message', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: {},
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = oneMBFile.name
    inputFilesGet.mockReturnValue([oneMBFile])
    await wrapper.setProps({ customErrorMessage: 'test custom error message' })
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('test custom error message')

    wrapper.destroy()
  })

  it('accepts when pdf page size is accepted size', async () => {
    const fs = require('fs')
    const data = fs.readFileSync('./tests/unit/test-data/letterSize.pdf', 'utf8')
    const letterSizePdf = new File([data], 'letterSize.pdf', { type: 'application/pdf' })
    const wrapper = mount(FileUploadPreview, {
      propsData: { pdfPageSize: PdfPageSize.LETTER_SIZE },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = letterSizePdf.name
    inputFilesGet.mockReturnValue([letterSizePdf])
    await fileInput.trigger('change')
    expect(wrapper.find('.error--text .v-messages__message').exists()).toBeFalsy()

    wrapper.destroy()
  })

  it('rejects when pdf page size is not accepted size', async () => {
    const fs = require('fs')
    const data = fs.readFileSync('./tests/unit/test-data/nonLetterSize.pdf', 'utf8')
    const nonLetterSizePdf = new File([data], 'nonLetterSize.pdf', { type: 'application/pdf' })
    const wrapper = mount(FileUploadPreview, {
      propsData: { pdfPageSize: PdfPageSize.LETTER_SIZE },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = nonLetterSizePdf.name
    inputFilesGet.mockReturnValue([nonLetterSizePdf])
    await fileInput.trigger('change')
    await waitForUpdate(5)
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Document must be set to fit onto 8.5” x 11” letter-size paper')

    wrapper.destroy()
  }, 10000)

  it('rejects when the second page is not an accepted size', async () => {
    const fs = require('fs')
    const data = fs.readFileSync('./tests/unit/test-data/invalidSecondPage.pdf', 'utf8')
    const invalidSecondPagePdf = new File([data], 'invalidSecondPage.pdf', { type: 'application/pdf' })
    const wrapper = mount(FileUploadPreview, {
      propsData: { pdfPageSize: PdfPageSize.LETTER_SIZE },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = invalidSecondPagePdf.name
    inputFilesGet.mockReturnValue([invalidSecondPagePdf])
    await fileInput.trigger('change')
    await waitForUpdate(5)
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Document must be set to fit onto 8.5” x 11” letter-size paper')

    wrapper.destroy()
  }, 10000)

  it('rejects encrypted files', async () => {
    const fs = require('fs')
    const data = fs.readFileSync('./tests/unit/test-data/encrypted.pdf', 'utf8')
    const encryptedPdf = new File([data], 'encrypted.pdf', { type: 'application/pdf' })
    const wrapper = mount(FileUploadPreview, {
      propsData: { pdfPageSize: PdfPageSize.LETTER_SIZE },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = encryptedPdf.name
    inputFilesGet.mockReturnValue([encryptedPdf])
    await fileInput.trigger('change')
    await waitForUpdate(3)
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('File must be unencrypted')

    wrapper.destroy()
  })

  it('rejects copy, print and edit locked file', async () => {
    const fs = require('fs')
    const data = fs.readFileSync('./tests/unit/test-data/copyPrintEditContentLocked.pdf', 'utf8')
    const encryptedPdf =
      new File([data], 'copyPrintEditContentLocked.pdf', { type: 'application/pdf' })
    const wrapper = mount(FileUploadPreview, {
      propsData: { pdfPageSize: PdfPageSize.LETTER_SIZE },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = encryptedPdf.name
    inputFilesGet.mockReturnValue([encryptedPdf])
    await fileInput.trigger('change')
    await waitForUpdate(3)
    const messages = wrapper.findAll('.error--text .v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('File content cannot be locked')

    wrapper.destroy()
  })

  it('fileSelected event emitted when file is selected', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { maxSize: 10 * 1024 },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = oneMBFile.name
    inputFilesGet.mockReturnValue([oneMBFile])
    await fileInput.trigger('change')
    await waitForUpdate(3)
    expect(wrapper.emitted('fileSelected').pop()[0]).toEqual(oneMBFile)

    wrapper.destroy()
  })

  it('isFileValid event emitted when file is selected', async () => {
    const wrapper = mount(FileUploadPreview, {
      propsData: { maxSize: 10 * 1024 },
      vuetify
    })

    const fileInput = wrapper.find('input[type="file"]')
    setupFileInput(fileInput)
    inputValue = oneMBFile.name
    inputFilesGet.mockReturnValue([oneMBFile])
    await fileInput.trigger('change')
    await waitForUpdate(3)
    expect(wrapper.emitted('fileValidity').pop()[0]).toEqual(true)

    wrapper.destroy()
  })
})
