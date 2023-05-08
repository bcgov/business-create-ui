import Vue from 'vue'
import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import FileAndPayInvalidNameRequestDialog from '@/dialogs/FileAndPayInvalidNameRequestDialog.vue'
import { CorpTypeCd } from '@/enums'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

store.stateModel.nameRequest = {
  legalType: CorpTypeCd.BENEFIT_COMPANY,
  nrNum: 'NR 1234567'
}
store.stateModel.nameRequestApprovedName = 'My Name Request Inc.'

describe('FileAndPayInvalidNameRequestDialog - Verify that dialog is displayed correctly', () => {
  it('displays dialog with the proper store data', async () => {
    const wrapper = shallowMount(FileAndPayInvalidNameRequestDialog,
      {
        vuetify
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Name Request (NR) / Incorporation Application')
    expect(wrapper.findAll('p').at(0).text())
      .toContain('The Name Request NR 1234567 and the Incorporation Application for')
    expect(wrapper.findAll('p').at(0).text())
      .toContain('My Name Request Inc. are no longer valid.')
    expect(wrapper.findAll('p').at(1).text())
      .toContain('If you still wish to incorporate a Benefit Company, please contact Registry Staff ' +
        'as soon as possible.')
    expect(wrapper.findAll('p').at(2).text())
      .toContain('Registries contact information:')
    expect(wrapper.findAll('.info-section').at(0).text()).toContain('IMPORTANT:')
    expect(wrapper.findAll('.info-section').at(1).text()).toContain('Once the reservation period for a Name Request ' +
      'expires or is otherwise cancelled, that name becomes')
    expect(wrapper.findAll('.info-section').at(1).text())
      .toContain('available to anyone wishing to start their business with that name.')
    expect(wrapper.find('#dialog-okay-button')).toBeDefined()
    wrapper.destroy()
  })
})
