import axios from 'axios'
import sinon from 'sinon'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import ChatPopup from '@/components/common/ChatPopup.vue'

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

Vue.use(Vuetify)
Vue.use(Vuex)

const localVue = createLocalVue()
const vuetify = new Vuetify({})

// stub isMobile, which we can't call during testing
const store = new Vuex.Store<any>({
  getters: {
    isMobile: () => false
  }
})

describe('ChatPopup component', () => {
  let wrapper: any

  beforeEach(async () => {
    window['webChatReason'] = 'Test'
    window['webChatStatusUrl'] = 'myhost/basePath/webchatStatus'
    window['webChatUrl'] = 'myhost/basePath/webchatUrl'

    // stub GET webchat status
    sinon.stub(axios, 'get').withArgs('myhost/basePath/webchatStatus')
      .returns(new Promise((resolve) => resolve({
        data: { 'status': 'open' }
      })))

    wrapper = mount(ChatPopup, { vuetify, localVue, store })
    await Vue.nextTick()
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('renders the components', () => {
    expect(wrapper.find(ChatPopup).exists()).toBe(true)
    expect(wrapper.find('#chat-button-wrapper').exists()).toBe(true)
    expect(wrapper.find('#open-tooltip-message').exists()).toBe(false)
    expect(wrapper.find('#closed-tooltip-message').exists()).toBe(false)
    expect(wrapper.find('#unavailable-tooltip-message').exists()).toBe(false)
  })

  it('displays the tooltip for the open webchat status', async (done) => {
    expect(wrapper.vm.chatStatus).toBe('open')
    await wrapper.find('#chat-button-wrapper').trigger('mouseenter')
    requestAnimationFrame(() => {
      expect(wrapper.find('#open-tooltip-message').text())
        .toBe('Click here to chat live with Helpdesk staff about Name Requests.')
      done()
    })
  })

  it('displays the tooltip for the closed webchat status', async (done) => {
    wrapper.vm.chatStatus = 'closed'
    await wrapper.find('#chat-button-wrapper').trigger('mouseenter')
    requestAnimationFrame(() => {
      expect(wrapper.find('#closed-tooltip-message').text().replace(/\s+/g, ' '))
        .toBe('We are closed. The Service BC Contact Centre is open Monday through Friday 7:30am – 5:00pm Pacific Time ' +
          'excluding BC statutory holidays.'.replace(/\s+/g, ' '))
      done()
    })
  })

  it('displays the tooltip for unavailable webchat status', async (done) => {
    wrapper.vm.chatStatus = 'response error'
    await wrapper.find('#chat-button-wrapper').trigger('mouseenter')
    requestAnimationFrame(() => {
      expect(wrapper.find('#unavailable-tooltip-message').text())
        .toBe('Webchat is temporarily unavailable.')
      done()
    })
  })
})
