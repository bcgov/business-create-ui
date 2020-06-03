// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'

// Store
import { getVuexStore } from '@/store'

// Components
import { mount } from '@vue/test-utils'
import { NameRequestInfo } from '@/components/common'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

describe('Name Request Info component', () => {
  let wrapper: any
  const mockNrData = {
    'nrNumber': 'NR 1234567',
    'entityType': 'BC',
    'filingId': null,
    'applicant': {
      'addressLine1': '45 Frasier Drive',
      'addressLine2': null,
      'addressLine3': null,
      'city': 'Victoria',
      'countryTypeCode': 'CA',
      'postalCode': 'V9E 2A1',
      'stateProvinceCode': 'BC',
      'emailAddress': 'test@gov.bc.ca',
      'phoneNumber': '250-356-9090',
      'firstName': 'John',
      'middleName': 'Joe',
      'lastName': 'Doe'
    },
    'details': {
      'approvedName': 'MADRONA BREAD BASKET INC.',
      'consentFlag': null,
      'expirationDate': 'Wed, 24 Jun 2020 07:00:00 GMT',
      'status': 'APPROVED'
    }
  }

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BC'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNumber = mockNrData.nrNumber
    wrapper = mount(NameRequestInfo, { vuetify, store })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders name request info labels', () => {
    expect(wrapper.vm.$el.querySelector('#name-request-info').textContent)
      .toContain('Name Request')

    expect(wrapper.vm.$el.querySelector('#name-request-applicant-info').textContent)
      .toContain('Name Request Applicant')
  })

  it('renders the Name Request information with no data', () => {
    const nrListSelector = '#name-request-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length

    expect(itemCount).toEqual(5)
    expect(wrapper.find('#condition-consent').exists()).toBe(false)

    const title = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const entityType = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const requestType = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const expiryDate = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]
    const status = wrapper.vm.$el.querySelectorAll(nrListSelector)[4]

    expect(title.textContent).toBeDefined()
    expect(entityType.textContent).toContain('Entity Type:')
    expect(requestType.textContent).toContain('Request Type:')
    expect(expiryDate.textContent).toContain('Expiry Date:')
    expect(status.textContent).toContain('Status:')
  })

  it('renders the Name Request information with data', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest = { ...mockNrData }

    await Vue.nextTick()

    const nrListSelector = '#name-request-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length
    const title = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const entityType = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const requestType = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const expiryDate = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]
    const status = wrapper.vm.$el.querySelectorAll(nrListSelector)[4]

    expect(itemCount).toEqual(5)
    expect(wrapper.find('#condition-consent').exists()).toBe(false)
    expect(title.textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(entityType.textContent).toContain('Entity Type: BC Benefit Company')
    expect(requestType.textContent).toContain('Request Type: New Business')
    expect(expiryDate.textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(status.textContent).toContain('Status: APPROVED')
  })

  it('renders the Name Request applicant information with data', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest = { ...mockNrData }

    await Vue.nextTick()

    const nrListSelector = '#name-request-applicant-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length
    const name = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const address = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const email = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const phone = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]

    expect(itemCount).toEqual(4)
    expect(name.textContent).toContain('Name: John Joe Doe')
    expect(address.textContent).toContain('Address: 45 Frasier Drive, Victoria, BC, V9E 2A1, Canada')
    expect(email.textContent).toContain('Email: test@gov.bc.ca')
    expect(phone.textContent).toContain('Phone: 250-356-9090')
  })

  it('renders the Name Request applicant information with no data', () => {
    const nrListSelector = '#name-request-applicant-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length

    expect(itemCount).toEqual(4)

    const name = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const address = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const email = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const phone = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]
    expect(name.textContent).toContain('Name:')
    expect(address.textContent).toContain('Address:')
    expect(email.textContent).toContain('Email:')
    expect(phone.textContent).toContain('Phone:')
  })

  it('renders the Name Request applicant information with multi address line data', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest = { ...mockNrData }
    wrapper.vm.$store.state.stateModel.nameRequest.applicant.addressLine1 = 'line 1'
    wrapper.vm.$store.state.stateModel.nameRequest.applicant.addressLine2 = 'line 2'
    wrapper.vm.$store.state.stateModel.nameRequest.applicant.addressLine3 = 'line 3'

    await Vue.nextTick()

    const nrListSelector = '#name-request-applicant-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length
    const name = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const address = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const email = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const phone = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]

    expect(itemCount).toEqual(4)
    expect(name.textContent).toContain('Name: John Joe Doe')
    expect(address.textContent).toContain('Address: line 1, line 2, line 3, Victoria, BC, V9E 2A1, Canada')
    expect(email.textContent).toContain('Email: test@gov.bc.ca')
    expect(phone.textContent).toContain('Phone: 250-356-9090')
  })

  it('renders the Name Request information with consent received', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest = { ...mockNrData }
    wrapper.vm.$store.state.stateModel.nameRequest.details.status = 'CONDITIONAL'
    wrapper.vm.$store.state.stateModel.nameRequest.details.consentFlag = 'R'

    await Vue.nextTick()

    const nrListSelector = '#name-request-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length
    const title = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const entityType = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const requestType = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const expiryDate = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]
    const status = wrapper.vm.$el.querySelectorAll(nrListSelector)[4]
    const conditionConsent = wrapper.vm.$el.querySelectorAll(nrListSelector)[5]
    expect(itemCount).toEqual(6)
    expect(wrapper.find('#condition-consent').exists()).toBe(true)
    expect(title.textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(entityType.textContent).toContain('Entity Type: BC Benefit Company')
    expect(requestType.textContent).toContain('Request Type: New Business')
    expect(expiryDate.textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(status.textContent).toContain('Status: CONDITIONAL')
    expect(conditionConsent.textContent).toContain('Condition/Consent: Received')
  })

  it('renders the Name Request information with consent not received', async () => {
    wrapper.vm.$store.state.stateModel.nameRequest = { ...mockNrData }
    wrapper.vm.$store.state.stateModel.nameRequest.details.status = 'CONDITIONAL'
    wrapper.vm.$store.state.stateModel.nameRequest.details.consentFlag = null

    await Vue.nextTick()

    const nrListSelector = '#name-request-info ul li'
    const itemCount = wrapper.vm.$el.querySelectorAll(nrListSelector).length
    const title = wrapper.vm.$el.querySelectorAll(nrListSelector)[0]
    const entityType = wrapper.vm.$el.querySelectorAll(nrListSelector)[1]
    const requestType = wrapper.vm.$el.querySelectorAll(nrListSelector)[2]
    const expiryDate = wrapper.vm.$el.querySelectorAll(nrListSelector)[3]
    const status = wrapper.vm.$el.querySelectorAll(nrListSelector)[4]
    const conditionConsent = wrapper.vm.$el.querySelectorAll(nrListSelector)[5]

    expect(itemCount).toEqual(6)
    expect(wrapper.find('#condition-consent').exists()).toBe(true)
    expect(title.textContent).toContain('NR 1234567 - MADRONA BREAD BASKET INC.')
    expect(entityType.textContent).toContain('Entity Type: BC Benefit Company')
    expect(requestType.textContent).toContain('Request Type: New Business')
    expect(expiryDate.textContent).toContain('Expiry Date: Jun 24, 2020')
    expect(status.textContent).toContain('Status: CONDITIONAL')
    expect(conditionConsent.textContent).toContain('Condition/Consent: Not Received')
  })
})

describe('Name Request Info component without an NR', () => {
  let wrapper: any

  beforeEach(() => {
    // Entity type will always be set with or without an NR
    store.state.stateModel.entityType = 'BC'
    // Temp Id will always be set with or without an NR
    store.state.stateModel.tempId = 'T1234567'
    store.state.stateModel.nameRequest.nrNumber = null
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

    const title = listItems[0]
    const entityType = listItems[1]
    const requestType = listItems[2]
    const bulletOne = listItems[3]
    const bulletTwo = listItems[4]
    const bulletThree = listItems[5]

    expect(title.textContent).toContain('[Incorporation Number] B.C. Ltd.')
    expect(entityType.textContent).toContain('Entity Type: BC Benefit Company')
    expect(requestType.textContent).toContain('Request Type: New Business')

    expect(bulletOne.textContent).toContain('You will be filing this Incorporation Application')
    expect(bulletTwo.textContent).toContain('Your Incorporation Number will be generated at the end')
    expect(bulletThree.textContent).toContain('It is not possible to request a specific Incorporation Number')

  })
})
