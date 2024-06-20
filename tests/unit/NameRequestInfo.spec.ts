import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import NameRequestInfo from '@/components/common/NameRequestInfo.vue'
import { FilingTypes } from '@/enums'
import { CorrectNameOptions, NameRequestStates } from '@bcrs-shared-components/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NameRequestIF } from '@/interfaces'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
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
} as NameRequestIF

describe('Name Request Info with a NR', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    // Temp Id will always be set with or without an NR
    store.stateModel.tempId = 'T1234567'
    store.stateModel.nameRequest.nrNum = mockNrData.nrNum
    wrapper = mount(NameRequestInfo, { vuetify })
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
    await store.setNameRequest(mockNrData)
    await store.setNameRequestApprovedName(mockNrData.names[0].name)

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
    await store.setNameRequest(mockNrData)
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
    store.stateModel.nameRequest = { ...mockNrData }
    store.stateModel.nameRequest.applicants.addrLine1 = 'line 1'
    store.stateModel.nameRequest.applicants.addrLine2 = 'line 2'
    store.stateModel.nameRequest.applicants.addrLine3 = 'line 3'
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('#name-request-applicant ul li')
    expect(listItems.length).toEqual(4)

    expect(listItems[0].textContent).toContain('Name: John Joe Doe')
    expect(listItems[1].textContent).toContain('Address: line 1, line 2, line 3, Victoria, BC, V9E 2A1, Canada')
    expect(listItems[2].textContent).toContain('Email: test@gov.bc.ca')
    expect(listItems[3].textContent).toContain('Phone: 250-356-9090')
  })

  it('renders the Name Request information with consent not required', async () => {
    store.stateModel.nameRequest = { ...mockNrData }
    store.stateModel.nameRequest.state = NameRequestStates.CONDITIONAL
    store.stateModel.nameRequest.consentFlag = null
    store.stateModel.nameRequestApprovedName = mockNrData.names[0].name
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
    store.stateModel.nameRequest = { ...mockNrData }
    store.stateModel.nameRequest.state = NameRequestStates.CONDITIONAL
    store.stateModel.nameRequest.consentFlag = 'R'
    store.stateModel.nameRequestApprovedName = mockNrData.names[0].name
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
    store.stateModel.nameRequest = { ...mockNrData }
    store.stateModel.nameRequest.state = NameRequestStates.CONDITIONAL
    store.stateModel.nameRequest.consentFlag = 'N'
    store.stateModel.nameRequestApprovedName = mockNrData.names[0].name
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
    store.stateModel.nameRequest = { ...mockNrData }
    store.stateModel.nameRequest.state = NameRequestStates.CONDITIONAL
    store.stateModel.nameRequest.consentFlag = 'Y'
    store.stateModel.nameRequestApprovedName = mockNrData.names[0].name
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

describe('Numbered Amalgamation Info component', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    store.stateModel.tempId = 'T1234567'
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.nameRequest.nrNum = null
    store.stateModel.nameRequestApprovedName = null
    store.stateModel.correctNameOption = CorrectNameOptions.CORRECT_AML_NUMBERED
    wrapper = mount(NameRequestInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders numbered company info', () => {
    expect(wrapper.vm.$el.querySelector('#amalgamation-numbered-info').textContent)
      .toContain('Resulting Business Name')

    expect(wrapper.vm.$el.querySelector('.numbered-company-list-items')).toBeDefined()
  })

  it('renders the numbered amalgamation content', () => {
    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(4)

    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. LTD.')
    expect(listItems[1].textContent).toContain(
      'The company is to be amalgamated with a name created by adding "B.C. LTD." after the incorporation number.')
    expect(listItems[2].textContent).toContain(
      'Your Incorporation Number will be generated at the end of the filing transaction.')
    expect(listItems[3].textContent).toContain('It is not possible to request a specific Incorporation Number.')
  })

  it('renders the entity type description content', () => {
    const listItems = wrapper.vm.$el.querySelectorAll('.entity-type-description li')
    expect(listItems.length).toEqual(1)

    expect(listItems[0].textContent).toContain(' BC Benefit Company ')
  })
})

describe('Name Request Info component without a NR', () => {
  let wrapper: any

  beforeEach(() => {
    store.stateModel.entityType = CorpTypeCd.BC_COMPANY
    store.stateModel.tempId = 'T1234567'
    store.stateModel.nameRequest.nrNum = null
    store.stateModel.nameRequestApprovedName = null
    store.stateModel.tombstone.filingType = FilingTypes.REGISTRATION
    wrapper = mount(NameRequestInfo, { vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders numbered company info', () => {
    expect(wrapper.vm.$el.querySelector('#numbered-company-info').textContent)
      .toContain('Name')

    expect(wrapper.vm.$el.querySelector('.numbered-company-list-items')).toBeDefined()
  })

  it('renders the numbered company content - BC Company', () => {
    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. LTD.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Limited Company')
    expect(listItems[2].textContent).toContain(
      'The company is to be incorporated with a name created by adding "B.C. LTD." after the incorporation number.')
    expect(listItems[3].textContent).toContain(
      'Your Incorporation Number will be generated at the end of the filing transaction.')
    expect(listItems[4].textContent).toContain('It is not possible to request a specific Incorporation Number.')
  })

  it('renders the numbered company content - continued in BC', async () => {
    store.setEntityType(CorpTypeCd.CONTINUE_IN)
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. LTD.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Limited Company')
  })

  it('renders the numbered company content - Community Contribution Company', async () => {
    store.setEntityType(CorpTypeCd.BC_CCC)
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. COMMUNITY CONTRIBUTION COMPANY LTD.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Community Contribution Company')
  })

  it('renders the numbered company content - continued in CCC', async () => {
    store.setEntityType(CorpTypeCd.CCC_CONTINUE_IN)
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. COMMUNITY CONTRIBUTION COMPANY LTD.')
    expect(listItems[1].textContent).toContain('Entity Type: BC Community Contribution Company')
  })

  it('renders the numbered company content - Unlimited Liability Company', async () => {
    store.setEntityType(CorpTypeCd.BC_ULC_COMPANY)
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. UNLIMITED LIABILITY COMPANY')
    expect(listItems[1].textContent).toContain('Entity Type: BC Unlimited Liability Company')
  })

  it('renders the numbered company content - continued in ULC', async () => {
    store.setEntityType(CorpTypeCd.ULC_CONTINUE_IN)
    await Vue.nextTick()

    const listItems = wrapper.vm.$el.querySelectorAll('.numbered-company-list-items li')
    expect(listItems.length).toEqual(5)
    expect(listItems[0].textContent).toContain('[Incorporation Number] B.C. UNLIMITED LIABILITY COMPANY')
    expect(listItems[1].textContent).toContain('Entity Type: BC Unlimited Liability Company')
  })
})
