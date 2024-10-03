import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import AuthorizationProof from '@/components/ContinuationIn/AuthorizationProof.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { FilingStatus } from '@/enums'
import MessageBox from '@/components/common/MessageBox.vue'

describe('Authorization Proof component', () => {
  it('renders the component correctly - draft filing', async () => {
    const wrapper = wrapperFactory(AuthorizationProof)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(AuthorizationProof).exists()).toBe(true)
    expect(wrapper.find('#authorization-proof').exists()).toBe(true)

    // spot check some content (structure / text)
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(1)

    expect(rows.at(0).find('.col-sm-3 > label').text()).toBe('Upload File')
    expect(rows.at(0).find('.col-sm-9 > p').text()).toContain('Upload one or more files')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('Use a white background')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('PDF file type')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('Maximum 5 files')

    expect(rows.at(0).find('#add-document-button').text()).toBe('Add a Document')
    expect(rows.at(0).find('.error-text').exists()).toBe(false)
    expect(rows.at(0).find('.col-sm-9').findComponent(FileUploadPreview).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - change-requested filing', async () => {
    const wrapper = wrapperFactory(
      AuthorizationProof,
      null,
      {
        tombstone: { filingStatus: FilingStatus.CHANGE_REQUESTED },
        continuationIn: { existingBusinessInfo: { latestReviewComment: 'comment' } }
      }
    )
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(AuthorizationProof).exists()).toBe(true)
    expect(wrapper.find('#authorization-proof').exists()).toBe(true)

    // spot check some content (structure / text)
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(2)

    expect(rows.at(1).find('.col-sm-9').findComponent(MessageBox).exists()).toBe(true)

    wrapper.destroy()
  })
})
