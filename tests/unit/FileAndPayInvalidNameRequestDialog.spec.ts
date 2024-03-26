import Vuetify from 'vuetify'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import FileAndPayInvalidNameRequestDialog from '@/dialogs/FileAndPayInvalidNameRequestDialog.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NameRequestIF } from '@bcrs-shared-components/interfaces'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

store.stateModel.nameRequest = {
  legalType: CorpTypeCd.BENEFIT_COMPANY,
  nrNum: 'NR 1234567'
} as NameRequestIF
store.stateModel.nameRequestApprovedName = 'My Benefit Company Inc.'

describe('File And Pay Invalid Name Request Dialog', () => {
  it('displays dialog with the proper store data', async () => {
    const wrapper = shallowMount(FileAndPayInvalidNameRequestDialog,
      {
        vuetify
      })

    expect(wrapper.find('#dialog-title').text()).toBe('Invalid Name Request / Filing')
    expect(wrapper.findAll('p').at(0).text()).toContain('The Name Request NR 1234567 and the filing for')
    expect(wrapper.findAll('p').at(0).text()).toContain('My Benefit Company Inc. are no longer valid.')
    expect(wrapper.findAll('p').at(1).text()).toContain('If you are trying to register a new business,')
    expect(wrapper.findAll('p').at(1).text()).toContain('please contact Registry Staff as soon as possible.')
    expect(wrapper.findAll('p').at(2).text()).toBe('Registries contact information:')
    expect(wrapper.find('.info-section').text()).toContain('IMPORTANT: If a Name Request expires or is')
    expect(wrapper.find('.info-section').text()).toContain('otherwise cancelled, that name becomes available')
    expect(wrapper.find('.info-section').text()).toContain('to anyone wishing to use it for their business.')
    expect(wrapper.find('#dialog-okay-button')).toBeDefined()

    wrapper.destroy()
  })
})
