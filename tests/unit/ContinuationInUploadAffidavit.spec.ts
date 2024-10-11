import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import UploadAffidavit from '@/components/ContinuationIn/UploadAffidavit.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { ExpandableHelp } from '@bcrs-shared-components/expandable-help'
import { ExistingBusinessInfoIF } from '@/interfaces'

// Create a mock business object
const businessMock: ExistingBusinessInfoIF = {
  affidavitFile: null,
  affidavitFileKey: null,
  affidavitFileName: null,
  previousJurisdiction: {
    country: 'CA',
    region: 'AB'
  },
  prevIncorporationNumber: '',
  prevIncorporationDate: '',
  prevBusinessName: '',
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

    // Verify that main component exists
    expect(wrapper.findComponent(UploadAffidavit).exists()).toBe(true)

    // Verify that text content is rendered correctly
    expect(wrapper.text()).toContain('There is additional information required by the Registrar')
    expect(wrapper.text()).toContain('for an unlimited liability corporation from Alberta.')

    expect(wrapper.find('ul').text()).toContain('Use a white background and a legible font')
    expect(wrapper.find('ul').text()).toContain('PDF file type (maximum 30 MB file size)')

    // Verify that FileUploadPreview component is rendered
    expect(wrapper.findComponent(FileUploadPreview).exists()).toBe(true)

    // Verify that ExpandableHelp component is rendered
    expect(wrapper.findComponent(ExpandableHelp).exists()).toBe(true)

    wrapper.destroy()
  })
})
