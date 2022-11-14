import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import HelpContactUs from '@/components/Registration/HelpContactUs.vue'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('HelpBusinessNumber', () => {
  it('displays expected content', async () => {
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
    expect(wrapper.find('p').text()).toContain('If you require further assistance')

    // verify contact info component
    expect(wrapper.findComponent(RegistriesContactInfo).exists()).toBe(true)

    wrapper.destroy()
  })
})
