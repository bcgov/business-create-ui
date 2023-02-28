import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import { getVuexStore } from '@/store'
import { mount } from '@vue/test-utils'
import SummaryRestoreBusiness from '@/components/Restoration/SummaryRestoreBusiness.vue'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// *** TODO: implement
xdescribe('Summary Restore Business component', () => {
  const wrapperFactory = () => mount(SummaryRestoreBusiness, {
    store,
    vuetify
  })

  beforeEach(() => {
    store.state.stateModel.restoration = {
      applicationDate: '2023-01-01',
      approvalType: 'VIA REGISTRAR',
      approvalTypeValid: true,
      businessNameValid: true,
      courtOrder: { fileNumber: null },
      expiry: null,
      noticeDate: '2023-01-01',
      relationships: ['Officer'],
      restorationTypeValid: true,
      type: 'fullRestoration'
    }

    // *** verify name and description (unknown, NR, number)
    // *** verify name translation (none, one, multiple)
    // *** verify restoration type (none, full, limited)
    // *** verify approval type (unknown, court order, via registrar)
  })

  it('renders the component properly', () => {
    // verify the component is rendered
    const wrapper = wrapperFactory()
    expect(wrapper.find('#summary-restore-business').exists()).toBe(true)
    wrapper.destroy()
  })

  it('shows full restoration details with Applicant Relationship=Officer', () => {
    const wrapper = wrapperFactory()
    expect(wrapper.find('#applicants-relationships').text()).toContain('Applicant\'s relationship(s): Officer.')
    wrapper.destroy()
  })

  it('shows limited restoration details', () => {
    store.state.stateModel.restoration.type = 'limitedRestoration'
    store.state.stateModel.restoration.relationships = []
    store.state.stateModel.restoration.expiry = '2023-12-08'
    const wrapper = wrapperFactory()
    expect(wrapper.find('#expires-on').text()).toContain('Expires on Dec 8, 2023')
    wrapper.destroy()
  })
})
