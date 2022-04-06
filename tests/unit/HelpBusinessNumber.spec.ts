import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import HelpBusinessNumber from '@/components/Registration/HelpBusinessNumber.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('HelpBusinessNumber', () => {
  it('displays expected content for SP entity type', async () => {
    store.state.stateModel.entityType = 'SP'
    const wrapper = mount(HelpBusinessNumber, { vuetify, store })
    const vm = wrapper.vm as any

    // sanity check
    expect(wrapper.find('#help-business-number')).toBeDefined()

    // verify collapsed component
    let helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(1)
    expect(helpBtns.at(0).text()).toBe('Help with Business Number')
    expect(wrapper.find('.help-section').exists()).toBe(false)

    // click help button and verify expanded component
    await vm.$el.querySelector('.help-btn').click()
    helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(2)
    expect(helpBtns.at(0).text()).toBe('Hide Help')
    expect(helpBtns.at(1).text()).toBe('Hide Help')
    expect(wrapper.find('.help-section').exists()).toBe(true)

    // there should be 2 unordered lists
    const unorderedLists = wrapper.findAll('ul')
    expect(unorderedLists.length).toBe(2)

    // list 1 should have 5 items
    const list1Items = unorderedLists.at(0).findAll('li')
    expect(list1Items.length).toBe(5)

    // list 2 should have 1 item
    const list2Items = unorderedLists.at(1).findAll('li')
    expect(list2Items.length).toBe(1)

    // there should be 5 paragraphs
    const paras = wrapper.findAll('p')
    expect(paras.length).toBe(5)
    expect(paras.at(0).text()).toContain('The supplied business number will')
    expect(paras.at(0).text()).toContain('if the sole proprietorship you are')
    expect(paras.at(1).text()).toContain('You can find your business number')
    expect(paras.at(2).text()).toContain('You may also have a business number')
    expect(paras.at(3).text()).toContain('Please contact the Canada Revenue')
    expect(paras.at(4).text()).toContain('To learn more,')

    // there should be 3 anchors/hyperlinks
    const links = wrapper.findAll('a')
    expect(links.length).toBe(3)
    expect(links.at(0).text()).toContain('a program account by Canada Revenue')
    expect(links.at(1).text()).toContain('1-800-959-5525')
    expect(links.at(2).text()).toContain('visit the Business Number information')

    wrapper.destroy()
  })

  it('displays expected content for GP entity types', async () => {
    store.state.stateModel.entityType = 'GP'
    const wrapper = mount(HelpBusinessNumber, { vuetify, store })
    const vm = wrapper.vm as any

    // sanity check
    expect(wrapper.find('#help-business-number')).toBeDefined()

    // verify collapsed component
    let helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(1)
    expect(helpBtns.at(0).text()).toBe('Help with Business Number')
    expect(wrapper.find('.help-section').exists()).toBe(false)

    // click help button and verify expanded component
    await vm.$el.querySelector('.help-btn').click()
    helpBtns = wrapper.findAll('.help-btn')
    expect(helpBtns.length).toBe(2)
    expect(helpBtns.at(0).text()).toBe('Hide Help')
    expect(helpBtns.at(1).text()).toBe('Hide Help')
    expect(wrapper.find('.help-section').exists()).toBe(true)

    // there should be 1 unordered list
    const unorderedLists = wrapper.findAll('ul')
    expect(unorderedLists.length).toBe(1)

    // list 1 should have 5 items
    const list1Items = unorderedLists.at(0).findAll('li')
    expect(list1Items.length).toBe(5)

    // there should be 4 paragraphs
    const paras = wrapper.findAll('p')
    expect(paras.length).toBe(4)
    expect(paras.at(0).text()).toContain('The supplied business number will')
    expect(paras.at(0).text()).toContain('if the firm you are registering')
    expect(paras.at(1).text()).toContain('You can find your business number')
    expect(paras.at(2).text()).toContain('Please contact the Canada Revenue')
    expect(paras.at(3).text()).toContain('To learn more,')

    // there should be 3 anchors/hyperlinks
    const links = wrapper.findAll('a')
    expect(links.length).toBe(3)
    expect(links.at(0).text()).toContain('a program account by Canada Revenue')
    expect(links.at(1).text()).toContain('1-800-959-5525')
    expect(links.at(2).text()).toContain('visit the Business Number information')

    wrapper.destroy()
  })
})
