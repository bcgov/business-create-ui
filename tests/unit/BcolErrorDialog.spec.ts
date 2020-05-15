/* eslint promise/param-names: 0, prefer-promise-reject-errors: 0 */
import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import { BcolErrorDialog } from '@/components/dialogs'
Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('BcolErrorDialog - Verify parameters passed in are displayed correctly', () => {
  it('displays generic message for normal users', () => {
    const wrapper = shallowMount(BcolErrorDialog,
      {
        propsData: {
          filingType: 'Incorporation Application',
          bcolObject: {
            title: 'Error',
            detail: 'A BCOL payment error has occured'
          }
        },
        store,
        vuetify
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Payment Incomplete - Error')
    expect(wrapper.find('#dialog-content').text())
      .toContain('A BCOL payment error has occured')
    expect(wrapper.find('#dialog-header').text())
      .toBe('This Incorporation Application could not be filed for the following reason:')
    expect(wrapper.find('#dialog-retry-button')).toBeDefined()

    wrapper.destroy()
  })
})
