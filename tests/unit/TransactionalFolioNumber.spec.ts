import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import TransactionalFolionNumber from '@/components/common/TransactionalFolioNumber.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// *** TODO: finish implementing tests
// *** TODO: use new unit test format if possible (see jest-wrapper-factory)
describe('Transactional Folio Number component', () => {
  it('Displays expected content', () => {
    const wrapper = mount(TransactionalFolionNumber, { vuetify, store })

    expect(wrapper.find('#transactional-folio-number-container').exists()).toBe(true)

    wrapper.destroy()
  })
})
