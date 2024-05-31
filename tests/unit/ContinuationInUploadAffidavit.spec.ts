import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import UploadAffidavit from '@/components/ContinuationIn/UploadAffidavit.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { ExistingBusinessInfoIF } from '@/interfaces'

// Create a mock business object
const businessMock: ExistingBusinessInfoIF = {
  affidavitFile: null,
  affidavitFileKey: null,
  affidavitFileName: null,
  homeJurisdiction: {
    country: 'CA',
    region: 'AB'
  },
  homeIdentifier: '',
  homeIncorporationDate: '',
  homeLegalName: '',
  mode: 'EXPRO'
}

describe('Upload Affidavit component', () => {
  it('renders the component correctly', async () => {
    const wrapper = shallowMount(UploadAffidavit, {
      propsData: {
        business: businessMock
      },
      stubs: {
        FileUploadPreview: true
      }
    })

    await Vue.nextTick()

    // Verify main component exists
    expect(wrapper.findComponent(UploadAffidavit).exists()).toBe(true)

    // Check if the text content is rendered correctly
    expect(wrapper.text()).toContain('Upload the affidavit from the directors.')
    expect(wrapper.text()).toContain('Use a white background and a legible font with contrasting font colour')
    expect(wrapper.text()).toContain('PDF file type (maximum 30 MB file size)')

    // Check if FileUploadPreview component is rendered
    expect(wrapper.findComponent(FileUploadPreview).exists()).toBe(true)

    wrapper.destroy()
  })
})
