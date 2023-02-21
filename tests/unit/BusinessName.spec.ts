import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import LegalServices from '@/services/legal-services'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import { CorrectName } from '@bcrs-shared-components/correct-name/'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// mock services function
const mockFetchNameRequest = jest.spyOn((LegalServices as any), 'updateFiling').mockImplementation()

// *** TODO: fix/enhance
xdescribe('Business Name component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    // store.state.stateModel.restoration = {
    //   type: 'fullRestoration',
    //   expiry: null,
    //   relationships: [],
    //   businessNameValid: true
    //   restorationTypeValid: true
    // }
    store.state.stateModel.businessId = 'BC1234567'
    store.state.stateModel.entityType = 'BC'
    // store.state.stateModel.nameRequest = {
    //   applicants: {},
    //   consentFlag: null,
    //   expirationDate: null,
    //   legalType: null,
    //   names: [],
    //   nrNum: 'NR 1234567',
    //   request_action_cd: null,
    //   requestTypeCd: 'BC',
    //   state: null
    // }
    wrapperFactory = () => shallowMount(BusinessName, {
      store,
      vuetify
    })
  })

  it('renders the component initially', () => {
    const wrapper = wrapperFactory()
    console.log('>>> is new name: ', wrapper.vm.isNewName) // true

    // *** TODO: verify Name Request Info component
    // *** TODO: verify Undo button

    expect(wrapper.find('#business-name').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Business Name')

    // should be True initially
    expect(wrapper.vm.isCorrectingName).toBe(true)

    // should be False initially
    expect(wrapper.vm.hasNr).toBe(false)

    // should have 2 choices
    expect(wrapper.vm.correctionNameChoices).toEqual([ 'correct-name-to-number', 'correct-new-nr' ])

    // console.log('>>> business id: ', wrapper.vm.getBusinessId)
    // console.log('>>> entity type: ', wrapper.vm.getEntityType)
    // console.log('>>> name request: ', wrapper.vm.getNameRequest)
    // console.log('>>> NR num: ', wrapper.vm.getNameRequest.nrNum)

    // services function should be defined
    expect(wrapper.vm.LegalServices.fetchNameRequest).toBeDefined()

    // Correct Name Options component should be rendered
    expect(wrapper.findComponent(CorrectName).exists()).toBe(true)
  })

  it('selects the full restoration button if draft was a full restoration.', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('fullRestoration')
  })

  it('selects the limited restoration button if draft was a limited restoration.', () => {
    store.state.stateModel.restoration.type = 'limitedRestoration'
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
  })

  it('changes the restoration type from full to limited when the corresponding button is pressed.', async () => {
    const wrapper = wrapperFactory()
    const input = wrapper.find('#limited-radio-button')
    input.setChecked()
    await Vue.nextTick()

    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
    expect(store.state.stateModel.restoration.type).toEqual('limitedRestoration')
    expect(store.state.stateModel.restoration.relationships).toEqual([])
  })

  it('changes the restoration type from limited to full when the corresponding button is pressed.', async () => {
    store.state.stateModel.restoration.type = 'limitedRestoration'
    const wrapper = wrapperFactory()
    const input = wrapper.find('#full-radio-button')
    input.setChecked()
    await Vue.nextTick()

    expect(wrapper.vm.$data.selectRestorationType).toEqual('fullRestoration')
    expect(store.state.stateModel.restoration.type).toEqual('fullRestoration')
    expect(store.state.stateModel.restoration.expiry).toEqual(null)
  })
})
