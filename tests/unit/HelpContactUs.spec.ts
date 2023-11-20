import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { useStore } from '@/store/store'
import { createPinia, setActivePinia } from 'pinia'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'
import FirmContactInfo from '@/components/common/FirmContactInfo.vue'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

describe('HelpBusinessNumber', () => {
  it('displays expected content - non-firm types', async () => {
    store.stateModel.entityType = CorpTypeCd.BC_ULC_COMPANY
    const wrapper = mount(HelpContactUs, { vuetify })
    const vm = wrapper.vm as any

    // sanity check
    expect(wrapper.find('#help-contact-us')).toBeDefined()

    // verify collapsed component
    let helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(1)
    expect(helpBtns.at(0).text()).toBe('Need Help? Contact Us')
    expect(wrapper.find('.help-section').exists()).toBe(false)

    // click help button and verify expanded component
    await vm.$el.querySelector('.help-btn').click()
    helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(2)
    expect(helpBtns.at(0).text()).toBe('Hide Help')
    expect(helpBtns.at(1).text()).toBe('Hide Help')
    expect(wrapper.find('.help-section').exists()).toBe(true)

    // verify header
    expect(wrapper.find('.help-header h2').text()).toBe('Contact BC Registries')

    // verify paragraph
    expect(wrapper.findAll('p').at(0).text()).toContain('If you require further assistance adding a business or corporation, please contact us.')

    // verify contact info component
    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays expected content - firm types', async () => {
    store.stateModel.entityType = CorpTypeCd.PARTNERSHIP
    const wrapper = mount(HelpContactUs, { vuetify })
    const vm = wrapper.vm as any

    // sanity check
    expect(wrapper.find('#help-contact-us')).toBeDefined()

    // verify collapsed component
    let helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(1)
    expect(helpBtns.at(0).text()).toBe('Need Help? Contact Us')
    expect(wrapper.find('.help-section').exists()).toBe(false)

    // click help button and verify expanded component
    await vm.$el.querySelector('.help-btn').click()
    helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(2)
    expect(helpBtns.at(0).text()).toBe('Hide Help')
    expect(helpBtns.at(1).text()).toBe('Hide Help')
    expect(wrapper.find('.help-section').exists()).toBe(true)

    // verify header
    expect(wrapper.find('.help-header h2').text()).toBe('Contact BC Registries')

    // verify paragraph
    expect(wrapper.find('p').text()).toContain('If you require further assistance adding a business, please contact us.')

    // verify contact info component
    expect(wrapper.findComponent(FirmContactInfo).exists()).toBe(true)

    wrapper.destroy()
  })
})
