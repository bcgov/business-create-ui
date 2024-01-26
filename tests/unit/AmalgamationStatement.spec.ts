import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AmalgamationStatement from '@/components/Amalgamation/AmalgamationStatement.vue'

const vuetify = new Vuetify({})
setActivePinia(createPinia())

describe('AmalgamationStatement', () => {
  it('displays expected content', async () => {
    const wrapper = mount(AmalgamationStatement, { vuetify })

    // sanity check
    expect(wrapper.find('#amalgamation-statement')).toBeDefined()

    // verify radio button component
    const radioBtns = wrapper.findAll('.radio-button')
    expect(radioBtns.length).toBe(2)
    expect(radioBtns.at(0).text()).toBe('With Court Approval')
    expect(radioBtns.at(1).text()).toBe('Without Court Approval')

    // verify statement text
    const btnsText = wrapper.findAll('.statement-text')
    expect(btnsText.length).toBe(2)
    expect(btnsText.at(0).text()).toContain('This amalgamation has been approved by the court')
    expect(btnsText.at(1).text()).toContain('This amalgamation has been effected without court approval.')

    wrapper.destroy()
  })
})
