import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import ContinuationAuthorization from '@/components/ContinuationIn/ContinuationAuthorization.vue'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { DatePicker as DatePickerShared } from '@bcrs-shared-components/date-picker'
import { FilingStatus } from '@/enums'
import MessageBox from '@/components/common/MessageBox.vue'

describe('Continuation Authorization component', () => {
  it('renders the component correctly - draft filing', async () => {
    const wrapper = wrapperFactory(ContinuationAuthorization)
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationAuthorization).exists()).toBe(true)
    expect(wrapper.find('#continuation-authorization').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstVcard = wrapper.findAll('.v-card').at(0)
    expect(firstVcard.find('form').exists()).toBe(true)
    expect(firstVcard.find('form > .row').exists()).toBe(true)
    expect(firstVcard.find('form > .row > .col-sm-3 > label').text()).toBe('Authorization Date')
    expect(firstVcard.find('form > .row > .col-sm-9').findComponent(DatePickerShared).exists()).toBe(true)

    const secondVcard = wrapper.findAll('.v-card').at(1)
    const rows = secondVcard.findAll('.row')
    expect(rows.length).toBe(2)

    expect(rows.at(0).find('.col-sm-3 > label').text()).toBe('Upload File')
    expect(rows.at(0).find('.col-sm-9 > p').text()).toContain('Upload documents that support')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('Use a white background')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('PDF file type')
    expect(rows.at(0).find('.col-sm-9 > ul').text()).toContain('Maximum 5 files')

    expect(rows.at(1).classes()).toContain('upload-file-row')
    expect(rows.at(1).find('.col-sm-9').findComponent(FileUploadPreview).exists()).toBe(true)

    wrapper.destroy()
  })

  it('renders the component correctly - change-requested filing', async () => {
    const wrapper = wrapperFactory(
      ContinuationAuthorization,
      null,
      {
        tombstone: { filingStatus: FilingStatus.CHANGE_REQUESTED },
        continuationIn: { existingBusinessInfo: { latestReviewComment: 'comment' } }
      }
    )
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(ContinuationAuthorization).exists()).toBe(true)
    expect(wrapper.find('#continuation-authorization').exists()).toBe(true)

    // spot check some content (structure / text)
    const firstVcard = wrapper.findAll('.v-card').at(0)
    expect(firstVcard.find('form').exists()).toBe(true)
    expect(firstVcard.find('form > .row').exists()).toBe(true)
    expect(firstVcard.find('form > .row > .col-sm-3 > label').text()).toBe('Authorization Date')
    expect(firstVcard.find('form > .row > .col-sm-9').findComponent(DatePickerShared).exists()).toBe(true)

    const secondVcard = wrapper.findAll('.v-card').at(1)
    const rows = secondVcard.findAll('.row')
    expect(rows.length).toBe(3)

    expect(rows.at(2).find('.col-sm-9').findComponent(MessageBox).exists()).toBe(true)

    wrapper.destroy()
  })
})
