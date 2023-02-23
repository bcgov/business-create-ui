import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { shallowMount } from '@vue/test-utils'
import LegalServices from '@/services/legal-services'
import BusinessName from '@/components/Restoration/BusinessName.vue'
import { CorrectName } from '@bcrs-shared-components/correct-name/'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// mock services function
const mockFetchNameRequest = jest.spyOn((LegalServices as any), 'updateFiling').mockImplementation()

// *** TODO: fix/enhance
describe('Business Name component', () => {
  let wrapperFactory: any

  beforeAll(() => {
    // tombstone data for all tests
    store.state.stateModel.businessId = 'BC1234567'
    store.state.stateModel.entityType = 'BC'
    store.state.stateModel.business.legalName = 'My Business Name'
    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'
    store.state.stateModel.tombstone.filingType = 'restoration'

    wrapperFactory = () => shallowMount(BusinessName, {
      store,
      vuetify
    })
  })

  beforeEach(() => {
    // empty restoration before each test
    store.state.stateModel.restoration = {
      applicationDate: null,
      approvalType: null,
      approvalTypeValid: true,
      businessNameValid: false,
      courtOrder: {
        fileNumber: null
      },
      expiry: null,
      noticeDate: null,
      relationships: [],
      restorationTypeValid: false,
      type: null
    }

    // empty name request before each test
    store.state.stateModel.nameRequest = {
      applicants: {},
      consentFlag: null,
      entity_type_cd: null,
      expirationDate: null,
      furnished: null,
      legalType: null,
      names: [],
      nrNum: '',
      priorityCd: null,
      requestTypeCd: null,
      request_action_cd: null,
      state: null
    }

    // initial values before each test
    store.state.stateModel.nameRequestApprovedName = null
    store.state.stateModel.showErrors = false
  })

  it('renders the component', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.find('#business-name').exists()).toBe(true)
  })

  it('displays editing mode sub-components', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.find('label').text()).toBe('Business Name')
    expect(wrapper.findComponent(CorrectName).exists()).toBe(true)
  })

  it('displays display mode sub-components', () => {
    store.state.stateModel.nameRequestApprovedName = 'NR Approved Name'

    const wrapper = wrapperFactory()
    expect(wrapper.findComponent(NameRequestInfo).exists()).toBe(true)
  })

  xit('renders the component initially', () => {
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

  xit('selects the full restoration button if draft was a full restoration.', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('fullRestoration')
  })

  xit('selects the limited restoration button if draft was a limited restoration.', () => {
    store.state.stateModel.restoration.type = 'limitedRestoration'
    const wrapper = wrapperFactory()
    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
  })

  xit('changes the restoration type from full to limited when the corresponding button is pressed.', async () => {
    const wrapper = wrapperFactory()
    const input = wrapper.find('#limited-radio-button')
    input.setChecked()
    await Vue.nextTick()

    expect(wrapper.vm.$data.selectRestorationType).toEqual('limitedRestoration')
    expect(store.state.stateModel.restoration.type).toEqual('limitedRestoration')
    expect(store.state.stateModel.restoration.relationships).toEqual([])
  })

  xit('changes the restoration type from limited to full when the corresponding button is pressed.', async () => {
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
