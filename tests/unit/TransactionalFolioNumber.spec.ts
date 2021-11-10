import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import TransactionalFolionNumber from '@/components/common/TransactionalFolioNumber.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Transactional Folio Number component', () => {
  it('Displays expected content', () => {
    const wrapper = mount(TransactionalFolionNumber, { vuetify, store })

    // *** TODO: finish implementing tests
    expect(wrapper.find('#transactional-folio-number-container').exists()).toBe(true)

    wrapper.destroy()
  })
})
