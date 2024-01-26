import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import FirmContactInfo from '@/components/common/FirmContactInfo.vue'

const vuetify = new Vuetify({})

describe('FirmContactInfo', () => {
  it('Displays expected content', () => {
    const wrapper = mount(FirmContactInfo, { vuetify })

    // verify content
    const listItems = wrapper.findAll('.contact-container')
    expect(listItems.length).toBe(2)
    expect(listItems.at(0).find('span').text()).toBe('Canada and U.S. Toll Free:')
    expect(listItems.at(0).find('.contact-value').text()).toBe('1-877-370-1033')
    expect(listItems.at(1).find('span').text()).toBe('Victoria Office:')
    expect(listItems.at(1).find('.contact-value').text()).toBe('250-370-1033')

    wrapper.destroy()
  })
})
