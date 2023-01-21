import Vue from 'vue'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import FilingSurveyDialog from '@/dialogs/FilingSurveyDialog.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Filing Survey Dialog', () => {
  it('renders the component properly', () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.find('.v-dialog').classes()).toContain('filing-survey-dialog')
    expect(wrapper.isVisible()).toBe(true)
    expect(wrapper.find('.v-card__title').text()).toBe('Filing Survey')
    expect(wrapper.findAll('p').length).toBe(3)
    expect(wrapper.findAll('p').at(0).text()).toContain('Do you want to')
    expect(wrapper.findAll('p').at(1).text()).toContain('This information can')
    expect(wrapper.findAll('p').at(2).text()).toContain('Privacy Statement')
    expect(wrapper.find('#dialog-no-button').exists()).toBe(true)
    expect(wrapper.find('#dialog-yes-button').exists()).toBe(true)

    wrapper.destroy()
  })

  it('emits an event when No button is clicked', async () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('no')).toBeUndefined()

    // verify and click No button
    const exitButton = wrapper.find('#dialog-no-button')
    expect(exitButton.text()).toBe('NOT RIGHT NOW')
    exitButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('no').length).toBe(1)

    wrapper.destroy()
  })

  it('emits an event when Yes button is clicked', async () => {
    const wrapper = mount(FilingSurveyDialog,
      {
        vuetify,
        store,
        propsData: { dialog: true }
      })

    expect(wrapper.emitted('yes')).toBeUndefined()

    // verify and click retry button
    const retryButton = wrapper.find('#dialog-yes-button')
    expect(retryButton.text()).toBe('YES, I\'LL PARTICIPATE')
    retryButton.trigger('click')
    await Vue.nextTick()

    expect(wrapper.emitted('yes').length).toBe(1)

    wrapper.destroy()
  })
})
