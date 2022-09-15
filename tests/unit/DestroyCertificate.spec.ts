import Vue from 'vue'
import { wrapperFactory } from '../jest-wrapper-factory'
import DestroyCertificate from '@/components/Dissolution/DestroyCertificate.vue'

// Input field selectors to test changes to the DOM elements.
const selector = '.destroy-certificate-option'
const summaryErrorSelector = '.invalid-section'

describe('Destroy Certificate component', () => {
  let wrapper: any

  it('Updates the store correctly if a destroy certificate is selected', async () => {
    wrapper = wrapperFactory(
      DestroyCertificate,
      null,
      {
        dissolution: {
          hasCertificateDestroyed: false
        }
      }
    )

    expect(wrapper.vm.$data.hasCertificateDestroyed).toBe(false)

    const checkbox = wrapper.find(selector)
    checkbox.trigger('click')
    await Vue.nextTick()

    // Verify state is updated
    expect(wrapper.vm.$data.hasCertificateDestroyed).toBe(true)
  })

  it('Displays the summary text when the store has value', () => {
    wrapper = wrapperFactory(
      DestroyCertificate,
      { isSummary: true },
      {
        dissolution: {
          hasCertificateDestroyed: true
        }
      }
    )
    expect(wrapper.find('.destroy-certificate-summary-description').text()).not.toContain('Not entered')
  })

  it('Displays the error line in view if destroy certificate is not checked', () => {
    wrapper = wrapperFactory(
      DestroyCertificate,
      {
        showErrorSummary: true
      },
      {
        dissolution: {
          hasCertificateDestroyed: false
        }
      }
    )

    expect(wrapper.find(summaryErrorSelector)).toBeDefined()
  })
})
