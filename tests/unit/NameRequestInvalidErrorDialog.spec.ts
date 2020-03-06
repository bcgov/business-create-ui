import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { NameRequestInvalidErrorDialog } from '@/components/dialogs'
import { NameRequestStates } from '@/enums/nameRequestStates'

Vue.use(Vuetify)

const vuetify = new Vuetify({})

describe('NameRequestInvalidErrorDialog - Displays Error/Warning messages', () => {
  fit('displays name request not found message', () => {
    const wrapper = shallowMount(NameRequestInvalidErrorDialog,
      {
        propsData: {
          dialog: true,
          type: NameRequestStates.NOTFOUND
        },
        vuetify
      })

    expect(wrapper.find('.v-card__title').text()).toBe('Name Request Not Found')
    expect(wrapper.find('.v-card__text').text())
      .toContain('The specified name request number could not be found.')
    wrapper.destroy()
  })
})
