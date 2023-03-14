import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import RegistriesContactInfo from '@/components/common/RegistriesContactInfo.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

describe('ContactInfo', () => {
  it('Displays expected content', () => {
    const wrapper = mount(RegistriesContactInfo, { vuetify })

    // verify content
    const listItems = wrapper.findAll('.contact-container')
    expect(listItems.length).toBe(3)
    expect(listItems.at(0).find('span').text()).toBe('Canada and U.S. Toll Free:')
    expect(listItems.at(0).find('.contact-value').text()).toBe('1-877-526-1526')
    expect(listItems.at(1).find('span').text()).toBe('Victoria Office:')
    expect(listItems.at(1).find('.contact-value').text()).toBe('250-387-7848')
    expect(listItems.at(2).find('span').text()).toBe('Email:')
    expect(listItems.at(2).find('.contact-value').text()).toBe('BCRegistries@gov.bc.ca')

    wrapper.destroy()
  })
})
