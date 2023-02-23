import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()
document.body.setAttribute('data-app', 'true')

const mockNrData = {
  applicants: {
    addrLine1: '45 Frasier Drive',
    addrLine2: null,
    addrLine3: null,
    city: 'Victoria',
    countryTypeCd: 'CA',
    postalCd: 'V9E 2A1',
    stateProvinceCd: 'BC',
    emailAddress: 'test@gov.bc.ca',
    phoneNumber: '250-356-9090',
    firstName: 'John',
    middleName: 'Joe',
    lastName: 'Doe'
  },
  consentFlag: null,
  expirationDate: '2020-06-24T07:00:00+00:00',
  legalType: 'BEN',
  names: [
    {
      name: 'MADRONA BREAD BASKET INC.',
      state: 'APPROVED'
    }
  ],
  nrNum: 'NR 1234567',
  request_action_cd: 'NEW',
  requestTypeCd: 'BC',
  state: 'APPROVED'
}

describe('Name Request Info with a NR', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BEN'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNum = mockNrData.nrNum
    wrapper = mount(NameRequestInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders name request info labels', () => {
    expect(wrapper.vm.$el.querySelector('#name-request').textContent)
      .toContain('Name Request')

    expect(wrapper.vm.$el.querySelector('#name-request-applicant').textContent)
      .toContain('Name Request Applicant')
  })

  it('renders the Name Request information with no data', () => {
    expect(wrapper.find('#condition-consent').exists()).toBe(false)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(5)

    expect(listItems[0].textContent).toBeDefined()
    expect(listItems[1].textContent).toContain('Entity Type:')
    expect(listItems[2].textContent).toContain('Request Type:')
    expect(listItems[3].textContent).toContain('Expiry Date:')
    expect(listItems[4].textContent).toContain('Status:')
  })

  it('renders the Name Request information with data', async () => {
    await wrapper.vm.$store.commit('mutateNameRequest', { ...mockNrData })
    await wrapper.vm.$store.commit('mutateNameRequestApprovedName', mockNrData.names[0].name)

    expect(wrapper.find('#condition-consent').exists()).toBe(false)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(5)

    expect(listItems[0].textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(listItems[4].textContent).toContain('Status: Approved')
  })

  it('renders the Name Request applicant information with data', async () => {
    await wrapper.vm.$store.commit('mutateNameRequest', { ...mockNrData })

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request-applicant ul li')
    expect(listItems.length).toEqual(4)

    expect(listItems[0].textContent).toContain('Name: John Joe Doe')
    expect(listItems[1].textContent).toContain('Address: 45 Frasier Drive, Victoria, BC, V9E 2A1, Canada')
    expect(listItems[2].textContent).toContain('Email: test@gov.bc.ca')
    expect(listItems[3].textContent).toContain('Phone: 250-356-9090')
  })

  it('renders the Name Request applicant information with no data', () => {
    const listItems = wrapper.vm.$el.querySelectorAll('#name-request-applicant ul li')
    expect(listItems.length).toEqual(4)

    expect(listItems[0].textContent).toContain('Name:')
    expect(listItems[1].textContent).toContain('Address:')
    expect(listItems[2].textContent).toContain('Email:')
    expect(listItems[3].textContent).toContain('Phone:')
  })

  it('renders the Name Request applicant information with multi address line data', async () => {
    store.state.stateModel.nameRequest = { ...mockNrData }
    store.state.stateModel.nameRequest.applicants.addrLine1 = 'line 1'
    store.state.stateModel.nameRequest.applicants.addrLine2 = 'line 2'
    store.state.stateModel.nameRequest.applicants.addrLine3 = 'line 3'
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request-applicant ul li')
    expect(listItems.length).toEqual(4)

    expect(listItems[0].textContent).toContain('Name: John Joe Doe')
    expect(listItems[1].textContent).toContain('Address: line 1, line 2, line 3, Victoria, BC, V9E 2A1, Canada')
    expect(listItems[2].textContent).toContain('Email: test@gov.bc.ca')
    expect(listItems[3].textContent).toContain('Phone: 250-356-9090')
  })

  it('renders the Name Request information with consent not required', async () => {
    store.state.stateModel.nameRequest = { ...mockNrData }
    store.state.stateModel.nameRequest.state = 'CONDITIONAL'
    store.state.stateModel.nameRequest.consentFlag = null
    store.state.stateModel.nameRequestApprovedName = mockNrData.names[0].name
    await Vue.nextTick()

    expect(wrapper.find('#condition-consent').exists()).toBe(true)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(6)

    expect(listItems[0].textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(listItems[4].textContent).toContain('Status: Conditional')
    expect(listItems[5].textContent).toContain('Condition/Consent: Not Required')
  })

  it('renders the Name Request information with consent received', async () => {
    store.state.stateModel.nameRequest = { ...mockNrData }
    store.state.stateModel.nameRequest.state = 'CONDITIONAL'
    store.state.stateModel.nameRequest.consentFlag = 'R'
    store.state.stateModel.nameRequestApprovedName = mockNrData.names[0].name
    await Vue.nextTick()

    expect(wrapper.find('#condition-consent').exists()).toBe(true)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(6)

    expect(listItems[0].textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(listItems[4].textContent).toContain('Status: Conditional')
    expect(listItems[5].textContent).toContain('Condition/Consent: Received')
  })

  it('renders the Name Request information with consent waived', async () => {
    store.state.stateModel.nameRequest = { ...mockNrData }
    store.state.stateModel.nameRequest.state = 'CONDITIONAL'
    store.state.stateModel.nameRequest.consentFlag = 'N'
    store.state.stateModel.nameRequestApprovedName = mockNrData.names[0].name
    await Vue.nextTick()

    expect(wrapper.find('#condition-consent').exists()).toBe(true)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(6)

    expect(listItems[0].textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(listItems[4].textContent).toContain('Status: Conditional')
    expect(listItems[5].textContent).toContain('Condition/Consent: Waived')
  })

  it('renders the Name Request information with consent required', async () => {
    store.state.stateModel.nameRequest = { ...mockNrData }
    store.state.stateModel.nameRequest.state = 'CONDITIONAL'
    store.state.stateModel.nameRequest.consentFlag = 'Y'
    store.state.stateModel.nameRequestApprovedName = mockNrData.names[0].name
    await Vue.nextTick()

    expect(wrapper.find('#condition-consent').exists()).toBe(true)

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request ul li')
    expect(listItems.length).toEqual(6)

    expect(listItems[0].textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(listItems[4].textContent).toContain('Status: Conditional')
    expect(listItems[5].textContent).toContain('Condition/Consent: Not Received')
  })
})

describe('Name Request Info component without a NR', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BEN'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNum = null
    store.state.stateModel.nameRequestApprovedName = null
    wrapper = mount(NameRequestInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders numbered company info', () => {
    expect(wrapper.vm.$el.querySelector('#numbered-company-info').textContent)
      .toContain('Name')

    expect(wrapper.vm.$el.querySelector('.numbered-company-list-items')).toBeDefined()
  })

  it('renders the numbered company content', () => {
    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(6)

    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. LTD.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Benefit Company')
    expect(listItems[2].textContent).toContain('Request Type: New Business')
    expect(listItems[3].textContent).toContain('You will be filing this Incorporation Application')
    expect(listItems[4].textContent).toContain('Your Incorporation Number will be generated at the end')
    expect(listItems[5].textContent).toContain('It is not possible to request a specific Incorporation Number')
  })
})
